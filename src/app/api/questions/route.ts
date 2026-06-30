import { NextResponse } from 'next/server';
import { loadQuestions } from '@/lib/content';
import { isMCQ } from '@/data/questions';

/**
 * PUBLIC, participant-facing question feed (used by /assessment).
 *
 * SECURITY: never include the answer key here. A participant can read any
 * response this endpoint returns from their browser's network tab, so
 * shipping `correctAnswer` would let them see every right answer and
 * invalidate the assessment. Grading is done server-side in
 * /api/my-results, and the answer-key review there is gated to pilots.
 * The admin editor reads the full record (with correctAnswer) from the
 * auth-gated /api/admin/questions instead.
 */
export async function GET() {
  try {
    const questions = await loadQuestions();
    const safe = questions.map((q) =>
      isMCQ(q)
        ? {
            number: q.number,
            type: 'mcq' as const,
            text: q.text,
            options: q.options,
          }
        : q
    );
    return NextResponse.json({ questions: safe });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load questions' },
      { status: 500 }
    );
  }
}
