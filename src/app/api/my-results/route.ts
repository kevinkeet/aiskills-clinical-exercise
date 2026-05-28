import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipant } from '@/lib/session';
import { loadQuestions } from '@/lib/content';
import { isMCQ } from '@/data/questions';

/**
 * Per-participant quiz results for the completion page.
 *
 * Everyone gets their score (correct / total graded MCQs).
 *
 * The detailed answer key (question text, the correct option, and
 * whether each answer was right) is returned ONLY to pilot participants
 * (IDs matching /^PILOT\d+$/). Real recruits do NOT receive the answer
 * key — if 120 residents who know each other could each see the full
 * key, early participants could coach later ones and contaminate the
 * study. Flip `revealAnswerKeyToEveryone` to true to open it up.
 */
const revealAnswerKeyToEveryone = false;

function isPilot(pid: string): boolean {
  return /^PILOT\d+$/i.test(pid);
}

export async function GET() {
  const session = await getSessionParticipant();
  if (!session) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }

  const questions = await loadQuestions();
  const mcqs = questions.filter(isMCQ);

  const { data: responses, error } = await getSupabase()
    .from('assessment_responses')
    .select('question_number,selected_answer')
    .eq('participant_id', session.participantId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const answerByNum: Record<number, string> = {};
  (responses ?? []).forEach((r) => {
    answerByNum[r.question_number] = r.selected_answer;
  });

  let score = 0;
  for (const q of mcqs) {
    if (answerByNum[q.number] === q.correctAnswer) score += 1;
  }

  const showKey = revealAnswerKeyToEveryone || isPilot(session.participantId);

  const review = showKey
    ? mcqs.map((q) => {
        const yourAnswer = answerByNum[q.number] ?? null;
        const yourOption =
          q.options.find((o) => o.label === yourAnswer)?.value ?? null;
        const correctOption =
          q.options.find((o) => o.label === q.correctAnswer)?.value ?? null;
        return {
          number: q.number,
          text: q.text,
          yourAnswer,
          yourAnswerText: yourOption,
          correctAnswer: q.correctAnswer,
          correctAnswerText: correctOption,
          isCorrect: yourAnswer === q.correctAnswer,
        };
      })
    : null;

  return NextResponse.json({
    score,
    total: mcqs.length,
    showKey,
    review,
  });
}
