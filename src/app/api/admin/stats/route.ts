import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: participants } = await getSupabase()
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: taskResponses } = await getSupabase()
    .from('task_responses')
    .select('*');

  const { data: assessmentResponses } = await getSupabase()
    .from('assessment_responses')
    .select('*');

  const aiCount =
    participants?.filter((p) => p.group_assignment === 'ai').length || 0;
  const controlCount =
    participants?.filter((p) => p.group_assignment === 'control').length || 0;

  // Compute completed (all 6 tasks + 12 assessment answers)
  const completedParticipants = new Set<string>();
  const tasksByParticipant: Record<string, number> = {};
  taskResponses?.forEach((tr) => {
    tasksByParticipant[tr.participant_id] =
      (tasksByParticipant[tr.participant_id] || 0) + 1;
  });
  const assessmentByParticipant: Record<string, number> = {};
  assessmentResponses?.forEach((ar) => {
    assessmentByParticipant[ar.participant_id] =
      (assessmentByParticipant[ar.participant_id] || 0) + 1;
  });
  participants?.forEach((p) => {
    if (
      (tasksByParticipant[p.participant_id] || 0) >= 5 &&
      (assessmentByParticipant[p.participant_id] || 0) >= 12
    ) {
      completedParticipants.add(p.participant_id);
    }
  });

  // Average time per task
  const avgTimeByTask: Record<number, number> = {};
  for (let t = 1; t <= 5; t++) {
    const times =
      taskResponses
        ?.filter((tr) => tr.task_number === t)
        .map((tr) => tr.time_spent_seconds) || [];
    avgTimeByTask[t] =
      times.length > 0
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
        : 0;
  }

  return NextResponse.json({
    totalParticipants: participants?.length || 0,
    aiGroupCount: aiCount,
    controlGroupCount: controlCount,
    completedCount: completedParticipants.size,
    avgTimeByTask,
    recentParticipants: participants?.slice(0, 10) || [],
  });
}
