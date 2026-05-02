import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

/**
 * Wipe all responses for a participant and reset their progress to the
 * beginning of the intake flow. Keeps the row in `participants` and
 * preserves their pre-randomized arm assignment so they can re-enter
 * with the same enrollment number and start fresh.
 *
 * Auth: ADMIN_PASSWORD via x-admin-password header (same as the rest of
 * the admin routes).
 *
 * Body: { participantId: "P-001" }
 */
export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { participantId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const pid = body.participantId?.trim().toUpperCase();
  if (!pid || !/^[A-Z][A-Z0-9-]{1,15}$/.test(pid)) {
    return NextResponse.json(
      { error: 'participantId must be a 2–16 character upper-case alphanumeric/dash identifier (e.g., P-001 or AI)' },
      { status: 400 }
    );
  }

  const sb = getSupabase();

  // Verify the participant exists.
  const { data: existing, error: lookupErr } = await sb
    .from('participants')
    .select('participant_id')
    .eq('participant_id', pid)
    .maybeSingle();
  if (lookupErr) {
    return NextResponse.json({ error: lookupErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
  }

  // Delete dependent rows first (RLS-safe order). FK is `on delete cascade`
  // but explicit deletes keep the result deterministic.
  const tables = [
    'chat_logs',
    'assessment_responses',
    'task_responses',
    'intake_responses',
  ];
  for (const t of tables) {
    const { error } = await sb.from(t).delete().eq('participant_id', pid);
    if (error) {
      return NextResponse.json(
        { error: `Failed to clear ${t}: ${error.message}` },
        { status: 500 }
      );
    }
  }

  // Reset progress fields. Keep participant_id, pgy, arm, email, created_at.
  const { error: updErr } = await sb
    .from('participants')
    .update({
      consent_at: null,
      intake_complete: false,
      intake_completed_at: null,
      session_started_at: null,
      session_completed_at: null,
      current_step: 'consent',
      assessment_time_seconds: null,
      active_session_id: null,
    })
    .eq('participant_id', pid);
  if (updErr) {
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, participantId: pid });
}
