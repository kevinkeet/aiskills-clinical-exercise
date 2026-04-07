import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { participantId, answers, totalTimeSeconds } = await req.json();

    if (!participantId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Missing participantId or answers' },
        { status: 400 }
      );
    }

    const rows = answers.map(
      (a: { questionNumber: number; selectedAnswer: string; timeSpentSeconds?: number }) => ({
        participant_id: participantId,
        question_number: a.questionNumber,
        selected_answer: a.selectedAnswer,
        time_spent_seconds: a.timeSpentSeconds || 0,
      })
    );

    const { error } = await getSupabase().from('assessment_responses').upsert(rows, {
      onConflict: 'participant_id,question_number',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update participant record with total assessment time
    if (totalTimeSeconds !== undefined) {
      await getSupabase()
        .from('participants')
        .update({ assessment_time_seconds: totalTimeSeconds })
        .eq('participant_id', participantId);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
