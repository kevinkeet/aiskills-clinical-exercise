import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { questions, isMCQ } from '@/data/questions';

const POST_COMFORT_QNUM = 13;

interface ArmQuizStats {
  arm: 'AI' | 'CONTROL';
  participants: number; // total seeded in this arm
  completers: number; // answered all graded MCQs
  meanScore: number | null; // out of total graded MCQ
  meanScorePct: number | null; // 0..100
  totalGradedQuestions: number; // = 12
  meanPreComfort: number | null;
  nWithPreComfort: number;
  meanPostComfort: number | null;
  nWithPostComfort: number;
  meanComfortDelta: number | null; // post - pre, paired
  nWithComfortPair: number;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
function mean(xs: number[]): number | null {
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getSupabase();
  const { data: participants } = await sb
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: taskResponses } = await sb.from('task_responses').select('*');
  const { data: assessmentResponses } = await sb
    .from('assessment_responses')
    .select('*');
  const { data: intakeRows } = await sb
    .from('intake_responses')
    .select('participant_id,fabry_pretest');

  const aiCount = participants?.filter((p) => p.arm === 'AI').length || 0;
  const controlCount = participants?.filter((p) => p.arm === 'CONTROL').length || 0;
  const intakeCompleteCount =
    participants?.filter((p) => p.intake_complete === true).length || 0;

  const tasksByParticipant: Record<string, number> = {};
  taskResponses?.forEach((tr) => {
    tasksByParticipant[tr.participant_id] =
      (tasksByParticipant[tr.participant_id] || 0) + 1;
  });

  // Build correct-answer lookup for MCQ questions only.
  const correctByQNum: Record<number, string> = {};
  for (const q of questions) {
    if (isMCQ(q)) correctByQNum[q.number] = q.correctAnswer;
  }
  const totalGradedQuestions = Object.keys(correctByQNum).length;

  // Per-participant: count correct, count answered MCQs, capture post comfort.
  const correctByPid: Record<string, number> = {};
  const mcqAnsweredByPid: Record<string, number> = {};
  const postComfortByPid: Record<string, number> = {};
  for (const ar of assessmentResponses ?? []) {
    if (correctByQNum[ar.question_number] !== undefined) {
      mcqAnsweredByPid[ar.participant_id] =
        (mcqAnsweredByPid[ar.participant_id] || 0) + 1;
      if (correctByQNum[ar.question_number] === ar.selected_answer) {
        correctByPid[ar.participant_id] =
          (correctByPid[ar.participant_id] || 0) + 1;
      }
    }
    if (ar.question_number === POST_COMFORT_QNUM) {
      const v = parseInt(ar.selected_answer, 10);
      if (!isNaN(v)) postComfortByPid[ar.participant_id] = v;
    }
  }

  // Pre-test comfort from intake_responses.fabry_pretest.comfortRating
  const preComfortByPid: Record<string, number> = {};
  for (const ir of intakeRows ?? []) {
    const pretest = ir.fabry_pretest as {
      comfortRating?: number | string;
    } | null;
    const raw = pretest?.comfortRating;
    const v = typeof raw === 'number' ? raw : typeof raw === 'string' ? parseInt(raw, 10) : NaN;
    if (!isNaN(v)) preComfortByPid[ir.participant_id] = v;
  }

  // Fully-completed participants (5 tasks + all 12 graded MCQs).
  const completedParticipants = new Set<string>();
  participants?.forEach((p) => {
    if (
      (tasksByParticipant[p.participant_id] || 0) >= 5 &&
      (mcqAnsweredByPid[p.participant_id] || 0) >= totalGradedQuestions
    ) {
      completedParticipants.add(p.participant_id);
    }
  });

  // Per-arm quiz performance + comfort change.
  function statsForArm(arm: 'AI' | 'CONTROL'): ArmQuizStats {
    const armParticipants = (participants ?? []).filter((p) => p.arm === arm);

    const completers = armParticipants.filter(
      (p) => (mcqAnsweredByPid[p.participant_id] ?? 0) >= totalGradedQuestions
    );
    const scores = completers.map((p) => correctByPid[p.participant_id] ?? 0);
    const meanScore = mean(scores);

    const preValues = armParticipants
      .map((p) => preComfortByPid[p.participant_id])
      .filter((v): v is number => typeof v === 'number');
    const postValues = armParticipants
      .map((p) => postComfortByPid[p.participant_id])
      .filter((v): v is number => typeof v === 'number');

    const deltas = armParticipants
      .map((p) => {
        const pre = preComfortByPid[p.participant_id];
        const post = postComfortByPid[p.participant_id];
        return typeof pre === 'number' && typeof post === 'number'
          ? post - pre
          : null;
      })
      .filter((v): v is number => v !== null);

    return {
      arm,
      participants: armParticipants.length,
      completers: completers.length,
      meanScore: meanScore !== null ? round1(meanScore) : null,
      meanScorePct:
        meanScore !== null
          ? Math.round((meanScore / totalGradedQuestions) * 100)
          : null,
      totalGradedQuestions,
      meanPreComfort: preValues.length ? round1(mean(preValues)!) : null,
      nWithPreComfort: preValues.length,
      meanPostComfort: postValues.length ? round1(mean(postValues)!) : null,
      nWithPostComfort: postValues.length,
      meanComfortDelta: deltas.length ? round1(mean(deltas)!) : null,
      nWithComfortPair: deltas.length,
    };
  }

  const aiQuizStats = statsForArm('AI');
  const controlQuizStats = statsForArm('CONTROL');

  const avgTimeByTask: Record<number, number> = {};
  for (let t = 1; t <= 5; t++) {
    const times =
      taskResponses
        ?.filter((tr) => tr.task_number === t)
        .map((tr) => tr.time_spent_seconds) || [];
    avgTimeByTask[t] =
      times.length > 0
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
        : 0;
  }

  // Enrich the recent-participants slice with per-row score and progress.
  const recentParticipants = (participants ?? []).slice(0, 10).map((p) => ({
    ...p,
    correct: correctByPid[p.participant_id] ?? 0,
    mcq_answered: mcqAnsweredByPid[p.participant_id] ?? 0,
    total_graded: totalGradedQuestions,
    pre_comfort: preComfortByPid[p.participant_id] ?? null,
    post_comfort: postComfortByPid[p.participant_id] ?? null,
  }));

  return NextResponse.json({
    totalParticipants: participants?.length || 0,
    intakeCompleteCount,
    aiGroupCount: aiCount,
    controlGroupCount: controlCount,
    completedCount: completedParticipants.size,
    totalGradedQuestions,
    avgTimeByTask,
    aiQuizStats,
    controlQuizStats,
    recentParticipants,
  });
}
