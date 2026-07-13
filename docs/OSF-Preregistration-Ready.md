# OSF Preregistration — paste-ready

**Study:** AI Assistance and Medical Knowledge Development: A Randomized Trial Among Internal Medicine Residents (Stanford IRB-86737)

> **How to use.** On osf.io: create (or open) a project → **Registrations → New registration → "OSF Preregistration"** template. Paste each field below into the matching box. **Do not click the final "Register" until you're ready** — a registration is permanent and time-stamped, and must be created **before the first participant enrolls** (choose "Registration prior to creation of data"; embargo optional). Confirm the details in brackets first.

---

## 1 · Study Information

**Title**
AI Assistance and Medical Knowledge Development: A Randomized Trial Among Internal Medicine Residents.

**Description** *(optional)*
Large language model (LLM) assistants now pervade clinical training, but existing randomized evidence measures how clinicians *perform with* a tool, not whether trainees *learn from* using one. This single-center randomized trial tests whether internal medicine residents who work an unfamiliar clinical case (suspected Fabry disease) with an out-of-the-box AI assistant acquire knowledge they can later deploy unaided, versus residents using a standard clinical reference (UpToDate). The design separates an assisted-performance phase (the case, with the resource) from an unassisted-acquisition phase (a resource-free assessment), isolating knowledge acquisition.

**Hypotheses**
- **H1 (primary, two-sided).** Post-case unassisted knowledge scores differ between the AI and control arms. The motivating literature (cognitive offloading; AI-associated de-/never-/mis-skilling) raises the possibility of equal or lower retained knowledge in the AI arm despite comparable in-task performance; the primary test is two-sided to detect benefit or harm.
- **H2 (secondary).** Change in self-rated comfort (pre→post) differs between arms; we will examine whether any comfort gain is dissociated from knowledge (confidence rising without commensurate learning).
- **H3 (secondary, exploratory, mixed-methods).** Within the AI arm, residents whose conversations are coded as cognitively *engaged* (asking "why/what-if," reasoning before asking, verifying outputs) acquire more knowledge than those coded as *offloading* (requesting answers to transcribe, delegating reasoning, accepting outputs unscrutinized). Correlational (interaction style is self-selected).

---

## 2 · Design Plan

**Study type:** Experiment — a randomized controlled trial with two parallel arms.

**Blinding.** Participants cannot be blinded to the on-screen resource they use, but (a) study materials never name or characterize the arms (neutral language), (b) participants are not told the hypothesis, and (c) the primary outcome is objectively, automatically scored. Outcome analysts will be blinded to arm during analysis; the qualitative interaction-pattern coders will be blinded to knowledge scores.

**Study design.** Single-center, parallel-group, individually randomized, 1:1 allocation. All residents work an identical clinical case through five free-response tasks with their assigned resource, then complete an identical knowledge assessment with no resource available.
- AI arm: embedded chat assistant (Anthropic Claude Opus 4.7, used out of the box — no system prompt or configuration).
- Control arm: UpToDate via the Stanford Lane Library institutional proxy.

**Randomization.** Computer-generated list using **permuted blocks (block size 4) stratified by post-graduate year (PGY 1/2/3)**, giving 1:1 allocation within each stratum, from a fixed random seed locked before enrollment (reproducible). Each participant's enrollment code maps server-side to a pre-assigned arm; **allocation is concealed until the case begins.**

---

## 3 · Sampling Plan

**Existing data:** Registration prior to creation of data. *(Pilot/usability data collected during platform development are excluded from the confirmatory analysis and archived separately.)*

**Explanation of existing data:** No confirmatory data have been collected. Development-phase pilot data are not part of the analyzed sample.

**Data collection procedures.** Program-wide email invitation to Stanford internal medicine residents (PGY-1–3, categorical and preliminary). Participation is voluntary, compensated ($100, prorated for partial completion), and explicitly independent of training, evaluation, or standing. Each resident completes a single ~30–45-minute online session on a laptop/desktop, providing consent via an IRB-approved information sheet before any data are captured.

**Sample size:** 100 residents (50 per arm).

**Sample size rationale.** With 50 per arm, a two-sample comparison of the primary continuous outcome has **80% power at two-sided α = 0.05 to detect a standardized between-arm difference of ≈0.57 SD** (Cohen's d) — a moderate effect, in either direction. [Optionally state the minimum detectable difference in score points using the locked instrument's SD.]

**Stopping rule.** Enrollment stops at N = 100 or at the end of the recruitment window, whichever comes first. No interim analyses; no early stopping for efficacy or futility.

---

## 4 · Variables

**Manipulated variables.** Reference resource available during the case: AI assistant vs. UpToDate (between-subjects, 1:1).

**Measured variables.**
- **Primary:** post-case knowledge score — number correct on a 12-item multiple-choice assessment (0–12), completed immediately after the case **with no resource available**. Items, options, and answer key fixed before enrollment; one correct option per item; auto-scored.
- **Secondary:** (1) self-rated comfort caring for such a patient (0–10), identical item at intake (pre) and end of assessment (post); (2) time on task (per task and total); (3) AI-arm interaction metrics (message count; qualitatively coded interaction pattern — see Analysis).
- **Exploratory:** free-response task answers (reasoning-quality coding); PGY subgroup.

**Indices.** Knowledge score = simple sum of correct items (0–12). Comfort change = post − pre. Engagement (H3) = coder-assigned dominant interaction pattern (engaged vs. offloading) plus a continuous engagement score derived from the coding scheme.

---

## 5 · Analysis Plan

**Statistical models.** Intention-to-treat. **Primary:** linear regression of the knowledge score on arm, adjusting for the PGY randomization stratum; the adjusted between-arm difference and 95% CI is the primary estimand (unadjusted two-sample t-test as sensitivity analysis). **Comfort (H2):** ANCOVA (post adjusted for pre), with an exploratory mixed model for the paired structure. **Time/interaction metrics:** t-test or Wilcoxon as distribution dictates. **H3 (interaction patterns):** two coders, blinded to scores, independently code each AI-arm conversation by directed content analysis against an a priori engaged-vs-offloading framework (adapted from skill-formation research; Shen & Tamkin), refined inductively for clinical content; inter-rater reliability (Cohen's κ) reported and disagreements resolved by consensus; the dominant pattern / continuous engagement score is related to the knowledge score by linear regression adjusting for PGY and message count.

**Transformations.** None planned for the bounded 0–12 score. Timing may be log-transformed or analyzed nonparametrically if skewed.

**Inference criteria.** Two-sided α = 0.05 for the primary outcome. Secondary and exploratory analyses are interpreted as hypothesis-generating, with attention to multiplicity (no formal alpha allocation beyond the primary).

**Data exclusion.** ITT retains all randomized participants with a primary-outcome value. A pre-specified per-protocol sensitivity analysis excludes sessions never begun (no case interaction). Implausible timing values (e.g., idle sessions) will be handled per a rule fixed before unblinding.

**Missing data.** Completion by arm will be reported (CONSORT). Primary analysis on complete cases, with a sensitivity analysis (multiple imputation or pattern-mixture) if missingness exceeds [10%].

**Exploratory analysis.** Interaction-pattern → knowledge association (H3); PGY subgroups; relationship between comfort change and knowledge (confidence–competence dissociation); reasoning-quality coding of free-response answers.

---

## 6 · Other

Ethics: Stanford IRB-86737 (exempt). The clinical case is fictional and contains no protected health information. The clinical case, the 12-item instrument and answer key, the randomization procedure, and the analysis code will be shared. The intervention uses a commercial frontier model in its default configuration; investigator conflicts, if any, will be disclosed. Target reporting: CONSORT.
