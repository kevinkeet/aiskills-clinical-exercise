import { NextRequest, NextResponse } from 'next/server';
import { upsertQuestion } from '@/lib/content';
import type { Question, MCQQuestion, ScaleQuestion } from '@/data/questions';

/**
 * Admin upsert for one quiz question. Auth: x-admin-password header.
 *
 * MCQ body:
 *   { number, type: 'mcq', text, options:[{label,value}*4], correctAnswer }
 * Scale body:
 *   { number, type: 'scale', text, min, max, minLabel?, maxLabel? }
 */
export async function POST(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Partial<Question> & { type?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const number = Number(body.number);
  if (!Number.isInteger(number) || number < 1 || number > 13) {
    return NextResponse.json(
      { error: 'number must be an integer between 1 and 13' },
      { status: 400 }
    );
  }

  if (typeof body.text !== 'string' || body.text.trim() === '') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const type = body.type === 'scale' ? 'scale' : 'mcq';

  let q: Question;
  if (type === 'scale') {
    const s = body as Partial<ScaleQuestion>;
    const min = Number(s.min);
    const max = Number(s.max);
    if (!Number.isInteger(min) || !Number.isInteger(max) || max <= min) {
      return NextResponse.json(
        { error: 'min and max must be integers with max > min' },
        { status: 400 }
      );
    }
    q = {
      number,
      type: 'scale',
      text: body.text.trim(),
      min,
      max,
      minLabel: typeof s.minLabel === 'string' ? s.minLabel : undefined,
      maxLabel: typeof s.maxLabel === 'string' ? s.maxLabel : undefined,
    };
  } else {
    const m = body as Partial<MCQQuestion>;
    if (!Array.isArray(m.options) || m.options.length !== 4) {
      return NextResponse.json(
        { error: 'options must be an array of exactly 4 entries (A, B, C, D)' },
        { status: 400 }
      );
    }
    const labels = m.options.map((o) => o.label);
    if (
      !['A', 'B', 'C', 'D'].every((L, i) => labels[i] === L)
    ) {
      return NextResponse.json(
        { error: 'options must be labeled A, B, C, D in order' },
        { status: 400 }
      );
    }
    if (m.options.some((o) => typeof o.value !== 'string' || o.value.trim() === '')) {
      return NextResponse.json(
        { error: 'every option must have a non-empty value' },
        { status: 400 }
      );
    }
    if (!m.correctAnswer || !['A', 'B', 'C', 'D'].includes(m.correctAnswer)) {
      return NextResponse.json(
        { error: 'correctAnswer must be one of A, B, C, D' },
        { status: 400 }
      );
    }
    q = {
      number,
      type: 'mcq',
      text: body.text.trim(),
      options: m.options.map((o) => ({ label: o.label, value: o.value.trim() })),
      correctAnswer: m.correctAnswer,
    };
  }

  try {
    await upsertQuestion(q);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Upsert failed' },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, question: q });
}
