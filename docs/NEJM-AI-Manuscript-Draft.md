# Does an AI Assistant Help Internal Medicine Residents Learn, or Only Perform? A Randomized Trial

**Target journal:** *NEJM AI* (Original Article)

**Authors:** Kevin Keet, MD¹\*; [Co-author], [degree]¹; [Co-author], [degree]¹; [Senior author], [degree]¹
*(Authorship and order to be finalized; designate equal-contribution authors with an equal-contribution footnote per NEJM AI policy. NEJM AI permits one corresponding author.)*

¹ Department of Medicine, Stanford University School of Medicine, Stanford, CA

\*Corresponding author: Kevin Keet, MD — kkeet@stanford.edu

**Running head:** AI assistance and learning in residents
**Trial registration:** [ClinicalTrials.gov / OSF ID — register before enrollment]
**Word count (body):** [to finalize] · **Abstract:** ~250 words

> **Drafting note for the authors.** This is a complete draft built around the study as implemented; the Results are templated to the pre-specified analysis plan and marked **[DATA]** where values from the 100-resident sample will be inserted. The reference list was assembled from a literature search; **author lists, volumes, and page numbers for the most recent citations must be verified against the primary sources before submission** (flagged inline). The framing follows the protocol's own characterization of the study as a *randomized "deskilling" trial* rather than an educational intervention.

---

## Abstract

**Background.** Large language model (LLM) assistants can improve clinicians' performance on reasoning tasks in real time, but whether residents who work a clinical case *with* an AI assistant actually *learn* from it — that is, retain knowledge they can later deploy unaided — is unknown. Education and workforce commentary increasingly warns that AI may cause *de-skilling*, *never-skilling*, or *mis-skilling*; for cognitive tasks in medicine, however, this concern rests largely on theory and analogy rather than randomized evidence. We tested it directly.

**Methods.** We conducted a single-center, parallel-group, 1:1 randomized trial at the Stanford University internal medicine residency. Residents worked through a single, deliberately unfamiliar clinical case (a young man with suspected Fabry disease) across five free-response clinical tasks, randomly assigned to one of two reference resources available *during* the case: an embedded AI chat assistant or UpToDate (accessed through the institutional library proxy). Immediately afterward, with **no resource available**, participants completed a 12-item knowledge assessment. The primary outcome was the post-case unassisted knowledge score. Secondary outcomes were the change in self-rated comfort caring for such a patient (0–10, pre vs. post), time on task, and resource-interaction metrics. Randomization used PGY-stratified permuted blocks with server-side allocation concealment.

**Results.** [DATA] Of 100 residents randomized (50 AI, 50 control), [N] completed the session. The mean post-case knowledge score was [X.X/12] in the AI arm versus [X.X/12] in the control arm (difference [Δ]; 95% CI [—]; P = [—]). [Secondary outcomes: comfort change, time, interaction metrics.]

**Conclusions.** [DATA-dependent.] In a randomized comparison, providing residents an AI assistant during a novel clinical case [did/did not] improve — and [did/did not] impair — the knowledge they could subsequently apply without assistance, relative to a standard clinical reference. These findings speak to whether AI assistance supports or substitutes for skill formation in graduate medical education.

*(Funding, registration, and data-availability statements below.)*

---

## Introduction

Large language model (LLM)–based assistants are entering clinical workflows faster than the evidence needed to govern their use in training. Randomized trials now show that LLMs can change clinicians' real-time reasoning: in a multicenter trial, access to an LLM did **not** significantly improve physicians' *diagnostic* reasoning over conventional resources — even though the LLM working alone outscored physicians in both arms¹ — whereas in a parallel trial the same research group found that LLM access **did** improve *management* reasoning on open-ended cases.² Other randomized studies report mixed performance effects of LLM assistance on patient-care tasks³ and across diverse practice settings.⁴ Across this literature the measured outcome is almost always **assisted performance** — how well the clinician does *while holding the tool*.

For trainees, this is the wrong endpoint to optimize alone. The defining task of residency is to build durable, transferable clinical knowledge and reasoning that a physician can deploy unaided and can use to supervise others — including, increasingly, to supervise AI. Performance with a tool and the *formation of skill* are dissociable, and a tool that boosts the former can leave the latter untouched or degraded. Recent work outside medicine makes this concrete: in randomized experiments on workers learning an unfamiliar software library, AI assistance impaired conceptual understanding, code reading, and debugging *without*, on average, delivering the expected efficiency gains; only participants who used AI in cognitively engaged ways preserved learning.⁵ Education studies converge on the same warning — students who wrote with generative AI produced higher-quality work but showed no corresponding gain in knowledge when later tested unaided, exhibiting "metacognitive laziness": less self-monitoring and less effortful engagement with the material.⁶ A growing literature distinguishes *performance gains* from *learning* when generative AI is used⁷ and links habitual cognitive offloading to weaker independent reasoning.⁸

The mechanism is well grounded in learning science. Durable learning depends on effortful, generative retrieval rather than passive reception: the testing (retrieval-practice) effect,⁹ the broader principle of "desirable difficulties,"¹⁰ and the generation effect¹¹ all show that the very effort a fluent AI answer removes is the effort that produces retention. An assistant that supplies a polished history, differential, or after-visit summary on request can short-circuit the encoding that would otherwise occur, while simultaneously reducing the difficulty signals that prompt a learner to monitor and correct their own understanding¹² — producing an illusion of competence that is especially hazardous for novices.

Medicine already has direct evidence that AI exposure can erode clinician skill. In a multicenter study of AI-assisted colonoscopy, endoscopists' adenoma detection rate on *standard, non-AI* colonoscopy fell after routine exposure to computer-aided detection — an absolute decline consistent with deskilling once the tool was removed.¹³ More broadly, automation bias — the tendency to over-trust automated advice and under-engage in independent verification — is a well-characterized hazard of clinical decision support, is more pronounced in less experienced clinicians, and can lower diagnostic accuracy when the system is imperfect.¹⁴,¹⁵ These findings raise a pointed question for training: if continuous AI exposure can degrade an expert's standalone skill, what does AI assistance do to a resident who is still forming that skill?

Commentary in the education, workforce, and now medical-education literature has crystallized this worry into three related but distinct hazards: **de-skilling**, the erosion of an existing competence once a tool reliably performs it; **never-skilling**, in which trainees who lean on automation early never acquire the foundational skill at all; and **mis-skilling**, in which uncritical acceptance of AI errors leads learners to internalize flawed knowledge as fact.¹⁶ For residents, the central risk is not de-skilling of an established competence but **never-skilling** — failing to form it — compounded by **mis-skilling** if AI errors are absorbed without verification. Yet for *cognitive* tasks in medicine this framework remains almost entirely conceptual. The one concrete demonstration of AI-associated skill loss in clinical practice is a *perceptual-motor* task (polyp detection at colonoscopy),¹³ and the randomized clinical-AI literature measures *assisted performance* rather than whether trainees form durable knowledge.¹⁻⁴ Whether de-, never-, or mis-skilling is a real and measurable consequence of AI assistance for a reasoning-and-knowledge task in medicine — or only a theorized one — has not, to our knowledge, been tested in a randomized trial.

Despite intense interest in generative AI for medical education, the field therefore still lacks randomized evidence on the outcome that matters for trainees: not how well a resident performs *with* an AI assistant, but how much they *learn from* working a case with one, measured by what they can do afterward without it. We conducted a randomized trial to test this concern directly — to ask whether AI assistance during a clinical case produces never-skilling (knowledge that fails to form) for a cognitive medical task. Residents worked an unfamiliar clinical case with either an AI assistant or a standard clinical reference (UpToDate), and we measured the knowledge they retained on an immediately following, resource-free assessment. The design deliberately separates the *assisted-performance* phase (the case, with the resource) from the *unassisted-learning* phase (the assessment, without it), isolating skill formation as the endpoint. We chose Fabry disease — a rare, multisystem condition unlikely to be within residents' existing knowledge — so that the assessment would capture knowledge newly acquired during the session rather than prior expertise.

---

## Methods

### Trial design and oversight
We conducted a single-center, parallel-group, individually randomized controlled trial with 1:1 allocation. The trial was reviewed by the Stanford University Institutional Review Board (IRB-86737) and determined to be exempt human-subjects research (benign behavioral intervention / educational testing). All participants reviewed an IRB-approved information sheet and provided consent before any data were collected. The trial was [pre-registered at — ID] prior to enrollment. Reporting follows the CONSORT statement (Figure 1).

### Setting and participants
Participants were resident physicians (PGY-1 through PGY-3; categorical internal medicine and preliminary medicine) in the Stanford University internal medicine residency. Residents were recruited by program-wide email; participation was voluntary, compensated ($100, prorated for partial completion), and explicitly independent of training, evaluation, or standing. Eligible residents completed a single online session of approximately 30–45 minutes on a laptop or desktop.

### Randomization and allocation concealment
A randomization list was generated in advance using permuted blocks (block size 4) stratified by PGY, producing 1:1 allocation to the AI and control arms within each stratum, from a fixed random seed (reproducible; locked before enrollment). Each resident received a unique enrollment code mapped server-side to a pre-assigned arm; the arm was concealed until the participant began the case. Because the intervention is a visible on-screen resource, participants were necessarily aware of which resource they used, but the study materials never named or characterized the arms (neutral language throughout), and participants were not informed of the study hypothesis. The primary outcome is objectively scored (see below), and outcome analysts will be blinded to arm.

### Clinical case
All participants worked an identical, fictional clinical vignette: a 32-year-old man referred for progressive chronic kidney disease of unclear etiology, with electrocardiographic left ventricular hypertrophy and a family history suggestive of X-linked inheritance — a presentation consistent with, but not diagnostic of, Fabry disease. Classic confirmatory features (acroparesthesia, angiokeratomas, cornea verticillata, enzyme/genetic results) were intentionally withheld from the initial vignette so that they had to be elicited or sought. Fabry disease was selected as a rare, multisystem condition outside the expected knowledge base of internal medicine residents, allowing the post-case assessment to measure knowledge acquired during the session rather than pre-existing expertise.

### Tasks and intervention
Within the case, participants completed five sequential, free-response clinical tasks: (1) additional history, (2) physical examination, (3) diagnostic workup, (4) next steps in management (with additional work-up findings revealed at this step), and (5) after-visit patient instructions. Participants were encouraged to use their assigned resource throughout the case, as they would in clinical care.

- **AI arm:** an embedded chat assistant powered by a frontier LLM (Anthropic Claude [model/version]), available in a side panel, with a one-click option to insert the case context into the conversation. No separate login was required. All messages were logged.
- **Control arm:** UpToDate, accessed through the Stanford Lane Library institutional proxy with the participant's university credentials, opened alongside the case.

Use of external resources during the subsequent assessment was prohibited and stated explicitly.

### Outcomes
The **primary outcome** was the score on a 12-item multiple-choice knowledge assessment completed **immediately after the case with no resource available**. Items were curated to test clinically meaningful, "learned-at-the-bedside" knowledge spanning the case domains (history, examination, workup, management, counseling) without directly restating any task's answer; items and the answer key were fixed before enrollment. Each item has a single correct option; the score is the number correct (0–12).

**Secondary outcomes** were: (1) change in self-rated comfort caring for a patient with this disease (0–10 scale), measured identically at intake (pre) and at the end of the assessment (post), analyzed as a paired change; (2) time on task (per task and total); and (3) resource-interaction metrics (for the AI arm, number and content of messages; for both arms, time with the resource). Free-response task answers were retained for exploratory analysis of reasoning quality.

### Sample size
With 100 residents (50 per arm), a two-sample comparison of the primary continuous outcome has 80% power at a two-sided α = 0.05 to detect a standardized between-arm difference of approximately 0.57 SD (Cohen's d) — corresponding to roughly [one item / ~X percentage points] given the pilot standard deviation. The trial is therefore powered to detect a moderate effect of AI assistance on subsequent unassisted knowledge in either direction (benefit or harm). [Finalize the minimum detectable difference in score points using the locked instrument's observed SD.]

### Statistical analysis
Analyses follow the intention-to-treat principle. The primary outcome (knowledge score) will be compared between arms using a linear regression model adjusting for the PGY randomization stratum, with the between-arm difference and 95% confidence interval as the primary estimand; a two-sample t-test will be reported as a sensitivity analysis. Comfort change will be analyzed with an ANCOVA adjusting for the pre-test rating (and exploratory mixed models for the paired pre/post structure); time and interaction metrics with appropriate parametric or rank-based tests. Pre-specified secondary and subgroup analyses (by PGY) are exploratory and interpreted with attention to multiplicity. The pre-registered analysis plan governs primary inference; analysis code will be shared (below). A P value < 0.05 (two-sided) is considered significant for the primary outcome.

### Data capture and security
The session ran on a purpose-built web application with a server-side database; responses, timing, and (in the AI arm) full conversation logs were recorded automatically. A single active session per participant was enforced. The case is fictional and contains no protected health information; participant-level data were stored securely under institutional standards and analyzed de-identified.

---

## Results

> **[DATA — to be completed.]** Template aligned to the analysis plan; insert values from the 100-resident sample.

**Enrollment and participants.** Between [start] and [end] 2026, [N screened/invited] residents enrolled and [N] were randomized (50 AI, 50 control); [N] completed the session and contributed primary-outcome data (Figure 1, CONSORT). Baseline characteristics were balanced across arms (Table 1), including PGY distribution, residency track, and pre-test comfort.

**Primary outcome.** The mean post-case unassisted knowledge score was **[X.X ± SD]/12** in the AI arm and **[X.X ± SD]/12** in the control arm — an adjusted difference of **[Δ] points (95% CI [—] to [—]; P = [—])** (Table 2, Figure 2). [State direction and whether the pre-specified threshold was met.]

**Secondary outcomes.** Self-rated comfort rose by **[Δ]** in the AI arm and **[Δ]** in the control arm (between-arm difference [—]; P = [—]). Median total time on task was **[—] min** (AI) versus **[—] min** (control) (P = [—]). In the AI arm, participants sent a median of **[—]** messages (IQR [—]); [describe relationship between interaction pattern/engagement and knowledge score, e.g., engaged vs. answer-seeking use], echoing the interaction-pattern dependence reported for skill formation.⁵

**Exploratory.** [PGY subgroup; reasoning-quality of free-response answers; correlation of comfort change with knowledge score — note any dissociation between confidence and performance.]

---

## Discussion

[DATA-dependent synthesis.] In this randomized trial, internal medicine residents who worked an unfamiliar clinical case with an AI assistant scored **[higher/no differently/lower]** on an immediately following, resource-free knowledge assessment than residents who used a standard clinical reference. Because the assessment was completed without any resource, this outcome reflects what residents *retained and could apply on their own* — skill formation — rather than assisted performance.

These results extend the clinical-AI RCT literature, which to date has measured how clinicians perform *with* a tool,¹⁻⁴ to the distinct and, for trainees, more consequential question of how much they *learn from* using one. [If null/negative:] A finding that AI assistance does not improve — or impairs — subsequent unaided knowledge would be consistent with cross-domain evidence that AI can raise output while leaving learning behind,⁵⁻⁷ with the cognitive-science account that fluent answers remove the retrieval effort that produces durable memory,⁹⁻¹² and with emerging clinical evidence of AI-associated deskilling and automation bias.¹³⁻¹⁵ [If positive:] A finding that AI assistance enhances learning would suggest that, configured and used as a tutor rather than an answer key, conversational AI can support skill formation — and would direct attention to *how* residents interact with it,⁵ a modifiable target for training.

Framed against the de-skilling/never-skilling/mis-skilling taxonomy,¹⁶ this trial supplies direct, randomized evidence on a concern that has, for cognitive medical tasks, been argued largely from theory and from analogy to procedural domains. Our primary endpoint targets **never-skilling**: whether knowledge fails to form when residents lean on an AI assistant during the case. [DATA: a null or negative between-arm difference would be, to our knowledge, the first randomized demonstration that never-skilling is a real consequence of AI assistance for a cognitive clinical task; a benefit would argue against it and toward AI as a learning aid.] The item-level and free-response data additionally let us probe **mis-skilling** — whether AI-arm errors concentrate on the specific points where a fluent but incomplete assistant is most likely to mislead (for example, treating a non-pathognomonic finding as definitive) — and whether any rise in self-rated comfort outpaces actual knowledge, the confidence–competence gap that makes never-skilling and mis-skilling hard to detect at the bedside.

A central implication is that **the endpoint matters**. Optimizing AI tools and curricula for assisted performance — the outcome most studies and product evaluations report — may select for designs that quietly substitute for, rather than build, the competence residency exists to develop. Trainee-facing AI should be evaluated, and possibly engineered, against learning and retention, not just task completion. Our exploratory interaction-pattern analyses [support/do not support] the hypothesis that cognitively engaged use preserves learning, which would make *how to prompt and verify* a teachable skill in its own right.

### Limitations
This was a single-center trial in one residency program, limiting generalizability; multi-site replication would strengthen external validity. The case was fictional and the outcome a knowledge assessment administered immediately after the session — a proximal measure of learning that may not capture longer-term retention, transfer to new cases, or bedside performance; a delayed reassessment would test durability. Participants could not be blinded to their assigned resource, although they were blinded to arm labels and the hypothesis. The control resource (UpToDate) and the specific AI model and interface reflect particular implementations; results may differ with other tools, configurations, or prompting support. Finally, the trial measures the effect of a single exposure; cumulative effects of habitual AI use during training — the scenario of greatest concern for deskilling — remain to be studied.

### Conclusions
[DATA-dependent.] Among internal medicine residents working an unfamiliar clinical case, access to an AI assistant **[did/did not]** change the knowledge they could subsequently apply without assistance, relative to a standard clinical reference. Concern about AI-induced de-skilling, never-skilling, and mis-skilling has so far outrun the evidence for cognitive tasks in medicine; this trial provides a direct, randomized test of it. As generative AI becomes ubiquitous in clinical training, randomized evidence on *learning* — on whether these tools up-skill trainees or quietly never-skill them, not only on how trainees perform with a tool in hand — should govern how AI is introduced into graduate medical education.

---

## Declarations

**Funding.** [Source; participant payments disbursed through the Stanford Department of Medicine.]
**Trial registration.** [Registry and ID; registered before enrollment.]
**Ethics.** Stanford IRB-86737 (exempt); informed consent obtained from all participants.
**Data and code availability.** The clinical case, the 12-item assessment instrument and answer key, the randomization procedure, and the analysis code will be made available [repository/on request]; participant-level data available [terms].
**Author contributions.** [CRediT taxonomy; designate equal-contribution authors per NEJM AI policy.]
**Conflicts of interest.** [Disclose any relationship with AI vendors; the AI assistant used a commercial frontier model.]
**Generative AI disclosure.** [Per NEJM AI policy, disclose any use of generative AI in manuscript preparation. The AI assistant is the trial intervention, not a writing tool, and should be described in Methods.]

---

## Tables and Figures (shells)

**Figure 1.** CONSORT participant flow (assessed → randomized → allocated → completed → analyzed), by arm.

**Figure 2.** Distribution of post-case knowledge scores by arm (e.g., box/violin plot with individual points; mean and 95% CI).

**Table 1. Baseline characteristics, by arm.** Rows: N; PGY-1/2/3; residency track; pre-test comfort (mean ± SD). Columns: AI, Control.

**Table 2. Outcomes, by arm.** Rows: primary knowledge score (mean ± SD; adjusted difference, 95% CI, P); comfort change; total time; AI-arm interaction metrics. Columns: AI, Control, Between-arm effect.

*(Optional Figure 3: knowledge score vs. AI-interaction engagement metric, to probe the engaged-use hypothesis.)*

---

## References

> *Verify author lists, volumes, and page numbers against the primary sources before submission — especially the 2024–2026 items assembled from literature search (flagged ⚠).*

1. Goh E, Gallo R, Hom J, et al. Large language model influence on diagnostic reasoning: a randomized clinical trial. *JAMA Netw Open.* 2024;7(10):e2440969.
2. Goh E, Gallo R, Strong E, et al. Large language model influence on management reasoning: a randomized controlled trial. *medRxiv* 2024.08.05.24311485 (2024). ⚠ verify final published venue.
3. GPT-4 assistance for improvement of physician performance on patient care tasks: a randomized controlled trial. *Nat Med.* 2025. doi:10.1038/s41591-024-03456-y. ⚠ verify authors/citation.
4. Large language model diagnostic assistance for physicians in a lower-middle-income country: a randomized controlled trial. *Nat Health.* 2025. doi:10.1038/s44360-025-00007-8. ⚠ verify authors/citation.
5. Shen JH, Tamkin A. How AI impacts skill formation. *arXiv:2601.20245* (2026).
6. Fan Y, et al. Beware of metacognitive laziness: effects of generative artificial intelligence on learning motivation, processes, and performance. *Br J Educ Technol.* 2025 (arXiv:2412.09315). ⚠ verify citation.
7. Distinguishing performance gains from learning when using generative AI. *arXiv:2605.13731* (2026). ⚠ verify authors.
8. Gerlich M. AI tools in society: impacts on cognitive offloading and the future of critical thinking. *Societies.* 2025. ⚠ verify citation.
9. Roediger HL III, Karpicke JD. The power of testing memory: basic research and implications for educational practice. *Perspect Psychol Sci.* 2006;1(3):181–210.
10. Bjork RA. Memory and metamemory considerations in the training of human beings. In: Metcalfe J, Shimamura AP, eds. *Metacognition: Knowing about Knowing.* MIT Press; 1994:185–205.
11. Slamecka NJ, Graf P. The generation effect: delineation of a phenomenon. *J Exp Psychol Hum Learn Mem.* 1978;4(6):592–604.
12. Sweller J. Cognitive load during problem solving: effects on learning. *Cogn Sci.* 1988;12(2):257–285.
13. Budzyń K, et al. Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational study. *Lancet Gastroenterol Hepatol.* 2025;10(10):896–903. ⚠ verify author list.
14. Goddard K, Roudsari A, Wyatt JC. Automation bias: a systematic review of frequency, effect mediators, and mitigators. *J Am Med Inform Assoc.* 2012;19(1):121–127.
15. Lyell D, Coiera E. Automation bias and verification complexity: a systematic review. *J Am Med Inform Assoc.* 2017;24(2):423–431. ⚠ verify.
16. AI-induced never-skilling in medical education. *Nat Med.* 2026. doi:10.1038/s41591-026-04438-y. ⚠ verify author list/citation.

*(Additional citations to consider: a recent review of generative AI in medical education; Karpicke & Roediger 2008 on retrieval and long-term retention; a CONSORT reference.)*
