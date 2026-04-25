import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipantId } from '@/lib/session';

export async function POST(req: NextRequest) {
  const participantId = await getSessionParticipantId();
  if (!participantId) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }

  let body: {
    taskNumber?: number;
    response?: string;
    timeSpentSeconds?: number;
    startedAt?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { taskNumber, response, timeSpentSeconds, startedAt } = body;
  if (!taskNumber || !response || typeof timeSpentSeconds !== 'number' || !startedAt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
}
