import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipantId } from '@/lib/session';

export async function POST(req: NextRequest) {
  const sessionPid = await getSessionParticipantId();
  if (!sessionPid) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }

  let body: {
    demographics?: Record<string, unknown>;
    fabryPretest?: Record<string, unknown>;
    mismatchFlags?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.demographics || !body.fabryPretest) {
    return NextResponse.json(
      { error: 'Missing demographics or fabryPretest' },
      { status: 400 }
    );
  }

  const sb = getSupabase();

  // Verify the participant still exists.
  const { data: participant } = await sb
    .from('participants')
    .select('participant_id')
    .eq('participant_id', sessionPid)
    .maybeSingle();
  if (!participant) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
  }

  const { error: insertErr } = await sb.from('intake_responses').upsert(
    {
      participant_id: sessionPid,
      demographics: body.demographics,
      fabry_pretest: body.fabryPretest,
      mismatch_flags: body.mismatchFlags ?? {},
    },
    { onConflict: 'participant_id' }
  );
  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  const nowIso = new Date().toISOString();
  await sb
    .from('participants')
    .update({
      intake_complete: true,
      intake_completed_at: nowIso,
      current_step: 'case',
      session_started_at: nowIso,
    })
    .eq('participant_id', sessionPid);

  return NextResponse.json({ success: true });
}
