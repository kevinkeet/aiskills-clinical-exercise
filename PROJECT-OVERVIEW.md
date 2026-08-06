# Skill AI RCT — Project Overview

**One page. If you're new to this project, read this first.**
*Stanford IRB-86737 · PI: Kevin Keet, MD · Status as of 2026-07-13: **launch-ready, awaiting enrollment***

---

## The question

Residents increasingly work up patients with an AI chatbot at their side. Existing randomized
trials ask *"does AI make clinicians perform better right now?"* — how well they do **while
holding the tool**. Nobody has asked the question that actually matters for a trainee:

> **Do residents who work a case *with* AI end up knowing more *without* it?**

Educators have named the risk — **de-skilling**, **never-skilling**, **mis-skilling** — but for
*cognitive* tasks in medicine it's argued from theory and by analogy to perceptual tasks
(AI colonoscopy, radiology). This is the first randomized test for a reasoning-and-knowledge task.

**Key distinction the study rests on:** AI used to *deliberately* learn (board-prep tutors — which
can work well) vs. the ***incidental*** learning that happens while caring for patients. We test the
incidental case, which is what actually pervades training.

---

## The design (in one breath)

100 Stanford internal medicine residents (PGY 1–3), randomized 1:1, work an **identical unfamiliar
case** (fictional Fabry disease patient) through **5 free-response tasks** — with one of two resources:

| Arm | Resource during the case |
|---|---|
| **AI** (n=50) | Embedded chat assistant — Claude Opus 4.7, **out of the box, no system prompt** (a generic chatbot, deliberately *not* a tutor) |
| **Control** (n=50) | **UpToDate** via the Stanford Lane proxy |

Then — **immediately, with no resource available** — a **12-item knowledge assessment**.

- **Primary outcome:** that unassisted score (0–12). This is the whole point: it separates an
  *assisted-performance* phase from an *unassisted-acquisition* phase.
- **Secondary:** self-rated comfort (0–10, identical pre/post), time on task.
- **Exploratory (pre-specified):** every AI conversation is logged and will be **qualitatively coded**
  as *engaged* vs. *offloading* (à la Shen & Tamkin) and correlated with the score — testing whether
  ***how*** you use AI matters more than *whether* you use it.

**Rigor:** PGY-stratified permuted blocks, server-side allocation concealment, automated blinded
scoring, answer key never sent to the browser, **preregistered on OSF before enrollment** with a
pre-specified analysis plan. Powered (80%, two-sided α=.05) for a ~0.57 SD difference.

*Why Fabry?* Rare and multisystem — outside residents' existing knowledge, so the test measures
what they learned **in the session**, not what they already knew.

---

## Where things stand

**✅ Done:** platform built, piloted, and finalized · quiz curated to 12 items · AI switched to
out-of-the-box · consent updated (proration + IRS language, per IRB) · answer-key leak fixed ·
database wiped clean (120 empty enrollment slots, pilot data preserved) · Supabase on Pro ·
**OSF preregistration filed & embargoed** · full two-arm smoke test passed on the live site ·
**manuscript drafted** (NEJM AI, ~2,900 words, Results templated for the data).

**▶️ Next:** recruit residents → distribute `P-NNN` enrollment codes → run the study →
fill in Results/figures → verify references → submit.

**⚠️ Open:** ClinicalTrials.gov registration (ICMJE-acceptable registry; OSF alone doesn't satisfy
it — needs a Stanford PRS account, must be **before** first enrollment) · two placeholder references ·
confirm the live consent matches the final IRB-approved version.

---

## The pieces

| What | Where |
|---|---|
| **Live study site** | https://aiskills.kevinkeet.com |
| Admin dashboard (stats, content editor, CSV exports) | `/admin` (password in `.env.local`) |
| **Code repo** | https://github.com/kevinkeet/aiskills-clinical-exercise |
| **OSF preregistration** (embargoed) | https://osf.io/h5mvt |
| **Manuscript** (target: *NEJM AI*) | `docs/NEJM-AI-Manuscript-Draft.docx` |
| Preregistration (OSF-format + full outline) | `docs/OSF-Preregistration-Ready.docx`, `docs/Preregistration-Outline.docx` |
| Annotated literature review (31 sources) | `docs/Literature-Review-Annotated.docx` |
| The 12 quiz items + answer key + rationale | `docs/Fabry-Final-12-Questions-Rationale.docx` |
| CONSORT figure | `docs/figures/consort-flow.svg` |
| Pilot data snapshot | `docs/pilot-data-snapshot-2026-05-29/` |
| **Engineering/ops detail** (deploy, DB, playbooks, conventions) | **`HANDOFF.md`** ← read next if you're working on the code |

**Stack:** Next.js 16 + React 19 + TypeScript on Vercel (auto-deploys from `main`); Supabase
(Postgres) for data; Anthropic SDK for the AI arm.

⚠️ **One thing to know before editing content:** tasks and quiz questions live in the **database**
(edit via `/admin`), *not* in the source files — `src/data/*.ts` are only seed-if-empty backups.
Deploying code changes alone will **not** change what participants see.

---

## Why it matters

If a generic AI assistant lets residents complete clinical work **without** building the knowledge
underneath, that's a direct challenge to how AI is being adopted in medical training — and it means
trainee-facing AI should be evaluated against **learning**, not task completion. Two follow-on
studies are set up by this one: (a) can residents be *taught* skill-preserving AI habits, and
(b) do purpose-built tools do better than the out-of-the-box baseline?
