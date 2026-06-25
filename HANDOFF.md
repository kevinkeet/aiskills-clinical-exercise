# Project handoff — Skill AI RCT

> Read this first. It's the single source of context for picking up this project
> in a fresh session. Last updated 2026-05-29.

---

## 1. What this is

A **Stanford IRB-86737 randomized controlled trial** comparing two ways internal-medicine
residents learn a clinical case:

- **AI arm** — works the case with a Claude chat assistant embedded in the page.
- **Control arm** — works the same case with **UpToDate** (via the Stanford Lane proxy).

Both arms then take a knowledge **assessment** and a pre/post comfort rating. The case is a
**fictional Fabry disease** patient (Marcus Thompson, 32M). The goal is to measure whether
the AI assistant helps residents learn as well as / better than UpToDate.

- **Live site:** https://aiskills.kevinkeet.com
- **GitHub:** https://github.com/kevinkeet/aiskills-clinical-exercise (branch `main`)
- **Vercel project:** `aiskills-clinical-exercise` (auto-deploys on push to `main`)
- **Local path:** `~/Desktop/Skill AI RCT` (moved here 2026-05-29; was previously under
  `~/Documents/Claude applications folder/Financials/aiskills`)
- **Owner:** Kevin Keet (clinician / PI). Folder name reads "Skill AI RCT"; the npm package
  is still named `aiskills`.

---

## 2. Tech stack & deploy flow

- **Next.js 16.2.2** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind v4**.
  ⚠️ See `AGENTS.md`: this Next.js version has breaking changes vs. training data — check
  `node_modules/next/dist/docs/` before writing framework code. `cookies()` is async, etc.
- **Supabase** (Postgres) — data store. Free tier **auto-pauses after inactivity** (see §7).
- **Vercel** — hosting. **Push to `main` → automatic production deploy** (~1–2 min).
  Manual deploy if ever needed: `npx vercel --prod --yes`.
- **Anthropic SDK** (`@anthropic-ai/sdk`) — the AI-arm chat. Model: **`claude-opus-4-7`**,
  streaming, with a concise-clinical system prompt (`src/app/api/chat/route.ts`).

**Standard change → ship loop:**
1. Edit code. 2. `npx tsc --noEmit` and/or `npx next build` to verify. 3. `git add … && git commit && git push`. 4. Vercel deploys. 5. Verify with `curl https://aiskills.kevinkeet.com/...`.
ESLint has pre-existing React-Compiler warnings that do **not** block the Vercel build — `next build` exit 0 is the real gate.

---

## 3. Secrets & config (where, not what)

All secrets live in **`.env.local`** (gitignored; `.env*` and `.vercel` are not committed) and
are mirrored in **Vercel env vars**. Never paste secret values into committed files. Read
`.env.local` directly when you need one. Variable names (see `.env.local.example`):

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |
| `ANTHROPIC_API_KEY` | AI-arm chat (Kevin asked to keep this secret) |
| `ADMIN_PASSWORD` | `/admin` dashboard + admin API (`x-admin-password` header) |
| `COORDINATOR_TOKEN` | gates `POST /api/admin/seed-participants` |
| `SESSION_SECRET` | HMAC for the HTTP-only session cookie |
| `RANDOMIZATION_SEED` | for `scripts/generate-randomization.ts`; set once, never change |

- **Supabase project ref:** `xzbjhlasrwqqqofknjgw`
- **Vercel:** projectId `prj_CFUhNVJIAd6Q5MbfnWI3AkFMAE3w`, org `team_Jfk9MMcWPaR9fXm2X4f18r9h`

---

## 4. How content works (important mental model)

**Tasks and quiz questions are stored in Supabase and are the runtime source of truth.**
`src/data/tasks.ts` and `src/data/questions.ts` are **seed-only-if-empty backups** — they're
written to the DB exactly once, when the table is empty (`src/lib/content.ts`). After that,
**edits made through `/admin` (or the admin API) are what participants see**; the source
defaults are NOT re-applied. So:

- To change a question/task **for the live study**, edit it in the DB (admin UI or
  `POST /api/admin/{questions,tasks}`). Deploying source changes alone does **not** change
  live content.
- Keep `src/data/*.ts` in sync as a backup so a DB wipe re-seeds the *current* set, not a
  stale one. (This has been hand-synced; see §9.)
- The **docs/** exports (CSV, markdown, Word) are generated snapshots — they drift unless
  regenerated (see §7).

**Question/answer privacy:** `/api/my-results` only reveals the answer key to pilots
(`/^PILOT\d+$/`). ⚠️ But see the open item in §10 about `/api/questions` exposing
`correctAnswer`.

---

## 5. File map

```
src/
  app/
    intake/           4-step entry: consent → enrollment# → demographics → comfort rating
    exercise/         the 5 tasks; left = case panel, right = AI chat OR UpToDate (by arm)
    assessment/       the quiz (comfort scale first, then MCQs)
    complete/         score + (pilots only) answer review
    admin/            PI dashboard: stats, Quiz Performance by Arm, content editor, exports
    api/
      intake/lookup, intake/complete      enrollment# → arm; finalize intake
      session/me                          who am I / arm / intake status
      tasks, questions                    PUBLIC reads (questions = LIVE/active only)
      chat                                AI-arm streaming chat (Opus); logs to chat_logs
      submit-task, submit-assessment      participant writes
      my-results                          score; answer key gated to pilots
      pilot-feedback                      per-item pilot feedback (own GET / POST)
      admin/questions                     GET all (incl. hidden)+active flag; POST upsert; DELETE; PATCH active
      admin/tasks                         POST upsert; DELETE
      admin/question-stats                per-question correct/taken (pilot performance)
      admin/stats, admin/export           aggregate stats; CSV exports
      admin/reset-participant             wipe one participant's rows for reuse
      admin/seed-participants             coordinator-only bulk seed (COORDINATOR_TOKEN)
  components/
    CasePanel, ChatSidebar, UpToDateSidebar, StudyContentEditor,
    PilotFeedbackBox, PilotFeedbackPanel, ProgressBar, Timer
  lib/
    content.ts        loadTasks/loadQuestions (+ seed-if-empty), upsert/delete, setQuestionActive
    session.ts        HMAC cookie sign/verify, single-active-session enforcement
    supabase.ts       server Supabase client
  data/
    case.ts           the Fabry vignette + additionalFindings + getCaseAsText()
    tasks.ts          default 5 tasks
    questions.ts      default questions (backup of the live set)
    intakeContent.ts  IRB consent text, demographics fields, comfort question
supabase-schema.sql   full DB schema (run in a fresh Supabase project to bootstrap)
scripts/generate-randomization.ts
docs/                 study reference exports (see §7) + the Word answer key
```

---

## 6. Current study content (as of 2026-05-29)

**Quiz: 23 items = 22 scored MCQs + 1 comfort scale (Q13, not graded).**
- Question numbers are **stable IDs with intentional gaps**: 1–13, 15, 16, 19, 21, 22, 23–27.
  Q14/17/18/20 were **retired** (archived verbatim in `docs/Retired-Questions.md`).
  Q23–27 were added later.
- Correct-answer distribution is balanced: **A=6, B=5, C=5, D=6**.
- **Option lengths are deliberately balanced** so the correct answer is never the longest —
  Kevin flagged "pick the longest answer" as a tell; all 22 MCQs were rebalanced (was the
  longest in 15/22, now 0/22). **Preserve this property** when editing questions.
- The comfort scale (Q13) uses the *same wording* as the intake comfort item → paired pre/post.

**Tasks: 5** (free-response). Task 1 history → 2 physical exam → 3 workup → 4 management
(reveals additional findings) → 5 after-visit summary. The new exam/workup findings revealed
at Task 4 stay visible through Task 5.

**The case** (`src/data/case.ts`): lean renal referral — progressive CKD of unclear etiology,
no diabetes/HTN, bland standard workup. The Fabry hook is deliberately limited: **ECG shows
LVH + short PR**, and a **positive X-linked family history** (mother's heart condition in her
50s, maternal uncle on dialysis in his 40s, healthy paternal side). The classic Fabry clues
(acroparesthesia, GI symptoms, angiokeratomas, cornea verticillata) are intentionally
withheld so residents must elicit them. `additionalFindings` (angiokeratomas, cornea
verticillata, low α-Gal A, high lyso-Gb3, GLA variant, etc.) are revealed at Task 4.

---

## 7. Operational playbooks

### Deploy
Push to `main`; Vercel auto-builds. Verify, e.g.:
`curl -s https://aiskills.kevinkeet.com/api/questions | python3 -c "import sys,json;print(len(json.load(sys.stdin)['questions']))"`

### Edit live quiz/tasks via admin API
`POST https://aiskills.kevinkeet.com/api/admin/questions` (or `/tasks`) with header
`x-admin-password: <ADMIN_PASSWORD from .env.local>`, JSON body. MCQ body:
`{number, type:'mcq', text, options:[{label,value}×4 A–D], correctAnswer}`.
- Hide a question non-destructively: `PATCH /api/admin/questions` `{number, active:false}`
  (or toggle in the admin **Study Content** editor). Hidden questions stay in the DB and
  editor but drop out of the live assessment. **Delete** is permanent (use sparingly).
- ⚠️ `curl` works; Python `urllib` hit SSL cert-verify errors in this env — prefer `curl`.

### Run raw SQL / DDL on Supabase (no direct psql)
DDL can't go through the JS client. Use the **Management API** with the dashboard's own token:
1. Open the Supabase dashboard in Chrome (logged in).
2. Grab the token: `JSON.parse(localStorage.getItem('supabase.dashboard.auth.token')).access_token`
   (via the Chrome MCP `javascript_tool`, or DevTools console).
3. `POST https://api.supabase.com/v1/projects/xzbjhlasrwqqqofknjgw/database/query`
   with `Authorization: Bearer <token>`, body `{"query": "<SQL>"}`.
   If it says "JWT failed verification," reload the dashboard tab to refresh the token.

### Supabase auto-pause (recurs on free tier)
Symptoms: `/api/tasks` / `/api/questions` return 500 `fetch failed`; `*.supabase.co` won't
resolve. Fix: `POST https://api.supabase.com/v1/projects/xzbjhlasrwqqqofknjgw/restore` with
the dashboard Bearer token. Recovery ~3 min. A Pro upgrade or a keep-alive ping would stop
this recurring.

### Regenerate the docs exports after a content change
The repo has helper data flows (the generators were run ad hoc this session; recreate as
needed):
- **Word answer key** `docs/Fabry-Quiz-Questions-AnswerKey.docx` — built with `docx` (npm)
  from a fetch of `/api/questions`; correct option bolded + "✓ correct". A copy is also kept
  at `~/Downloads/Fabry-Quiz-Questions-AnswerKey.docx`. Use the **docx skill** for Word work.
- **`docs/Study-Quiz-Questions.csv`** — tabular, with a hand-written Notes/Task-Domain column
  worth preserving on regen.
- **`docs/Study-Tasks-and-Quiz.md`** — prose reference; per-question titles + rationale are
  hand-written and worth preserving on regen.
- **`docs/Retired-Questions.md`** — archive of cut questions.
- **`docs/Pilot-Email-Template.md`** — recruitment email for pilots.

---

## 8. Pilot status & data

- **Pilot self-registration:** anyone can enroll as `Pilot1`, `Pilot2`, … (case-insensitive).
  **Odd → AI arm, even → Control.** Auto-created on first lookup.
- **5 pilots** have completed the assessment. Their per-question performance is visible on
  `/admin` (correct/taken %, color-coded). Hard items: **Q5 (20%)**, **Q9 (40%)**; several
  at 100% (candidates to hide/trim if you want a more discriminating quiz).
- ⚠️ Those 5 pilots took the **pre-revision** wording (before the 2026-05-29 question rewrite)
  and **before Q23–27 existed**, so Q23–27 show "No responses yet" and the older items'
  responses were to slightly different distractors. For clean data on the revised items,
  do a **fresh pilot pass**.
- Pilots can leave **per-question and per-task feedback**; PI sees it in the admin
  PilotFeedbackPanel.

---

## 9. Recent work log (most recent first)

- **Moved the project** to `~/Desktop/Skill AI RCT` (git history, `.env.local`, `.vercel`,
  `node_modules` all intact).
- **Revised the quiz** per Kevin's Word-doc comments: stronger distractors on Q3/Q22/Q27;
  broadened Q23 stem to "another characteristic cardiac manifestation"; removed giveaway
  parentheticals "(vertebrobasilar)" from Q25 and "(hypohidrosis)" from Q26. **Rebalanced
  all 22 MCQ option lengths** so the correct answer is never the longest. No correct-answer
  positions changed. Applied to live DB + synced `src/data/questions.ts` + regenerated all
  docs exports + Word key.
- **Per-question pilot performance** added to `/admin` (`/api/admin/question-stats`).
- **Active/hidden toggle** for questions (non-destructive curation) — DB `active` column,
  `setQuestionActive`, admin UI; `/api/questions` returns active-only, admin/stats/export see all.
- **Bug fixes** from pilot feedback: feedback box no longer eats text mid-autosave; chat
  doesn't yank scroll while streaming; chat input + sidebar are resizable; Task-4 findings
  persist into Task 5.
- Earlier: full intake rebuild, editable tasks/questions, admin export/reset, pilot feedback,
  switched chat to Opus with concise prompt, added the Fabry-suspicion hook + positive family
  history.

---

## 10. Open items & known issues

1. **⚠️ Answer-key leak risk (study validity):** `GET /api/questions` returns `correctAnswer`
   to the client for assessment rendering. A savvy resident could read answers from the
   network tab. `my-results` is gated to pilots, but the live quiz feed is not. **Consider
   stripping `correctAnswer` from `/api/questions` and grading server-side** before recruiting
   real residents. (Not yet done — flagged, not requested.)
2. **Supabase free-tier auto-pause** recurs (see §7). Decide on Pro upgrade or a keep-alive.
3. **Fresh pilot pass** wanted to get clean data on the revised questions + Q23–27.
4. **Trim decision:** several questions sit at 100% with the pilots (not discriminating) —
   Kevin may want to hide some via the new toggle.
5. **UpToDate access:** Control arm launches `https://www-uptodate-com.laneproxy.stanford.edu`
   in a new tab (no iframe — it sets X-Frame-Options). Confirm the Lane proxy login works for
   participants.
6. **Docs drift:** CSV/markdown/Word are snapshots; regenerate after any live content change.
7. **Session memory** from the prior project path does not carry to a session opened here;
   this file is the migration.

---

## 11. Working conventions (Kevin's preferences)

- **Commit and deploy by default** — Kevin said "in general I want you to commit and deploy."
  Don't wait for per-change approval on routine work. Use a clear commit message; end with:
  `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>` (style used in this repo's history).
- **Leave `.claude/` and `participants_seed.csv` untracked.** `participants_seed.csv` may map
  enrollment numbers → arms; keep it out of git.
- **Participant-facing copy must NOT name the arms** ("AI"/"UpToDate"/"control") — use neutral
  language ("the resource panel"). Looking things up is framed as expected, not cheating.
- **Verify before claiming done** — `tsc`/`next build` exit 0, and `curl` the live endpoint.
- Kevin is a clinician fluent in clinical-reasoning pedagogy — clinical content can be pitched
  at that level.
