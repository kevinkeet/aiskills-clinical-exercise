import { NextResponse } from 'next/server';
import { loadQuestions } from '@/lib/content';

export async function GET() {
  try {
    const questions = await loadQuestions();
    return NextResponse.json({ questions });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load questions' },
      { status: 500 }
    );
  }
}
