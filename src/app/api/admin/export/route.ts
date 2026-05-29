import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isMCQ } from '@/data/questions';
import { loadQuestions } from '@/lib/content';

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get('type') || 'all';

  if (type === 'tasks') {
    const { data } = await getSupabase()
      .from('task_responses')
      .select('*')
      .order('participant_id')
      .order('task_number');

    const csv = toCSV(data || [], [
      'participant_id',
      'task_number',
      'response',
      'time_spent_seconds',
      'started_at',
      'submitted_at',
    ]);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=task_responses.csv',
      },
    });
  }

  if (type === 'assessment') {
    const { data: assessmentData } = await getSupabase()
      .from('assessment_responses')
      .select('*')
      .order('participant_id')
      .order('question_number');
    // Load the current question set from DB so admin edits to correct
    // answers flow through to the is_correct column. Include hidden
    // (inactive) questions so responses collected before a question was
    // hidden still grade correctly in the export.
    const questions = await loadQuestions({ includeInactive: true });

    // Add correct/incorrect column. Scale-type questions (e.g., the
    // post-test comfort rating Q13) have no right answer, so leave both
    // correct_answer and is_correct blank for those rows.
    const enriched =
      assessmentData?.map((row) => {
        const q = questions.find((q) => q.number === row.question_number);
        if (q && isMCQ(q)) {
          return {
            ...row,
            correct_answer: q.correctAnswer,
            is_correct: q.correctAnswer === row.selected_answer ? 'TRUE' : 'FALSE',
          };
        }
        return {
          ...row,
          correct_answer: '',
          is_correct: '',
        };
      }) || [];

    const csv = toCSV(enriched, [
      'participant_id',
      'question_number',
      'selected_answer',
      'correct_answer',
      'is_correct',
      'submitted_at',
    ]);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=assessment_responses.csv',
      },
    });
  }

  if (type === 'pilot-feedback') {
    const sb = getSupabase();
    const { data: rows } = await sb
      .from('pilot_feedback')
      .select('*')
      .order('item_type')
      .order('item_number')
      .order('updated_at', { ascending: false });
    const { data: parts } = await sb.from('participants').select('participant_id,arm');
    const armByPid: Record<string, string> = {};
    (parts ?? []).forEach((p) => {
      armByPid[p.participant_id] = p.arm;
    });
    const flat = (rows ?? []).map((r) => ({
      participant_id: r.participant_id,
      arm: armByPid[r.participant_id] ?? '',
      item_type: r.item_type,
      item_number: r.item_number,
      feedback: r.feedback,
      updated_at: r.updated_at,
    }));
    const csv = toCSV(flat, [
      'participant_id',
      'arm',
      'item_type',
      'item_number',
      'feedback',
      'updated_at',
    ]);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=pilot_feedback.csv',
      },
    });
  }

  if (type === 'chat') {
    const { data } = await getSupabase()
      .from('chat_logs')
      .select('*')
      .order('participant_id')
      .order('created_at');

    const csv = toCSV(data || [], [
      'participant_id',
      'task_number',
      'role',
      'content',
      'created_at',
    ]);

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=chat_logs.csv',
      },
    });
  }

  if (type === 'intake') {
    // Flatten the JSON columns so analysts can open this in a spreadsheet
    // without having to parse JSON in every cell.
    const { data: intakeRows } = await getSupabase()
      .from('intake_responses')
      .select('*')
      .order('participant_id');
    const { data: participantsForJoin } = await getSupabase()
      .from('participants')
      .select('participant_id,pgy,arm');
    const armByPid: Record<string, { pgy?: number; arm?: string }> = {};
    (participantsForJoin ?? []).forEach((p) => {
      armByPid[p.participant_id] = { pgy: p.pgy, arm: p.arm };
    });

    const flat = (intakeRows ?? []).map((row) => {
      const demo = (row.demographics ?? {}) as Record<string, unknown>;
      const pretest = (row.fabry_pretest ?? {}) as Record<string, unknown>;
      const meta = armByPid[row.participant_id] ?? {};
      return {
        participant_id: row.participant_id,
        pgy_assigned: meta.pgy ?? '',
        arm: meta.arm ?? '',
        pgy_self_reported: demo.pgy ?? '',
        track: demo.track ?? '',
        // Pre-test comfort rating (0–10). Same item is repeated as Q13 in
        // the assessment for paired pre/post analysis.
        pretest_comfort_rating: pretest.comfortRating ?? '',
        mismatch_flags: JSON.stringify(row.mismatch_flags ?? {}),
        submitted_at: row.submitted_at,
      };
    });

    const csv = toCSV(flat, [
      'participant_id',
      'pgy_assigned',
      'arm',
      'pgy_self_reported',
      'track',
      'pretest_comfort_rating',
      'mismatch_flags',
      'submitted_at',
    ]);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=intake_responses.csv',
      },
    });
  }

  if (type === 'mailmerge') {
    // For the coordinator: enrollment numbers + emails, ready to mail-merge.
    // Sorted by participant_id. Emails are blank for any rows the coordinator
    // hasn't filled in yet.
    const { data } = await getSupabase()
      .from('participants')
      .select('participant_id,pgy,arm,email,intake_complete,session_completed_at')
      .order('participant_id');
    const csv = toCSV(data || [], [
      'participant_id',
      'pgy',
      'arm',
      'email',
      'intake_complete',
      'session_completed_at',
    ]);
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=mailmerge.csv',
      },
    });
  }

  // All participants
  const { data } = await getSupabase()
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  const csv = toCSV(data || [], [
    'participant_id',
    'pgy',
    'arm',
    'consent_at',
    'intake_completed_at',
    'session_started_at',
    'session_completed_at',
    'created_at',
  ]);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=participants.csv',
    },
  });
}

function toCSV(
  data: Record<string, unknown>[],
  columns: string[]
): string {
  const header = columns.join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = String(row[col] ?? '');
        // Escape CSV values containing commas, quotes, or newlines
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      })
      .join(',')
  );
  return [header, ...rows].join('\n');
}
