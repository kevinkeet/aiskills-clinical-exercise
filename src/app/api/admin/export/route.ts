import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { questions } from '@/data/questions';

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

    // Add correct/incorrect column
    const enriched =
      assessmentData?.map((row) => {
        const q = questions.find((q) => q.number === row.question_number);
        return {
          ...row,
          correct_answer: q?.correctAnswer || '',
          is_correct: q?.correctAnswer === row.selected_answer ? 'TRUE' : 'FALSE',
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

  // All participants
  const { data } = await getSupabase()
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  const csv = toCSV(data || [], [
    'participant_id',
    'group_assignment',
    'consent_given',
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
