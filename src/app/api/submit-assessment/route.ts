import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { participantId, answers } = await req.json();

    if (!participantId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Missing participantId or answers' },
        { status: 400 }
      );
    }

    const rows = answers.map(
      (a: { questionNumber: number; selectedAnswer: string }) => ({
        participant_id: participantId,
        question_number: a.questionNumber,
        selected_answer: a.selectedAnswer,
      })
    );

    const { error } = await getSupabase().from('assessment_responses').upsert(rows, {
      onConflict: 'participant_id,question_number',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
