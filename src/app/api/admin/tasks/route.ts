import { NextRequest, NextResponse } from 'next/server';
import { upsertTask } from '@/lib/content';
import type { Task } from '@/data/tasks';

/**
 * Admin upsert for one task. Auth: x-admin-password header.
 * Body: { number, title, prompt, minChars, showAdditionalFindings? }
 */
export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Partial<Task>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const number = Number(body.number);
  if (!Number.isInteger(number) || number < 1 || number > 5) {
    return NextResponse.json(
      { error: 'number must be an integer between 1 and 5' },
      { status: 400 }
    );
  }
  if (typeof body.title !== 'string' || body.title.trim() === '') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (typeof body.prompt !== 'string' || body.prompt.trim() === '') {
    return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
  }
  const minChars = Number(body.minChars);
  if (!Number.isInteger(minChars) || minChars < 0) {
    return NextResponse.json(
      { error: 'minChars must be a non-negative integer' },
      { status: 400 }
    );
  }

  const task: Task = {
    number,
    title: body.title.trim(),
    prompt: body.prompt.trim(),
    minChars,
    showAdditionalFindings: !!body.showAdditionalFindings,
  };

  try {
    await upsertTask(task);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upsert failed' },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, task });
}
