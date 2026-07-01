# Project handoff — Skill AI RCT

> Read this first. Single source of context for picking up this project in a fresh session.
> **Last updated 2026-07-01.** Phase: platform built & piloted; quiz finalized; **manuscript +
> preregistration drafted**; pre-launch tasks remain before enrolling real residents.

---

## 1. What this is

A **Stanford IRB-86737 randomized controlled trial** testing whether internal-medicine residents
who work a clinical case *with* an AI assistant **acquire** knowledge they can later deploy
*without* it — i.e., whether incidental AI use during patient care builds or bypasses durable
skill (the "de-/never-/mis-skilling" concern).

- **AI arm** — works the case with an embedded Claude chat assistant (out-of-the-box; see §2).
- **Control arm** — works the same case with **UpToDate** (Stanford Lane proxy, side window).
- Both then take a **12-item knowledge assessment with no resource available** (the primary
  outcome), plus a pre/post comfort rating. Case = **fictional Fabry disease** (Marcus Thompson, 32M).

- **Live site:** https://aiskills.kevinkeet.com
- **GitHub:** https://github.com/kevinkeet/aiskills-clinical-exercise (branch `main`)
- **Vercel:** `aiskills-clinical-exercise` (auto-deploys on push to `main`)
- **Local path:** `~/Desktop/Skill AI RCT` (npm package still named `aiskills`)
- **Owner:** Kevin Keet, MD (PI; hospitalist, Associate PD, Stanford IM residency).
- **Target journal:** *NEJM AI* (runner-up: *BMJ Digital Health & AI*).

---

## 2. Tech stack & deploy flow

- **Next.js 16.2.2** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind v4**.
  ⚠️ See `AGENTS.md`: this Next.js differs from training data — check `node_modules/next/dist/docs/`
  before writing framework code. `cookies()` is async.
- **Supabase** (Postgres) — data store. Free tier **auto-pauses** (see §7).
- **Vercel** — hosting. **Push to `main` → auto production deploy** (~1–2 min). Manual: `npx vercel --prod --yes`.
- **Anthropic SDK** — the AI-arm chat. Model **`claude-opus-4-7`**, streaming, **NO system prompt —
  used out of the box by design** (`src/app/api/chat/route.ts`). This is deliberate: the trial
  measures a generic, off-the-shelf assistant. **Do not add a system prompt** without updating the
  protocol/manuscript — it changes the intervention.

**Change → ship loop:** edit → `npx tsc --noEmit` / `npx next build` (exit 0 is the real gate;
pre-existing ESLint React-Compiler warnings don't block Vercel) → `git commit && git push` → verify
with `curl`.

---

## 3. Secrets & config (where, not what)

All secrets live in **`.env.local`** (gitignored) and mirrored in **Vercel env vars**. Never paste
values into committed files; read `.env.local` directly. Vars: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY` (keep secret), `ADMIN_PASSWORD`
(`x-admin-password` header for `/admin` API), `COORDINATOR_TOKEN`, `SESSION_SECRET`,
`RANDOMIZATION_SEED` (set once, never change).

- **Supabase project ref:** `xzbjhlasrwqqqofknjgw` · **Vercel** projectId `prj_CFUhNVJIAd6Q5MbfnWI3AkFMAE3w`.

---

## 4. How content works (important mental model)

**Tasks and quiz questions live in Supabase and are the runtime source of truth.**
`src/data/tasks.ts` / `questions.ts` are **seed-only-if-empty backups** (written once when the table
is empty; `src/lib/content.ts`). After that, **`/admin` (or admin-API) edits are what participants
see** — deploying source changes alone does NOT change live content. A DB wipe re-seeds the defaults,
so keep `src/data/*.ts` reasonably in sync.

- **`active` flag:** questions can be **hidden** (`active=false`) non-destructively — they stay in the
  DB and admin editor but drop out of `/api/questions` (the live assessment). This is how the quiz was
  pared to 12 (see §6). Hidden state lives in the DB only (not in `questions.ts` defaults).
- **Answer-key privacy (FIXED):** `/api/questions` no longer sends `correctAnswer` to the client;
  grading is server-side (`/api/my-results`), and the answer-key review there is gated to pilots.
  The admin editor reads the full record from the auth-gated `/api/admin/questions`.

---

## 5. File map (essentials)

```
src/app/
  intake/       consent → enrollment# → demographics → comfort   (consent = IRB info sheet)
  exercise/     5 tasks; left = case panel, right = AI chat OR UpToDate side-window (by arm)
  assessment/   the quiz (comfort scale first, then MCQs), no resources
  complete/     score + (pilots only) answer review
  admin/        PI dashboard: stats by arm, per-question performance, content editor, exports, reset
  api/
    intake/lookup|complete, session/me, tasks, questions (LIVE/active only, NO answer key),
    chat (AI arm; out-of-box Opus 4.7; logs full convo to chat_logs),
    submit-task|submit-assessment, my-results (score; key gated to pilots), pilot-feedback,
    admin/questions (GET all+active; POST upsert; DELETE; PATCH active), admin/tasks,
    admin/question-stats, admin/stats, admin/export, admin/reset-participant, admin/seed-participants
src/lib/     content.ts (load/seed/upsert/setQuestionActive) · session.ts (HMAC cookie, single session) · supabase.ts
src/data/    case.ts · tasks.ts · questions.ts (backup) · intakeContent.ts (consent, demographics, comfort)
supabase-schema.sql · scripts/generate-randomization.ts
docs/        study reference exports + the research/manuscript package (§9)
```

---

## 6. Current study content (as of 2026-07-01)

**Quiz: 12 scored MCQs + 1 comfort scale (Q13, not graded) = 13 live items.**
- **Live MCQ numbers: 1, 3, 5, 6, 9, 10, 12, 23, 24, 25, 26, 27.**
- The other 10 (Q2, 4, 7, 8, 11, 15, 16, 19, 21, 22) are **hidden** (`active=false`), not deleted —
  they keep their data and can be restored via the admin toggle / `PATCH /api/admin/questions`.
  Q14/17/18/20 were deleted earlier (archived in `docs/Retired-Questions.md`).
- The 12 were chosen (from pilot difficulty + "learned-at-the-bedside, task-related-but-not-direct"
  criteria) — rationale + full text + answer key in **`docs/Fabry-Final-12-Questions-Rationale.docx`**
  (the authoritative live-set doc). `docs/Study-Quiz-Questions.csv` / `Study-Tasks-and-Quiz.md` still
  list all 22 (incl. hidden) — stale for the *live* set; treat Fabry-Final-12 as canonical.
- **Option lengths are deliberately balanced** so the correct answer is never the longest — **preserve
  this** when editing. Answer-key distribution across the 12 stays balanced.

**Tasks: 5** free-response — history → physical exam → workup → management (reveals additional
findings) → after-visit summary. Task-4 findings persist through Task 5.

**The case** (`src/data/case.ts`): lean renal referral (progressive CKD, no DM/HTN, bland workup). Fabry
hook is deliberately limited — **ECG LVH + short PR**, **X-linked family history**. Classic clues
(acroparesthesia, GI, angiokeratomas, cornea verticillata) are withheld so residents must elicit them;
`additionalFindings` (angiokeratomas, cornea verticillata, low α-Gal A, high lyso-Gb3, GLA variant…)
revealed at Task 4.

**Consent** (`src/data/intakeContent.ts`): IRB-verbatim info sheet. **Updated** to remove the
"payment only on completion" condition, add **proration**, and add the required **IRS tax** statement
(reviewer comment #11). ⚠️ Mirrors the *submitted* revision — **still in IRB review**; re-confirm
against the final approved consent before enrolling.

---

## 7. Operational playbooks

- **Deploy:** push to `main`; verify `curl -s .../api/questions | python3 -c "import sys,json;print(len(json.load(sys.stdin)['questions']))"` → expect 13.
- **Edit/hide live questions:** `POST /api/admin/questions` (upsert) or `PATCH` `{number,active:bool}`
  with header `x-admin-password: <ADMIN_PASSWORD>`. Prefer **`curl`** (Python `urllib` hit SSL cert
  errors here).
- **Raw SQL/DDL on Supabase:** open the dashboard in Chrome (logged in), grab
  `JSON.parse(localStorage.getItem('supabase.dashboard.auth.token')).access_token`, `POST
  https://api.supabase.com/v1/projects/xzbjhlasrwqqqofknjgw/database/query` with `Authorization:
  Bearer <token>`, `{"query":"<SQL>"}`. "JWT failed verification" → reload the dashboard tab. (Note:
  the dashboard is cookie-auth now; if signed out, the user must sign in — do not do it for them.)
- **Supabase auto-pause:** `/api/*` return 500 `fetch failed`. Fix: `POST .../restore` with the
  Bearer token (or it may auto-resume on access). Recovery ~3 min. **Go Pro before the real study.**
- **Docs/Word generation:** use pandoc for md→docx (manuscript, prereg, lit review); the Word answer
  keys were built with the `docx` npm lib and the docx skill. Downloads copies are kept in `~/Downloads`.

---

## 8. Data & pilots

- **Pilot self-registration:** enroll as `Pilot1`, `Pilot2`, … (odd → AI, even → Control), auto-created.
- **6 pilots** completed the assessment on the *pre-pare-down, prompted-AI* version. Per-question
  performance is on `/admin`. Hardest live items: **Q5 (17%)**, **Q9 (50%)**.
- **Pilot data snapshot** saved before the pare-down: `docs/pilot-data-snapshot-2026-05-29/`
  (raw per-participant CSVs are **git-ignored** / local-only for data governance; a per-question
  summary + README are committed). Hiding questions kept all responses in the DB too.
- ⚠️ Pilots ran with the **old prompted AI and the 22-question set**. A **fresh pilot pass** on the
  final config (out-of-box AI, 12 questions) would give clean baseline data.
- **The DB still holds pilot/test data** (≈135 participant rows incl. 120 seeded P-NNN + pilots).
  **Wipe test/response data before the real study** so it doesn't contaminate analysis (a
  pre-launch task — not yet done).

---

## 9. Research & manuscript package (in `docs/`)

The study now has a full paper-in-progress. All are markdown + a pandoc-generated `.docx` (+ Downloads copy):

- **`NEJM-AI-Manuscript-Draft`** — lean pre-results draft (~2,700 words, **17 refs**). Methods complete;
  **Results templated `[DATA]`** for the n=100 sample. Framing (locked with the PI):
  - Reference the de-/never-/mis-skilling terminology (Abdulnour NEJM 2025), then **center on the
    measurable construct: knowledge acquisition** (residents are a "muddy middle").
  - **Deliberate learning** (AI tutors/board prep; Kestin RCT) vs. **incidental learning** during
    patient care — the trial models the *incidental* case.
  - Intervention = **out-of-the-box** assistant (no system prompt); tools-not-interchangeable and
    posture-is-trainable set up in the Discussion (the PI's two planned follow-on studies, implied
    not stated).
  - **Interaction-pattern analysis** (pre-specified, exploratory, mixed-methods): qualitatively code
    AI-arm conversations as *engaged* vs *offloading* (framework adapted from Shen & Tamkin), κ, then
    correlate with the knowledge score. Full convo logs are already captured.
- **`Preregistration-Outline`** — OSF-format; hypotheses (two-sided primary; H3 = interaction patterns),
  PGY-stratified permuted-block design, n=100 power (d≈0.57), analysis plan, ClinicalTrials.gov map.
  ⚠️ **Register on OSF before the first participant enrolls** — highest-leverage credibility step.
- **`Literature-Review-Annotated`** — 31 annotated sources across AI+med-ed, AI+deskilling outside
  medicine, learning science. Superset of the manuscript's 17; use to expand post-results.
- **`figures/consort-flow.svg`** (+ png) — CONSORT diagram with `[N]` placeholders.
- **PI's own thought pieces** (untracked, in the folder): `AIMES_thought_piece_short.docx`,
  `SAL_Aurora_narrative_v4.docx` (curriculum grant), `IRB-86737 Comment Responses`, `Protocol86737 (2).pdf`,
  `Recruitment materials.docx`, `2601.20245v2` (Shen & Tamkin paper). Not mine to commit.

**Authorship (NEJM AI):** follows ICMJE; **co-first authors allowed** via an equal-contribution
footnote; **one corresponding author**. Recent (2024–26) citations in the manuscript are flagged
`(verify)` — confirm author/volume/pages before submission.

---

## 10. Open items & next actions

1. **Wipe test/pilot data** from the DB before enrolling real residents (see §8).
2. **Re-capture eProtocol screenshots** — `WebsiteConsent` / `WebsiteEnrollmentPage` (the PI dropped
   `WebsiteConsent.png` / `WebsiteEnrollmentPage.png` in the folder). Browser/Cowork task, on the PI's
   trigger — touches the authenticated Stanford IRB system; **do not do unprompted.**
3. **Consent** still in IRB review — match the final approved Section 9 before launch (§6).
4. **Supabase Pro** before the study (stop the auto-pause).
5. **Register the prereg on OSF** before first enrollment (§9).
6. **Verify manuscript references** flagged `(verify)`; decide preprint-vs-published.
7. **Fresh pilot pass** on the final config would give clean baseline data (§8).
8. Two **planned follow-on studies** (PI): (a) can residents be *taught* skill-preserving AI-interaction
   posture; (b) do purpose-built tools (e.g., OpenEvidence) or configurations promote learning vs. the
   out-of-box baseline. Both are *set up* in the manuscript Discussion, not asserted.

✅ **Resolved since the last handoff:** answer-key leak fixed; quiz pared 22→12 (hide); AI switched to
out-of-the-box (system prompt removed); consent proration+IRS added; UpToDate now a right-docked side
window (not new tab); pilot-feedback UX bugs fixed; project moved to `~/Desktop/Skill AI RCT`.

---

## 11. Working conventions (PI's preferences)

- **Commit and deploy by default** (the PI said so). Clear message; end with
  `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` (repo convention; keep it consistent).
- **Leave `.claude/`, `participants_seed.csv`, and the raw pilot CSVs untracked** — participant-level /
  arm-assignment data stays out of git (data governance).
- **Participant-facing copy must NOT name the arms** — neutral language; looking things up is framed as
  expected, not cheating.
- **Verify before claiming done** — `tsc`/`next build` exit 0 and `curl` the live endpoint.
- The PI is a clinician-educator fluent in clinical-reasoning pedagogy and the AI-skill-formation
  literature — pitch clinical and conceptual content at that level; expect sharp framing feedback.
