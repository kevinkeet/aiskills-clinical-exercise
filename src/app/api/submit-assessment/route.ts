import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipantId } from '@/lib/session';

/**
 * Stores assessment answers (upsert by participant_id + question_number).
 *
 * - Per-answer autosave: { answers: [{ questionNumber, selectedAnswer, ... }] }
 * - Final submit: { answers: [...all], totalTimeSeconds, final: true }
 *
 * Only the final submit (`final: true`) marks session_completed_at and
 * sets current_step = 'done'. Autosaves only persist the row.
 */
export async function POST(req: NextRequest) {
  const participantId = await getSessionParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }

  let body: {
    answers?: Array<{
      questionNumber: number;
      selectedAnswer: string;
      timeSpentSeconds?: number;
    }>;
    totalTimeSeconds?: number;
    final?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.answers || !Array.isArray(body.answers)) {
    return NextResponse.json({ error: 'Missing answers' }, { status: 400 });
  }

  const sb = getSupabase();
  const rows = body.answers.map((a) => ({
    participant_id: participantId,
    question_number: a.questionNumber,
    selected_answer: a.selectedAnswer,
    time_spent_seconds: a.timeSpentSeconds ?? 0,
  }));

  const { error } = await sb.from('assessment_responses').upsert(rows, {
    onConflict: 'participant_id,question_number',
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.final) {
    const updates: Record<string, unknown> = {
      session_completed_at: new Date().toISOString(),
      current_step: 'done',
    };
    if (typeof body.totalTimeSeconds === 'number') {
      updates.assessment_time_seconds = body.totalTimeSeconds;
    }
    await sb.from('participants').update(updates).eq('participant_id', participantId);
  }

  return NextResponse.json({ success: true });
}
