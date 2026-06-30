# Preregistration — AI Assistance and Medical Knowledge Development

**A Randomized Trial Among Internal Medicine Residents (Stanford IRB-86737)**

> **Venue recommendation.** Register on **OSF Registries** (the natural home for a behavioral/education RCT) using the "OSF Preregistration" template — the structure below maps to its fields. NEJM AI expects prospective registration; **complete and time-stamp this before the first participant enrolls.** ClinicalTrials.gov is designed for interventional trials of *health* outcomes and likely does not apply to an exempt education trial, but a ClinicalTrials.gov field map is included at the end in case a co-author or the journal prefers it. Confirm NEJM AI's accepted registries before submission.

---

## 1. Study information

**Title.** AI Assistance and Medical Knowledge Development: A Randomized Trial Among Internal Medicine Residents.

**Authors.** Kevin Keet, MD (PD); [co-authors]. (Stanford University School of Medicine, Department of Medicine.)

**Description.** Large language model (LLM) assistants are entering clinical training, but existing randomized evidence measures how clinicians perform *with* a tool, not how much they *learn from* using one. This trial randomizes internal medicine residents to work an unfamiliar clinical case (suspected Fabry disease) with either an embedded AI chat assistant or a standard clinical reference (UpToDate), then measures the knowledge they retain on an immediately following, resource-free assessment. The design separates an *assisted-performance* phase (the case, with the resource) from an *unassisted-learning* phase (the assessment, without it), isolating skill formation as the outcome.

**Hypotheses (pre-specified, directional reasoning; primary test two-sided).**
- **H1 (primary).** Post-case unassisted knowledge scores differ between the AI and control arms. The motivating literature (cognitive offloading; AI-associated deskilling) raises the possibility that AI assistance yields **equal or lower** retained knowledge despite comparable or better in-task performance; the primary test is two-sided to allow detection of benefit or harm.
- **H2 (secondary).** Change in self-rated comfort (pre→post) differs between arms; we will examine whether any comfort gain is **dissociated** from knowledge (i.e., confidence rising without commensurate learning).
- **H3 (secondary/exploratory).** Within the AI arm, more cognitively engaged interaction (e.g., asking "why," reasoning before asking, verifying) is associated with higher retained knowledge than answer-seeking interaction.

---

## 2. Design plan

**Study type.** Experiment — single-center, parallel-group, individually randomized controlled trial.

**Blinding.** Participants cannot be blinded to the on-screen resource they use, but (a) study materials never name or characterize the arms (neutral language), (b) participants are not told the hypothesis, and (c) the primary outcome is objectively, automatically scored. Outcome analysts will be blinded to arm during analysis.

**Study design.** Two arms, 1:1 allocation:
- **AI arm:** embedded LLM chat assistant (Anthropic Claude [model/version]) available during the five-task case.
- **Control arm:** UpToDate via the Stanford Lane Library institutional proxy during the same case.
All participants complete an identical case and an identical resource-free assessment immediately afterward. No resource is permitted during the assessment.

**Randomization.** Computer-generated randomization list using **permuted blocks (block size 4), stratified by PGY (1, 2, 3)**, 1:1 within each stratum, from a fixed random seed locked before enrollment (reproducible). Each resident receives a unique enrollment code mapped server-side to a pre-assigned arm; **allocation is concealed until the participant begins the case.**

---

## 3. Sampling plan

**Existing data.** Registration precedes enrollment of analyzed participants. (Pilot/usability data collected during platform development are excluded from the confirmatory analysis and are archived separately.)

**Data collection procedures.** Program-wide email invitation to Stanford internal medicine residents (PGY-1–3, categorical and preliminary). Voluntary, compensated ($100, prorated), explicitly independent of training/evaluation. Single online session (~30–45 min) on laptop/desktop; consent via IRB-approved information sheet before any data capture.

**Sample size.** Target **N = 100 (50 per arm).** With 50/arm, a two-sample comparison of the primary continuous outcome has **80% power at two-sided α = 0.05 to detect a standardized between-arm difference of ≈0.57 SD** (Cohen's d) — ≈ [one item / X percentage points] given the locked instrument's SD. [Finalize the minimum detectable difference in score points from the instrument's observed SD before locking.]

**Stopping rule.** Enrollment stops at N = 100 (or at the end of the recruitment window). No interim analyses; no early stopping for efficacy/futility.

---

## 4. Variables

**Manipulated variable.** Reference resource during the case: AI assistant vs. UpToDate (between-subjects).

**Primary outcome (measured).** Post-case **knowledge score** = number correct on the 12-item multiple-choice assessment (0–12), completed immediately after the case **with no resource available**. Items, options, and answer key are fixed before enrollment; each item has one correct option; auto-scored.

**Secondary outcomes (measured).**
1. **Comfort change**: self-rated comfort caring for such a patient (0–10), measured identically at intake (pre) and end of assessment (post); analyzed as change and as post adjusted for pre.
2. **Time on task**: per-task and total seconds.
3. **Resource-interaction metrics**: AI arm — number of messages, message content/engagement classification; both arms — time with the resource.

**Exploratory (measured).** Free-response task answers (reasoning-quality coding); PGY subgroup; relationship between comfort change and knowledge.

---

## 5. Analysis plan

**Primary analysis.** Intention-to-treat. Compare the knowledge score between arms with a **linear regression adjusting for the PGY randomization stratum**; the adjusted between-arm difference and 95% CI is the primary estimand. Sensitivity: two-sample t-test (unadjusted).

**Secondary analyses.** Comfort: ANCOVA (post adjusted for pre), with an exploratory mixed model for the paired pre/post structure. Time and interaction metrics: t-test or Wilcoxon as distribution dictates. H3: within-AI-arm association between engagement metric and knowledge score (regression).

**Inference criteria.** Two-sided α = 0.05 for the primary outcome. Secondary/exploratory analyses are interpreted as hypothesis-generating with attention to multiplicity (no formal alpha allocation beyond the primary).

**Data exclusion.** Pre-specified: exclude sessions not begun (no case interaction) from per-protocol sensitivity only; ITT retains all randomized participants with a primary-outcome value. Define a priori what counts as a completed assessment.

**Missing data.** Report completion by arm (CONSORT). Primary analysis on complete cases; sensitivity analysis with [multiple imputation / pattern-mixture] if missingness > [10%].

**Outliers / transformations.** None planned for the bounded 0–12 score; pre-specify handling of implausible timing values (e.g., sessions left idle) before unblinding.

---

## 6. Other

**Ethics.** Stanford IRB-86737 (exempt); informed consent from all participants.
**Timeline.** Registration before first enrollment; enrollment [dates]; analysis after database lock.
**Data & code availability.** Clinical case, 12-item instrument + answer key, randomization procedure, and analysis code to be shared [repository]; participant-level data per institutional terms.
**Conflicts.** Disclose any relationship with the AI vendor; the intervention uses a commercial frontier model.

---

## Appendix — ClinicalTrials.gov field map (if used)

| ClinicalTrials.gov field | Value |
|---|---|
| Study type | Interventional (behavioral) |
| Primary purpose | [Other / Health services research] |
| Allocation | Randomized |
| Intervention model | Parallel assignment |
| Masking | None (open label); outcome assessor blinded |
| Arms | Experimental: AI assistant · Active comparator: UpToDate |
| Enrollment | 100 |
| Primary outcome measure | Post-case unassisted 12-item knowledge score (0–12), measured immediately after the case |
| Secondary outcome measures | Comfort change (0–10, pre→post); time on task; AI-interaction metrics |
| Eligibility | Stanford internal medicine residents, PGY-1–3 |
| Allocation concealment / sequence generation | PGY-stratified permuted blocks (size 4), fixed seed, server-side concealment |
