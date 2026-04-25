# Intake flow — Stanford IRB-86737

This document describes the participant intake flow at `/intake`, the
randomization scheme, and how the study coordinator seeds participants.

> The consent text rendered at `/intake` is **IRB-approved verbatim copy**
> (Stanford IRB-86737). Any edit to that text — including section labels,
> phrasing, contact information, or the checkbox label — requires a
> protocol amendment. The verbatim source lives in
> `src/data/intakeContent.ts`.

## 1. The intake flow

A single route, `/intake`, walks the participant through four steps with
internal step state. The participant cannot bookmark or share a mid-flow
URL; resuming is keyed off the enrollment number on the participants
table (`current_step` column).

| # | Step               | Notes                                                                                                                                            |
|---|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | Consent            | Renders the IRB-approved Information Sheet verbatim. "Print / save this page" calls `window.print()`. A single required checkbox unlocks Continue. |
| 2 | Enrollment number  | `P-NNN` input (regex `^P-\d{1,4}$`, normalized to upper case). Server `POST /api/intake/lookup` returns `{ participantId, pgy, arm }` and persists `consent_at` if not yet on file. The arm is stored server-side; the participant is **never** told. |
| 3 | Demographics       | 5 required items (PGY, track, med-school grad year, sex, prior generative-AI use). PGY mismatch with the value on file surfaces a soft warning and is logged as `pgy_mismatch: true`, but does not block submission. |
| 4 | Self-rated familiarity | "Self-rated familiarity with selected clinical conditions" — 4 conditions (Fabry, IgA nephropathy, sarcoidosis, AL amyloidosis) presented in a participant-seeded random order, plus 4 Fabry-specific sub-items. Submit routes the participant into the case. |

The intake page does **not** display the words "AI", "Claude", "UpToDate",
"PubMed", or any framing suggesting the study is about AI assistance.
The only place the word "Fabry" appears is inside the Step 4 sub-item
labels, where the question must name the condition.

The `/exercise` and `/assessment` pages also avoid arm-naming chips and
banners; participants see whichever resource panel is wired for their arm
without being told which arm they are in.

## 2. Server contract — enrollment lookup and arm assignment

The server is the source of truth for arm assignment. Clients do not
choose, see, or control the arm.

### `POST /api/intake/lookup`
Body: `{ enrollmentNumber: "P-001", consentTimestamp?: ISO-8601 }`

| Status | Meaning                                                                                       |
|--------|-----------------------------------------------------------------------------------------------|
| 200    | Returns `{ participantId, pgy, arm, resumeStep }`. Sets `aiskills_sess` HTTP-only cookie.     |
| 400    | Malformed enrollment number.                                                                  |
| 404    | Enrollment number not in the participants table.                                              |
| 409    | Enrollment number has already completed the study (intake done **and** session_completed_at). |

The `arm` field is returned for server-side wiring of the next page; the
frontend MUST NOT render it. Downstream pages (`/exercise`,
`/assessment`, `/api/chat`, etc.) re-derive the arm from the session
cookie via `getSessionParticipant()` in `src/lib/session.ts`.

### `POST /api/intake/complete`
Authenticated by the session cookie. Body:
`{ demographics, fabryPretest, mismatchFlags? }`. Persists to
`intake_responses`, sets `participants.intake_complete = true` and
`intake_completed_at = now()`, and routes the participant into the case.

### `GET /api/session/me`
Returns `{ authenticated, participantId, arm, intakeComplete, currentStep, sessionCompletedAt }`
based on the signed session cookie. Used by `/exercise`, `/assessment`,
and the chat sidebar to look up arm without trusting client storage.

### Session cookie

`aiskills_sess` is an HTTP-only, SameSite=Lax cookie carrying
`{ participantId, issuedAt }` signed with HMAC-SHA-256 using
`SESSION_SECRET`. Valid for 12 hours. The cookie does **not** carry the
arm; the server re-reads it from `participants` on every request.

## 3. Randomization

- 1:1 allocation to `AI` vs `CONTROL`.
- Stratified by PGY (1, 2, 3).
- Permuted blocks of size 4 inside each stratum.
- Seeded by the `RANDOMIZATION_SEED` env var. Pick this value **once**
  before recruitment opens and never change it. Re-running the script
  with the same seed and the same per-stratum counts produces an
  identical CSV — this is required for IRB auditability.
- The script `scripts/generate-randomization.ts` outputs a CSV that the
  coordinator uploads via `POST /api/admin/seed-participants`.

### Generating the randomization CSV

```bash
RANDOMIZATION_SEED=<your-fixed-seed> \
  npx tsx scripts/generate-randomization.ts \
  --pgy1 40 --pgy2 40 --pgy3 40 \
  --start 1 \
  --out participants_seed.csv
```

This produces 120 rows: `P-001` through `P-120`, with PGY-1 in the first
40, PGY-2 in the next 40, PGY-3 in the last 40 — and within each
stratum, every consecutive 4 IDs is exactly 2 AI / 2 CONTROL.

If a stratum count is not a multiple of 4, the script warns and the
trailing partial block may not be perfectly balanced.

### Uploading the CSV to the running app

```bash
curl -X POST https://aiskills.kevinkeet.com/api/admin/seed-participants \
  -H "Authorization: Bearer $COORDINATOR_TOKEN" \
  -F "csv=@participants_seed.csv"
```

The endpoint:
- Validates header, format of every cell, and arm membership.
- Refuses to overwrite any participant whose `intake_completed_at` is
  non-null (returns 409 with the colliding IDs).
- Otherwise upserts each row into `participants`. Pre-existing
  pre-recruitment rows are updated; new IDs are inserted.

### Adding a new batch mid-study

Re-run the script with `--start` set to the next unused integer:

```bash
RANDOMIZATION_SEED=<same-seed> \
  npx tsx scripts/generate-randomization.ts \
  --pgy1 8 --pgy2 8 --pgy3 8 \
  --start 121 \
  --out participants_seed_batch2.csv
```

The same fixed seed advances the RNG deterministically, so the new
block is auditable: anyone re-running the same command after recruitment
will produce the same CSV.

Then upload:

```bash
curl -X POST https://aiskills.kevinkeet.com/api/admin/seed-participants \
  -H "Authorization: Bearer $COORDINATOR_TOKEN" \
  -F "csv=@participants_seed_batch2.csv"
```

## 4. Required environment variables

| Var                            | Purpose                                                                    |
|--------------------------------|----------------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`     | Supabase project URL.                                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase anon key.                                                         |
| `ANTHROPIC_API_KEY`            | Claude API key for the AI-arm chat.                                        |
| `ADMIN_PASSWORD`               | Admin dashboard password (`/admin`).                                       |
| `COORDINATOR_TOKEN`            | Bearer token for `POST /api/admin/seed-participants`.                      |
| `SESSION_SECRET`               | HMAC secret for the session cookie. ≥ 16 chars; `openssl rand -hex 32`.    |
| `RANDOMIZATION_SEED`           | Fixed seed for the randomization script. Set once, never change.           |

## 5. Database migration

Apply `supabase-schema.sql` in the Supabase SQL editor. **This drops the
old `participants` table and all dependent rows.** Only run on a
pre-recruitment environment.

## 6. Files of interest

| Path                                              | Purpose                                                |
|---------------------------------------------------|--------------------------------------------------------|
| `src/data/intakeContent.ts`                       | IRB-verbatim consent text + form definitions.          |
| `src/app/intake/page.tsx`                         | The 4-step intake UI.                                  |
| `src/app/api/intake/lookup/route.ts`              | Enrollment lookup → arm + session cookie.              |
| `src/app/api/intake/complete/route.ts`            | Persist demographics + pretest, mark intake complete.  |
| `src/app/api/admin/seed-participants/route.ts`    | Coordinator CSV upload.                                |
| `src/app/api/session/me/route.ts`                 | Session introspection for downstream pages.            |
| `src/lib/session.ts`                              | HMAC cookie helpers and session-participant lookup.    |
| `scripts/generate-randomization.ts`               | Reproducible randomization CSV generator.              |
| `supabase-schema.sql`                             | Database schema.                                       |
