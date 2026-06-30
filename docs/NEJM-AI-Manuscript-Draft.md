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

**Background.** Large language model (LLM) assistants can improve clinicians' performance on reasoning tasks in real time, but whether trainees who work a clinical case *with* an AI assistant actually *acquire* knowledge they can later deploy unaided is unknown. Commentary has named the risk — AI-induced *de-skilling*, *never-skilling*, and *mis-skilling* — but for cognitive tasks in medicine it rests largely on theory, and the AI use that pervades clinical training is mostly *incidental* (learning as a byproduct of patient care) rather than the *deliberate* study that AI tutors support. We conducted a randomized trial centered on the measurable construct — knowledge acquisition — in the incidental setting.

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

Medical education has begun to name these hazards. In a 2025 *New England Journal of Medicine* essay, Abdulnour and colleagues distinguished three risks of clinical AI use: **de-skilling**, the loss of competencies a clinician once had; **never-skilling**, the failure of trainees to develop competencies because AI did the cognitive work at the moment of skill formation; and **mis-skilling**, the adoption of incorrect or biased AI-generated patterns, including those reinforced by model sycophancy.¹⁶ These terms are now the common vocabulary of the field, but they map awkwardly onto residents, who occupy a muddy middle — licensed physicians still both acquiring and consolidating clinical reasoning — so that AI reliance threatens at once to arrest emerging skill and to erode it. Rather than adjudicate that boundary, we focus on the construct common to all three and the one that is directly measurable: **knowledge acquisition** — whether working a case with an AI assistant leaves a resident with knowledge they can later deploy unaided. Empirically, even this is far better developed in theory than in evidence: the clearest demonstrations of AI-associated skill loss in medicine are *perceptual* tasks — adenoma detection at colonoscopy¹³ and image interpretation in radiology¹⁷ — while the randomized clinical-AI literature measures *assisted performance*, not what trainees retain.¹⁻⁴ For a cognitive task, whether AI assistance builds or bypasses durable knowledge has not, to our knowledge, been tested in a randomized trial.

A second distinction is essential and, so far, largely unmade. AI can be used to *deliberately* learn — board-review tutors, question banks, and study assistants explicitly built to teach, a fast-growing category in which the learner's goal is mastery and the AI is configured as a teacher. But the AI use that now pervades clinical training is different: it is *incidental*, embedded in the work of caring for patients. A trainee pulls up a chatbot mid-rounds to generate a differential, draft a note, or answer a question — the goal is to complete the clinical task, and whatever learning occurs is a byproduct. Incidental learning in the course of patient care has been the engine of clinical training since Osler; it is also where the offloading risk is greatest, because the explicit aim of the encounter is to complete the clinical task rather than to study, so that — unless the trainee brings a learning-oriented posture to the interaction — a fluent answer can remove the very effort that would otherwise build skill. Evidence about AI tutors used for deliberate study does not transfer to this setting. Our trial models the incidental case: residents use AI to *do the clinical work*, and we measure what knowledge nonetheless formed.

Despite intense interest in generative AI for medical education, the field still lacks randomized evidence on the outcome that matters for trainees: not how well a resident performs *with* an AI assistant, but how much they *acquire* from working a case with one — knowledge they can later apply without it. We conducted a randomized trial to test this directly. Residents worked an unfamiliar clinical case with either an embedded AI assistant or a standard clinical reference (UpToDate), and we measured the knowledge they retained on an immediately following, resource-free assessment. The design deliberately separates an *assisted-performance* phase (the case, with the resource) from an *unassisted-acquisition* phase (the assessment, without it), isolating knowledge acquisition as the endpoint. We chose Fabry disease — a rare, multisystem condition unlikely to be within residents' existing knowledge — so that the assessment would capture knowledge newly acquired during the session rather than prior expertise. As an exploratory aim, and following evidence that *how* one interacts with AI, more than how much, determines whether it builds or erodes skill,⁵ we examined whether more cognitively engaged interaction in the AI arm was associated with greater retained knowledge.

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

- **AI arm:** an embedded, general-purpose chat assistant built on a frontier large language model (Anthropic Claude Opus [4.8 — confirm]), available in a side panel, with a one-click option to insert the case context into the conversation. The assistant was used in essentially its default conversational form: a brief system prompt set a concise, high-yield clinical communication style, but it was not configured to tutor, to question the resident Socratically, or otherwise to promote learning. No separate login was required, and all messages were logged. *(⚠ Drafting note: the deployed application currently runs `claude-opus-4-7`, and its system prompt also instructs the assistant to give targeted feedback when the resident shares their own reasoning; finalize the model version and the exact system prompt used during data collection, report them verbatim — ideally as a supplement — and reconcile with the "default/general-purpose" description above.)*
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

Framed against the de-skilling/never-skilling/mis-skilling taxonomy,¹⁶ this trial supplies direct, randomized evidence on a concern that, for cognitive medical tasks, has been argued largely from theory and from analogy to perceptual domains. Because residents sit between acquiring and maintaining clinical reasoning, we framed the endpoint not as a verdict on which label applies but as **knowledge acquisition** in the incidental setting that dominates real practice — whether working a case with an AI assistant, as one would in caring for a patient, leaves residents with knowledge they can deploy unaided. [DATA: a null or negative between-arm difference would be, to our knowledge, the first randomized signal that AI assistance can bypass durable knowledge formation for a cognitive clinical task; a benefit would argue toward AI as a learning aid even when learning is incidental.] The item-level and free-response data additionally let us probe **mis-skilling** — whether AI-arm errors concentrate where a fluent but incomplete assistant is most likely to mislead (for example, treating a non-pathognomonic finding as definitive) — and whether any rise in self-rated comfort outpaces actual knowledge, the confidence–competence gap that makes these risks hard to detect at the bedside. Consistent with evidence that interaction *posture* governs whether AI builds or erodes skill,⁵ our exploratory analysis of engaged versus answer-seeking use [supports/does not support] the hypothesis that *how* residents use AI, more than whether they use it, determines what they learn. If interaction posture proves both consequential and modifiable, the operative educational question shifts from whether residents use AI to whether they can be taught to use it in skill-preserving ways — a question this paradigm is well positioned to answer next.

A central implication is that **the endpoint matters**. Optimizing AI tools and curricula for assisted performance — the outcome most studies and product evaluations report — may select for designs that quietly substitute for, rather than build, the competence residency exists to develop; trainee-facing AI should be evaluated, and possibly engineered, against learning and retention, not just task completion. The assistant studied here was a general-purpose chatbot with no learning-specific configuration, and AI tools are unlikely to be interchangeable on this dimension. Whether a tool built or prompted to reason *with* the resident rather than *for* them — a dedicated medical evidence assistant, or a deliberately Socratic configuration — would change what residents retain is unknown; the same paradigm could compare such tools head to head, and the present result establishes the default-chatbot baseline against which any learning-oriented design would have to prove itself.

### Limitations
This was a single-center trial in one residency program, limiting generalizability; multi-site replication would strengthen external validity. The case was fictional and the outcome a knowledge assessment administered immediately after the session — a proximal measure of learning that may not capture longer-term retention, transfer to new cases, or bedside performance; a delayed reassessment would test durability. Participants could not be blinded to their assigned resource, although they were blinded to arm labels and the hypothesis. The control resource (UpToDate) and the specific AI model and interface reflect particular implementations; results may differ with other tools, configurations, or prompting support. Because the case turns on a disease outside residents' prior knowledge, the trial indexes the cognitive-offloading *mechanism* shared by de- and never-skilling — whether case work with AI yields independently-retained knowledge — rather than the erosion of a pre-existing, familiar skill per se; this controlled new-learning paradigm is the cleanest available probe of that mechanism, but complementary designs — in medical students (never-skilling) and with familiar content (de-skilling of established knowledge) — would localize where on the training continuum the effect is largest. Finally, the trial measures the effect of a single exposure; cumulative effects of habitual AI use during training — the scenario of greatest concern for de-skilling — remain to be studied.

### Conclusions
[DATA-dependent.] Among internal medicine residents working an unfamiliar clinical case, access to an AI assistant **[did/did not]** change the knowledge they could subsequently apply without assistance, relative to a standard clinical reference. Concern about AI-induced de-skilling, never-skilling, and mis-skilling has so far outrun the evidence for cognitive tasks in medicine; this trial provides a direct, randomized test of whether incidental AI use during patient care builds or bypasses durable knowledge. As generative AI becomes ubiquitous in clinical training, randomized evidence on what trainees *acquire* — not only on how they perform with a tool in hand — should govern how AI is introduced into graduate medical education.

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
16. Abdulnour R-EE, Gin B, Boscardin CK. Educational strategies for clinical supervision of artificial intelligence use. *N Engl J Med.* 2025;393:786–797.
17. Macnamara BN, Berber I, Çavuşoğlu MC, et al. Does using artificial intelligence assistance accelerate skill decay and hinder skill development without performers' awareness? *Cogn Res Princ Implic.* 2024;9:46.

*(Additional citations to consider: a recent review of generative AI in medical education; Karpicke & Roediger 2008 on retrieval and long-term retention; a CONSORT reference.)*
