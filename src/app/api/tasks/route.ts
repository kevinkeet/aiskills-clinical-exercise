import { NextResponse } from 'next/server';
import { loadTasks } from '@/lib/content';

export async function GET() {
  try {
    const tasks = await loadTasks();
    return NextResponse.json({ tasks });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load tasks' },
      { status: 500 }
    );
  }
}
