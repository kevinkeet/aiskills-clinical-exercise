# Intake flow & study operations — Stanford IRB-86737

This document describes the participant intake flow at `/intake`, the
randomization scheme, the admin dashboard, and how the study coordinator
runs the study end-to-end.

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
| 2 | Enrollment number  | `P-NNN` input (regex `^P-\d{1,4}$`, normalized to upper case). Server `POST /api/intake/lookup` returns `{ participantId, pgy, arm, resumeStep }` and persists `consent_at` if not yet on file. The arm is stored server-side; the participant is **never** told. A new `active_session_id` is rotated into the participants row and into the signed cookie so the most recent login wins (single-active-session). |
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
| 200    | Returns `{ participantId, pgy, arm, resumeStep }`. Sets `aiskills_sess` HTTP-only cookie and rotates `active_session_id`. |
| 400    | Malformed enrollment number.                                                                  |
| 404    | Enrollment number not in the participants table.                                              |
| 409    | Enrollment number has already completed the study (intake done **and** session_completed_at). |
| 500    | DB or session config error. Real error surfaced in JSON body for debugging.                   |

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

### Session cookie (single-active-session)

`aiskills_sess` is an HTTP-only, SameSite=Lax cookie carrying
`{ participantId, sessionId, issuedAt }` signed with HMAC-SHA-256 using
`SESSION_SECRET`. Valid for 12 hours. The cookie does **not** carry the
arm; the server re-reads it from `participants` on every request.

The `sessionId` is rotated on every `/api/intake/lookup` and stored in
`participants.active_session_id`. If the participant logs in from a
second device, the first device's cookie no longer matches and is
silently logged out.

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
- Accepts an **optional** `email` column. If present, the email is
  stored in `participants.email` and surfaced via the Mail-merge CSV
  export. Email is metadata only — it is not used for authentication.

### Adding a new batch mid-study

```bash
RANDOMIZATION_SEED=<same-seed> \
  npx tsx scripts/generate-randomization.ts \
  --pgy1 8 --pgy2 8 --pgy3 8 \
  --start 121 \
  --out participants_seed_batch2.csv

curl -X POST https://aiskills.kevinkeet.com/api/admin/seed-participants \
  -H "Authorization: Bearer $COORDINATOR_TOKEN" \
  -F "csv=@participants_seed_batch2.csv"
```

The same fixed seed advances the RNG deterministically, so the new
block is auditable: anyone re-running the same command after recruitment
will produce the same CSV.

## 4. Admin dashboard (`/admin`)

Password-gated by `ADMIN_PASSWORD`. From the dashboard you can:

- See seeded count, intake-complete count, AI/CONTROL breakdown, and
  fully-completed (intake + 5 tasks + 12 quiz answers) count.
- See average time per task across all participants.
- Download CSVs:
  - **Participants** — full participants table.
  - **Intake Responses** — flattened demographics + per-condition
    familiarity + Fabry sub-items + PGY-mismatch flags. One row per
    participant. Ready for analysis.
  - **Task Responses** — one row per (participant, task) with response,
    time spent, started_at, submitted_at.
  - **Assessment Responses** — one row per (participant, question) with
    selected_answer, correct_answer, is_correct, time_spent_seconds.
  - **Chat Logs** — one row per chat turn (user or assistant).
  - **Mail-merge CSV** — `participant_id, pgy, arm, email,
    intake_complete, session_completed_at`. Sorted by participant_id.
    Use this to mail-merge enrollment-number invitations to residents.
- Reset a participant: wipes intake, task, assessment, and chat rows,
  and clears their progress. Keeps `participant_id`, `pgy`, `arm`,
  `email`. The participant can then re-enter `/intake` and start over.

## 5. Resilience features (data-loss prevention)

| Surface              | Mechanism                                                                  |
|----------------------|----------------------------------------------------------------------------|
| Task textarea        | Per-keystroke `localStorage` save (`taskDraft:<pid>:<task#>`). Restored on page load if the task is the same. Cleared on successful submit. |
| Assessment answers   | Per-answer autosave: every option click upserts that single answer to the DB. Final "Submit" sends the full set with `final: true` to mark `session_completed_at`. |
| Chat history         | Both user messages and full assistant responses are streamed and logged to `chat_logs` server-side as they happen. |
| Per-task time        | Captured client-side and submitted with the response. |

## 6. Required environment variables

| Var                            | Purpose                                                                    |
|--------------------------------|----------------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`     | Supabase project URL.                                                      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase anon key.                                                         |
| `ANTHROPIC_API_KEY`            | Claude API key for the AI-arm chat.                                        |
| `ADMIN_PASSWORD`               | Admin dashboard password (`/admin`) and `/api/admin/reset-participant`.    |
| `COORDINATOR_TOKEN`            | Bearer token for `POST /api/admin/seed-participants`.                      |
| `SESSION_SECRET`               | HMAC secret for the session cookie. ≥ 16 chars; `openssl rand -hex 32`.    |
| `RANDOMIZATION_SEED`           | Fixed seed for the randomization script. Set once, never change.           |

## 7. Database migration

Apply `supabase-schema.sql` in the Supabase SQL editor. **This drops the
old `participants` table and all dependent rows.** Only run on a
pre-recruitment environment.

## 8. End-to-end coordinator workflow

1. **Set env vars** in Vercel: `SESSION_SECRET`, `COORDINATOR_TOKEN`,
   `RANDOMIZATION_SEED`, plus the existing Supabase / Anthropic / admin
   variables.
2. **Apply the schema** by pasting `supabase-schema.sql` into the
   Supabase SQL editor.
3. **Generate the randomization CSV** locally with
   `scripts/generate-randomization.ts`. Decide your per-PGY sample
   sizes; multiples of 4 keep allocation strictly 1:1 within each
   stratum.
4. **Optional: add emails to the CSV.** Open the CSV in a spreadsheet,
   add an `email` column, paste in the resident emails for each
   `P-NNN`, save.
5. **Upload the CSV** with the curl command above.
6. **Mail-merge** the enrollment numbers to the residents using the
   Mail-merge CSV from the admin dashboard (or your own combination of
   the seed CSV and your roster).
7. **Monitor recruitment** on the admin dashboard. Reset any participant
   who reports a problem.
8. **Export data** at any point via the admin dashboard's CSV buttons.

## 9. Threat model and known limitations

- **Identity is single-factor.** A participant is identified solely by
  their `P-NNN`. There is no email verification, password, or second
  factor. The realistic threat is a participant sharing their P-NNN
  with someone else; in practice this is unlikely because they want
  the $100 themselves. Email-based verification was deliberately not
  added because it deviates from the IRB-approved intake page (which
  specifies a single text input on Step 2).
- **Single-active-session is "last-write-wins,"** not "first-locked."
  If a participant logs in on device A then device B, device A is
  silently logged out and B continues. They cannot run two devices in
  parallel.
- **Resume is supported.** A participant who closes the browser mid-
  flow can re-enter their `P-NNN` and pick up where they left off
  (`participants.current_step`). The 409 "already used" error fires
  only when both `intake_complete` is true **and**
  `session_completed_at` is non-null — i.e., they've finished the
  whole study.
- **Chat logs may contain anything the participant typed.** A
  one-line warning banner above the chat input asks participants not
  to enter real PHI. There is no automatic redaction.
- **No email is sent by the platform.** Distribution of `P-NNN` values
  is the coordinator's responsibility (use the Mail-merge CSV).

## 10. Files of interest

| Path                                              | Purpose                                                |
|---------------------------------------------------|--------------------------------------------------------|
| `src/data/intakeContent.ts`                       | IRB-verbatim consent text + form definitions.          |
| `src/app/intake/page.tsx`                         | The 4-step intake UI.                                  |
| `src/app/api/intake/lookup/route.ts`              | Enrollment lookup → arm + session cookie + sessionId rotation. |
| `src/app/api/intake/complete/route.ts`            | Persist demographics + pretest, mark intake complete.  |
| `src/app/api/admin/seed-participants/route.ts`    | Coordinator CSV upload (with optional email column).   |
| `src/app/api/admin/reset-participant/route.ts`    | Wipe all responses for a participant; keep arm.        |
| `src/app/api/admin/export/route.ts`               | All CSV exports.                                       |
| `src/app/api/admin/stats/route.ts`                | Stats for the admin dashboard.                         |
| `src/app/api/session/me/route.ts`                 | Session introspection for downstream pages.            |
| `src/app/api/submit-task/route.ts`                | Per-task response upsert (session-authenticated).      |
| `src/app/api/submit-assessment/route.ts`          | Per-answer autosave + final submit.                    |
| `src/app/api/chat/route.ts`                       | AI-arm Claude chat (session-authenticated, AI only).   |
| `src/lib/session.ts`                              | HMAC cookie + single-active-session helpers.           |
| `scripts/generate-randomization.ts`               | Reproducible randomization CSV generator.              |
| `supabase-schema.sql`                             | Database schema.                                       |
