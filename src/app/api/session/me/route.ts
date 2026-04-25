import { NextResponse } from 'next/server';
import { getSessionParticipant } from '@/lib/session';

export async function GET() {
  const p = await getSessionParticipant();
  if (!p) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    participantId: p.participantId,
    arm: p.arm,
    intakeComplete: p.intakeComplete,
    currentStep: p.currentStep,
    sessionCompletedAt: p.sessionCompletedAt,
  });
}
