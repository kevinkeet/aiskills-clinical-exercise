import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { loadQuestions } from '@/lib/content';
import { isMCQ } from '@/data/questions';

function requireAuth(req: NextRequest): NextResponse | null {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * Per-question response performance, for the admin Study Content editor.
 * Auth: x-admin-password.
 *
 * Returns, keyed by question number:
 *   { taken, correct }
 * where `taken` is the number of participants who answered the question
 * (assessment_responses is unique per participant+question) and `correct`
 * is how many of those matched the answer key. For scale questions
 * `correct` is always 0 and should be treated as not applicable.
 *
 * Counts every response in the table, which during the pilot phase is the
 * pilot cohort. Inactive (hidden) questions are still scored so the PI can
 * see how a question performed before deciding to bring it back.
 */
export async function GET(req: NextRequest) {
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  try {
    const questions = await loadQuestions({ includeInactive: true });
    const keyByNum: Record<number, string> = {};
    for (const q of questions) {
      if (isMCQ(q)) keyByNum[q.number] = q.correctAnswer;
    }

    const { data, error } = await getSupabase()
      .from('assessment_responses')
      .select('question_number,selected_answer');
    if (error) throw new Error(error.message);

    const stats: Record<number, { taken: number; correct: number }> = {};
    for (const r of (data ?? []) as {
      question_number: number;
      selected_answer: string;
    }[]) {
      const n = r.question_number;
      if (!stats[n]) stats[n] = { taken: 0, correct: 0 };
      stats[n].taken += 1;
      if (keyByNum[n] !== undefined && r.selected_answer === keyByNum[n]) {
        stats[n].correct += 1;
      }
    }

    return NextResponse.json({ stats });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load question stats' },
      { status: 500 }
    );
  }
}
