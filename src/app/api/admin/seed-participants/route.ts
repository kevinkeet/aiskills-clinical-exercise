import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

/**
 * Coordinator-only endpoint. Accepts a CSV upload (multipart, field name "csv")
 * with header row: participant_id,pgy,arm
 *
 *   curl -X POST https://aiskills.kevinkeet.com/api/admin/seed-participants \
 *     -H "Authorization: Bearer $COORDINATOR_TOKEN" \
 *     -F "csv=@participants_seed.csv"
 *
 * Rejects the entire upload if any row has a participant_id that already
 * exists with a non-null intake_completed_at.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.COORDINATOR_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: 'COORDINATOR_TOKEN not configured on server' },
      { status: 500 }
    );
  }
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let csvText: string;
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('csv');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing csv file field' }, { status: 400 });
    }
    csvText = await file.text();
  } else {
    csvText = await req.text();
  }

  const rows = parseCSV(csvText);
  if (rows.length === 0) {
    return NextResponse.json({ error: 'CSV is empty' }, { status: 400 });
  }

  const expectedHeaders = ['participant_id', 'pgy', 'arm'];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  for (const h of expectedHeaders) {
    if (!headers.includes(h)) {
      return NextResponse.json(
        { error: `Missing required column: ${h}` },
        { status: 400 }
      );
    }
  }
  const idIdx = headers.indexOf('participant_id');
  const pgyIdx = headers.indexOf('pgy');
  const armIdx = headers.indexOf('arm');

  const records: Array<{ participant_id: string; pgy: number; arm: 'AI' | 'CONTROL' }> = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.every((c) => c.trim() === '')) continue;
    const id = r[idIdx]?.trim().toUpperCase();
    const pgy = parseInt(r[pgyIdx]?.trim() ?? '', 10);
    const arm = r[armIdx]?.trim().toUpperCase();
    if (!/^P-\d{1,4}$/.test(id ?? '')) {
      return NextResponse.json(
        { error: `Row ${i + 1}: invalid participant_id "${r[idIdx]}"` },
        { status: 400 }
      );
    }
    if (![1, 2, 3].includes(pgy)) {
      return NextResponse.json(
        { error: `Row ${i + 1}: pgy must be 1, 2, or 3 (got "${r[pgyIdx]}")` },
        { status: 400 }
      );
    }
    if (arm !== 'AI' && arm !== 'CONTROL') {
      return NextResponse.json(
        { error: `Row ${i + 1}: arm must be AI or CONTROL (got "${r[armIdx]}")` },
        { status: 400 }
      );
    }
    records.push({ participant_id: id, pgy, arm: arm as 'AI' | 'CONTROL' });
  }

  if (records.length === 0) {
    return NextResponse.json({ error: 'No data rows found' }, { status: 400 });
  }

  const sb = getSupabase();

  // Reject if any row collides with a participant who has already completed intake.
  const ids = records.map((r) => r.participant_id);
  const { data: existing, error: existingErr } = await sb
    .from('participants')
    .select('participant_id,intake_completed_at')
    .in('participant_id', ids);
  if (existingErr) {
    return NextResponse.json({ error: existingErr.message }, { status: 500 });
  }
  const conflicts = (existing ?? []).filter((p) => p.intake_completed_at !== null);
  if (conflicts.length > 0) {
    return NextResponse.json(
      {
        error: 'Refusing to overwrite participants whose intake is already complete',
        conflicts: conflicts.map((p) => p.participant_id),
      },
      { status: 409 }
    );
  }

  // Upsert: new participants are inserted; existing pre-recruitment rows are updated
  // (in case a coordinator re-runs the seed before anyone has registered).
  const { error: upsertErr } = await sb.from('participants').upsert(records, {
    onConflict: 'participant_id',
  });
  if (upsertErr) {
    return NextResponse.json({ error: upsertErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, inserted: records.length });
}

/** Minimal RFC4180 CSV parser: handles quoted cells, escaped quotes, CRLF. */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(cell);
        cell = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i += 1;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else {
        cell += ch;
      }
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 0);
}
