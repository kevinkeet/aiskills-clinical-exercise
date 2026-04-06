import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'register') {
      const { participantId, group } = body;
      if (!participantId || !group) {
        return NextResponse.json(
          { error: 'Missing participantId or group' },
          { status: 400 }
        );
      }

      const { error } = await getSupabase().from('participants').upsert(
        {
          participant_id: participantId,
          group_assignment: group,
          consent_given: true,
        },
        { onConflict: 'participant_id' }
      );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Submit task response
    const { participantId, taskNumber, response, timeSpentSeconds, startedAt } =
      body;

    if (!participantId || !taskNumber || !response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { error } = await getSupabase().from('task_responses').upsert(
      {
        participant_id: participantId,
        task_number: taskNumber,
        response,
        time_spent_seconds: timeSpentSeconds,
        started_at: startedAt,
      },
      { onConflict: 'participant_id,task_number' }
    );

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
