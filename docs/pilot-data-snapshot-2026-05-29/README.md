# Pilot data snapshot — 2026-05-29

Captured right before the quiz was pared from 22 MCQs down to the final
**12-question set**. Exported from the live Supabase DB via
`/api/admin/export`, graded against the answer key in place on this date.

## Why this exists
Paring the quiz used the non-destructive **hide** toggle (`active = false`),
so every pilot/test response remains in the database untouched. This folder
is an independent, durable copy so the pilot results survive the eventual
**pre-launch wipe** of test data.

## Files
- `per_question_summary.csv` — aggregate per question: taken / correct / %
  (no participant-level data; committed to git).
- `assessment_responses.csv` — per-participant graded answers for **every**
  question, including the now-hidden ones and the retired Q14/17/18/20.
  *(participant-level — git-ignored, local-only; see below)*
- `intake_responses.csv` — per-participant demographics + pre-test comfort.
  *(participant-level — git-ignored, local-only)*
- `pilot_feedback.csv` — per-item pilot feedback text. *(git-ignored, local-only)*

The three participant-level files are intentionally kept out of version
control (`.gitignore`) as research-data governance. They live on disk only;
the DB retains the same rows until the launch wipe, and a fresh export can be
re-run anytime with `/api/admin/export`.

## Live question set as of 2026-05-29 (for recoverability)
The active/hidden state lives in the DB `quiz_questions.active` column, **not**
in `src/data/questions.ts` defaults — so a full DB re-seed would restore all
22 MCQs as active. To reproduce the curated set, keep these **live** and hide
the rest via `/admin` (or `PATCH /api/admin/questions {number, active:false}`):

- **Live (12 MCQ):** Q1, Q3, Q5, Q6, Q9, Q10, Q12, Q23, Q24, Q25, Q26, Q27
  — plus Q13 (comfort scale, not scored).
- **Hidden (10):** Q2, Q4, Q7, Q8, Q11, Q15, Q16, Q19, Q21, Q22.
- **Retired/deleted earlier:** Q14, Q17, Q18, Q20 (see `../Retired-Questions.md`).

Rationale + pilot results per kept question: `../Fabry-Final-12-Questions-Rationale.docx`.
