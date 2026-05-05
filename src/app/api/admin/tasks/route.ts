import { NextRequest, NextResponse } from 'next/server';
import { upsertTask, deleteTask } from '@/lib/content';
import type { Task } from '@/data/tasks';

function requireAuth(req: NextRequest): NextResponse | null {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

/**
 * Upsert one task. Used for both add and edit. Auth: x-admin-password.
 * Body: { number, title, prompt, minChars, showAdditionalFindings? }
 */
export async function POST(req: NextRequest) {
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  let body: Partial<Task>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const number = Number(body.number);
  if (!Number.isInteger(number) || number < 1) {
    return NextResponse.json(
      { error: 'number must be a positive integer' },
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

/**
 * Delete one task by number. Auth: x-admin-password.
 * Query string: ?number=N. Existing task_responses for that task remain
 * in the database so historical data is preserved.
 */
export async function DELETE(req: NextRequest) {
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  const numberStr = req.nextUrl.searchParams.get('number');
  const number = Number(numberStr);
  if (!Number.isInteger(number) || number < 1) {
    return NextResponse.json(
      { error: 'number query parameter must be a positive integer' },
      { status: 400 }
    );
  }
  try {
    await deleteTask(number);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Delete failed' },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, deleted: number });
}
