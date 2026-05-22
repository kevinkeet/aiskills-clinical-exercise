import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

/**
 * Admin view of all pilot feedback. Auth: x-admin-password.
 * Returns entries enriched with arm + a snippet of the underlying item
 * (task title or question text) so the admin UI doesn't need extra lookups.
 */
export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = getSupabase();
  const [{ data: rows }, { data: tasks }, { data: questions }, { data: parts }] =
    await Promise.all([
      sb
        .from('pilot_feedback')
        .select('*')
        .order('item_type')
        .order('item_number')
        .order('updated_at', { ascending: false }),
      sb.from('tasks').select('number,title'),
      sb.from('quiz_questions').select('number,text'),
      sb.from('participants').select('participant_id,arm'),
    ]);

  const taskTitle: Record<number, string> = {};
  (tasks ?? []).forEach((t) => {
    taskTitle[t.number] = t.title;
  });
  const questionText: Record<number, string> = {};
  (questions ?? []).forEach((q) => {
    questionText[q.number] = q.text;
  });
  const armByPid: Record<string, string> = {};
  (parts ?? []).forEach((p) => {
    armByPid[p.participant_id] = p.arm;
  });

  const enriched = (rows ?? []).map((r) => ({
    participant_id: r.participant_id,
    arm: armByPid[r.participant_id] ?? '',
    item_type: r.item_type as 'task' | 'question',
    item_number: r.item_number as number,
    item_label:
      r.item_type === 'task'
        ? taskTitle[r.item_number] ?? `(deleted task)`
        : questionText[r.item_number]?.slice(0, 100) ?? `(deleted question)`,
    feedback: r.feedback,
    updated_at: r.updated_at,
  }));

  return NextResponse.json({ feedback: enriched });
}
