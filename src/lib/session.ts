/**
 * Server-side session: a single HTTP-only, HMAC-signed cookie carrying
 * { participantId, sessionId, issuedAt }. The arm assignment is NEVER
 * stored in the cookie; downstream routes always look it up from the
 * participants table so the client cannot influence it.
 *
 * The sessionId enforces single-active-session: each /api/intake/lookup
 * generates a fresh sessionId and writes it to participants.active_session_id.
 * Any cookie carrying a stale sessionId is rejected. This means if the
 * participant logs in from a second device, the first device is logged out.
 */
import { cookies } from 'next/headers';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { getSupabase } from './supabase';

const COOKIE_NAME = 'aiskills_sess';
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

interface SessionPayload {
  participantId: string;
  sessionId: string;
  issuedAt: number;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'SESSION_SECRET env var must be set to a random string of at least 16 characters.'
    );
  }
  return secret;
}

function sign(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json, 'utf8').toString('base64url');
  const mac = createHmac('sha256', getSecret()).update(b64).digest('base64url');
  return `${b64}.${mac}`;
}

function verify(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64, mac] = parts;
  let expected: Buffer;
  let provided: Buffer;
  try {
    expected = Buffer.from(
      createHmac('sha256', getSecret()).update(b64).digest('base64url'),
      'utf8'
    );
    provided = Buffer.from(mac, 'utf8');
  } catch {
    return null;
  }
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;
  try {
    const json = Buffer.from(b64, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as SessionPayload;
    if (
      typeof parsed.participantId !== 'string' ||
      typeof parsed.sessionId !== 'string' ||
      typeof parsed.issuedAt !== 'number'
    ) {
      return null;
    }
    if (Date.now() - parsed.issuedAt > MAX_AGE_SECONDS * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Create a fresh sessionId, write it to participants.active_session_id,
 * and set the signed cookie. Any prior session for this participant is
 * implicitly invalidated.
 */
export async function setSessionCookie(participantId: string): Promise<string> {
  const sessionId = randomBytes(16).toString('hex');
  const sb = getSupabase();
  const { error } = await sb
    .from('participants')
    .update({ active_session_id: sessionId })
    .eq('participant_id', participantId);
  if (error) {
    throw new Error(`Failed to rotate active session: ${error.message}`);
  }
  const token = sign({ participantId, sessionId, issuedAt: Date.now() });
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return sessionId;
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export interface ParticipantSession {
  participantId: string;
  pgy: number;
  arm: 'AI' | 'CONTROL';
  intakeComplete: boolean;
  currentStep: string | null;
  sessionCompletedAt: string | null;
}

/**
 * Read the full participant record for the session-cookie's participantId,
 * verifying the sessionId matches the DB's active_session_id (single-session lock).
 * Returns null if no valid session, sessionId mismatch, or participant missing.
 */
export async function getSessionParticipant(): Promise<ParticipantSession | null> {
  const store = await cookies();
  const c = store.get(COOKIE_NAME);
  if (!c) return null;
  const payload = verify(c.value);
  if (!payload) return null;
  const { data, error } = await getSupabase()
    .from('participants')
    .select(
      'participant_id,pgy,arm,intake_complete,current_step,session_completed_at,active_session_id'
    )
    .eq('participant_id', payload.participantId)
    .maybeSingle();
  if (error || !data) return null;
  if (data.active_session_id && data.active_session_id !== payload.sessionId) {
    // Another device has logged in since this cookie was issued.
    return null;
  }
  return {
    participantId: data.participant_id,
    pgy: data.pgy,
    arm: data.arm as 'AI' | 'CONTROL',
    intakeComplete: !!data.intake_complete,
    currentStep: data.current_step ?? null,
    sessionCompletedAt: data.session_completed_at ?? null,
  };
}

/** Convenience wrapper that only returns the participantId (or null). */
export async function getSessionParticipantId(): Promise<string | null> {
  const p = await getSessionParticipant();
  return p?.participantId ?? null;
}
