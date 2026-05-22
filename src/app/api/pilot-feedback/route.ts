import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getSessionParticipant } from '@/lib/session';

/**
 * Pilot-only feedback on one task or quiz question.
 *
 * Auth: session cookie. Only participants whose ID begins with PILOT can
 *       write or read feedback. Real recruits (P-NNN) and the AI/CONTROL
 *       smoke-test IDs are blocked with 403.
 *
 * GET → returns this pilot's feedback as
 *   { feedback: [{ itemType, itemNumber, feedback }] }
 *
 * POST { itemType: 'task' | 'question', itemNumber: int, feedback: string }
 *   - Trimmed feedback === '' → deletes the row (so clearing the box removes
 *     stale text rather than storing an empty string).
 *   - Otherwise upserts on (participant_id, item_type, item_number).
 */

function isPilot(pid: string): boolean {
  return /^PILOT\d+$/i.test(pid);
}

export async function GET() {
  const session = await getSessionParticipant();
  if (!session) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }
  if (!isPilot(session.participantId)) {
    return NextResponse.json({ feedback: [] });
  }
  const { data, error } = await getSupabase()
    .from('pilot_feedback')
    .select('item_type,item_number,feedback')
    .eq('participant_id', session.participantId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    feedback: (data ?? []).map((r) => ({
      itemType: r.item_type,
      itemNumber: r.item_number,
      feedback: r.feedback,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getSessionParticipant();
  if (!session) {
    return NextResponse.json({ error: 'No active session' }, { status: 401 });
  }
  if (!isPilot(session.participantId)) {
    return NextResponse.json(
      { error: 'Feedback is only available for pilot participants.' },
      { status: 403 }
    );
  }

  let body: { itemType?: string; itemNumber?: number; feedback?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (body.itemType !== 'task' && body.itemType !== 'question') {
    return NextResponse.json(
      { error: "itemType must be 'task' or 'question'" },
      { status: 400 }
    );
  }
  const itemNumber = Number(body.itemNumber);
  if (!Number.isInteger(itemNumber) || itemNumber < 1) {
    return NextResponse.json(
      { error: 'itemNumber must be a positive integer' },
      { status: 400 }
    );
  }
  const text = typeof body.feedback === 'string' ? body.feedback.trim() : '';

  const sb = getSupabase();
  if (text === '') {
    const { error: delErr } = await sb
      .from('pilot_feedback')
      .delete()
      .eq('participant_id', session.participantId)
      .eq('item_type', body.itemType)
      .eq('item_number', itemNumber);
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, cleared: true });
  }

  const { error: upErr } = await sb.from('pilot_feedback').upsert(
    {
      participant_id: session.participantId,
      item_type: body.itemType,
      item_number: itemNumber,
      feedback: text,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'participant_id,item_type,item_number' }
  );
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
