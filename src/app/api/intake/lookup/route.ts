import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { setSessionCookie } from '@/lib/session';

const ENROLLMENT_RE = /^P-\d{1,4}$/;

export async function POST(req: NextRequest) {
  let body: { enrollmentNumber?: string; consentTimestamp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const raw = (body.enrollmentNumber ?? '').trim().toUpperCase();
  if (!ENROLLMENT_RE.test(raw)) {
    return NextResponse.json(
      { error: 'Enrollment number must be in the format P-NNN.' },
      { status: 400 }
    );
  }

  let sb;
  try {
    sb = getSupabase();
  } catch (e) {
    return NextResponse.json(
      { error: `Server config error: ${e instanceof Error ? e.message : 'unknown'}` },
      { status: 500 }
    );
  }

  const { data: participant, error } = await sb
    .from('participants')
    .select(
      'participant_id,pgy,arm,consent_at,intake_complete,session_completed_at,current_step'
    )
    .eq('participant_id', raw)
    .maybeSingle();

  if (error) {
    // Surface the real DB error so misconfiguration (missing column, table not migrated, etc.)
    // is visible in the response rather than swallowed as "Lookup failed".
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    );
  }
  if (!participant) {
    return NextResponse.json(
      { error: 'We could not find that enrollment number. Please check with the study coordinator.' },
      { status: 404 }
    );
  }
  if (
    participant.intake_complete === true &&
    participant.session_completed_at !== null &&
    participant.session_completed_at !== undefined
  ) {
    return NextResponse.json(
      { error: 'This enrollment number has already been used to complete the study.' },
      { status: 409 }
    );
  }

  // Persist consent_at if not yet on file. Use the timestamp the client
  // captured when the box was checked, falling back to now.
  const updates: Record<string, unknown> = {};
  if (!participant.consent_at) {
    const ts = body.consentTimestamp ? new Date(body.consentTimestamp) : new Date();
    if (!isNaN(ts.getTime())) {
      updates.consent_at = ts.toISOString();
    } else {
      updates.consent_at = new Date().toISOString();
    }
  }
  // Advance current_step if we are still at consent or earlier.
  if (
    !participant.current_step ||
    participant.current_step === 'consent' ||
    participant.current_step === 'enrollment'
  ) {
    updates.current_step = 'demographics';
  }
  if (Object.keys(updates).length > 0) {
    const { error: updErr } = await sb
      .from('participants')
      .update(updates)
      .eq('participant_id', raw);
    if (updErr) {
      return NextResponse.json(
        { error: `Database error on update: ${updErr.message}` },
        { status: 500 }
      );
    }
  }

  try {
    await setSessionCookie(raw);
  } catch (e) {
    return NextResponse.json(
      { error: `Session config error: ${e instanceof Error ? e.message : 'unknown'}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    participantId: participant.participant_id,
    pgy: participant.pgy,
    // arm intentionally returned so the server can configure the next page,
    // but the frontend MUST NOT display it. Downstream pages re-fetch arm
    // via /api/session/me from the session cookie, never from client state.
    arm: participant.arm,
    resumeStep: updates.current_step ?? participant.current_step ?? 'demographics',
  });
}
