# Does an AI Assistant Help Internal Medicine Residents Learn, or Only Perform? A Randomized Trial

**Target journal:** *NEJM AI* (Original Article)

**Authors:** Kevin Keet, MD¹\*; [Co-author], [degree]¹; [Co-author], [degree]¹; [Senior author], [degree]¹
*(Author order and equal-contribution designation to be finalized; mark co-first authors with an equal-contribution footnote per NEJM AI policy. One corresponding author is permitted.)*

¹ Department of Medicine, Stanford University School of Medicine, Stanford, CA

\*Corresponding author: Kevin Keet, MD — kkeet@stanford.edu

**Running head:** AI assistance and knowledge acquisition in residents
**Trial registration:** [register on OSF before first enrollment — ID]
**Word count (body):** [finalize] · **Abstract:** ~280 words

> **Drafting note.** Complete from-scratch draft. Methods reflect the study as built; **Results are templated to the pre-specified analysis plan and marked [DATA]** for the 100-resident sample. Citations were assembled from a literature search and an annotated bibliography (`Literature-Review-Annotated`); **verify author lists, volumes, and pages — and resolve which preprints to cite as such — before submission** (flagged inline with *(verify)*).

---

## Abstract

**Background.** Large language model (LLM) assistants now pervade clinical training, and randomized trials show they can change clinicians' real-time reasoning. But these trials measure *assisted performance* — how well a clinician does while holding the tool. For trainees, the outcome that matters is different: whether working a case *with* AI builds knowledge they can later deploy *without* it. Evidence from other fields shows AI can raise output while leaving — or eroding — the underlying learning, and medical educators have named the risks (de-skilling, never-skilling, mis-skilling); yet for cognitive tasks in medicine the concern has rested on theory and on analogy to perceptual tasks, untested by randomized trial.

**Methods.** In a single-center, parallel-group, 1:1 randomized trial at the Stanford University internal medicine residency, residents worked an unfamiliar clinical case (suspected Fabry disease) through five free-response tasks, randomized to one of two resources available *during* the case: an embedded, out-of-the-box AI chat assistant or UpToDate. Immediately afterward, with **no resource available**, they completed a 12-item knowledge assessment. Randomization used PGY-stratified permuted blocks with server-side allocation concealment. The primary outcome was the post-case unassisted knowledge score; secondary outcomes were change in self-rated comfort (0–10, pre vs. post), time on task, and AI-interaction metrics.

**Results.** [DATA] Of 100 residents randomized (50 AI, 50 control), [N] completed the session. Mean post-case knowledge score was [X.X/12] (AI) vs. [X.X/12] (control); adjusted difference [Δ] (95% CI [—]; P = [—]). [Comfort change, time, interaction metrics.]

**Conclusions.** [DATA-dependent.] Among internal medicine residents, access to an out-of-the-box AI assistant during an unfamiliar case [did/did not] change the knowledge they could subsequently apply unaided, relative to a standard clinical reference. The trial provides direct randomized evidence on whether incidental AI use during patient care builds or bypasses durable clinical knowledge.

---

## Introduction

Generative artificial intelligence has entered clinical training faster than the evidence needed to guide it. Surveys already report that a majority of medical trainees — by some estimates 60–85% — use tools such as ChatGPT in their studies and clinical work, often to learn or review.¹ The tools are capable: a large language model (LLM) has matched or exceeded physicians on complex diagnostic challenges² and on free-response clinical-reasoning examinations,³ and in a randomized trial of diagnostic reasoning the LLM working alone outscored physicians whether or not the physicians had access to it.⁴ Yet randomized trials of LLM *assistance* show mixed effects on clinicians' own reasoning — improving open-ended management reasoning in one trial,⁵ and patient-care task performance variably in others,⁶,⁷ — and, critically, they all measure the same thing: **assisted performance**, how well the clinician does while holding the tool.

For trainees, assisted performance is the wrong endpoint to optimize alone. The purpose of residency is to build durable, transferable clinical knowledge and reasoning that a physician can deploy unaided — and, increasingly, can use to supervise AI itself. Performance with a tool and the *formation of skill* are dissociable, and a tool that boosts the former can leave the latter untouched or degraded. Outside medicine this is now well documented. In randomized experiments with workers learning an unfamiliar software library, AI assistance impaired conceptual understanding, code reading, and debugging without delivering the expected efficiency gains — and which outcome occurred depended on *how* the worker engaged the AI.⁸ Students who wrote with generative AI produced better work but gained no measurable knowledge when later tested unaided, displaying "metacognitive laziness."⁹ A survey of knowledge workers linked greater confidence in AI to *less* critical thinking and reduced perceived cognitive effort,¹⁰ and an electroencephalographic study found that essay-writers using an LLM showed the weakest neural connectivity, the least ownership of their own work, and reduced engagement that persisted after the AI was removed — "cognitive debt."¹¹ Among novice programmers, the benefit of AI was unevenly distributed: those with strong metacognitive skills gained, while weaker ones were harmed.¹² A growing literature distinguishes performance gains from learning when AI is used¹³ and links habitual cognitive offloading to weaker independent reasoning.¹⁴

The mechanism is well grounded in cognitive science. Durable learning depends on effortful, generative retrieval rather than passive reception: the testing (retrieval-practice) effect,¹⁵ the broader principle of "desirable difficulties,"¹⁶ and the generation effect¹⁷ all show that the very effort a fluent AI answer removes is the effort that produces retention, and cognitive-load theory frames why short-circuiting productive struggle can impair schema formation.¹⁸ The concern also has a long lineage. Bainbridge's "ironies of automation" observed decades ago that automating routine work deskills the operator while leaving them to take over precisely when the system fails — when the most skill is required and the least has been practiced.¹⁹ Outsourcing memory to search engines shifts what we encode from facts to where to find them,²⁰ and habitual reliance on GPS navigation produces dose-dependent decline in hippocampus-dependent spatial memory.²¹ AI is a far more general such tool.

Medicine has begun to see this directly. After routine exposure to AI-assisted colonoscopy, endoscopists' adenoma detection on standard, non-AI colonoscopy fell — deskilling once the tool was removed.²² Experimental work shows AI assistance can accelerate skill decay and hinder skill development without performers noticing.²³ And automation bias — over-trusting automated advice and under-verifying it — is a well-characterized hazard of clinical decision support, worse in less experienced clinicians and in more complex tasks.²⁴,²⁵ But these clinical demonstrations are of *perceptual and procedural* skills; whether the same holds for *cognitive* skill — clinical knowledge and reasoning — is unknown.

Medical education has named the hazard. Abdulnour and colleagues distinguished three risks of clinical AI use: **de-skilling**, the loss of a competence a clinician once had; **never-skilling**, the failure of trainees to develop a competence because AI did the cognitive work at the moment of skill formation; and **mis-skilling**, the adoption of incorrect or biased AI patterns, including those reinforced by model sycophancy.²⁶ These terms are now the field's common vocabulary, but they map awkwardly onto residents, who occupy a muddy middle — licensed physicians still both acquiring and consolidating clinical reasoning. Rather than adjudicate which label applies, we focus on the construct common to all three and the one directly measurable: **knowledge acquisition** — whether working a case with an AI assistant leaves a resident with knowledge they can later deploy unaided. Despite intense interest, the medical-education literature on generative AI remains overwhelmingly descriptive — surveys of attitudes, use cases, and tool accuracy²⁷,²⁸ — and offers essentially no randomized evidence on this outcome for a cognitive task.

A further distinction is essential and, so far, largely unmade. AI can be used to *deliberately* learn — board-review tutors, question banks, and study assistants built to teach. Configured for that purpose, AI can be a powerful tutor: in a randomized trial, a carefully scaffolded AI tutor produced roughly twice the learning gains of expert active-learning instruction,²⁹ and structured LLM exercises have improved medical students' clinical decision-making.³⁰ But the AI use that pervades clinical training is different: it is *incidental*, embedded in the work of caring for patients. A resident pulls up a chatbot mid-rounds to generate a differential, draft a note, or answer a question — the aim is to complete the clinical task, and any learning is a byproduct. Incidental learning during patient care has been the engine of clinical training since Osler; it is also where the offloading risk is greatest, because learning is not the explicit aim, and a fluent answer can remove the effort that would otherwise build skill — unless the trainee brings a learning-oriented posture to the interaction. Evidence about purpose-built AI tutors does not transfer to this setting.

We conducted a randomized trial to test, directly, whether incidental AI use during a clinical case builds or bypasses durable knowledge. Residents worked an unfamiliar case with either an out-of-the-box AI assistant or a standard clinical reference (UpToDate), and we measured the knowledge they retained on an immediately following, resource-free assessment. The design deliberately separates an *assisted-performance* phase (the case, with the resource) from an *unassisted-acquisition* phase (the assessment, without it), isolating knowledge acquisition as the endpoint. We chose Fabry disease — a rare, multisystem condition unlikely to be within residents' existing knowledge — so the assessment would capture knowledge newly acquired during the session rather than prior expertise. As an exploratory aim, and following evidence that *how* one interacts with AI determines whether it builds or erodes skill,⁸ we examined whether more cognitively engaged interaction was associated with greater retained knowledge.

---

## Methods

### Trial design and oversight
Single-center, parallel-group, individually randomized controlled trial with 1:1 allocation. The trial was reviewed by the Stanford University Institutional Review Board (IRB-86737) and determined exempt (benign behavioral intervention / educational testing); all participants reviewed an IRB-approved information sheet and consented before any data were collected. The trial was [pre-registered — registry/ID] before enrollment. Reporting follows CONSORT (Figure 1).

### Setting and participants
Resident physicians (PGY-1 to PGY-3; categorical internal medicine and preliminary medicine) in the Stanford University internal medicine residency, recruited by program-wide email. Participation was voluntary, compensated ($100, prorated for partial completion), and explicitly independent of training, evaluation, or standing. Each resident completed a single ~30–45-minute online session on a laptop or desktop.

### Randomization and allocation concealment
A randomization list was generated in advance using permuted blocks (block size 4) stratified by PGY, giving 1:1 allocation within each stratum from a fixed random seed locked before enrollment. Each resident received a unique enrollment code mapped server-side to a pre-assigned arm; the arm was concealed until the case began. Because the intervention is a visible on-screen resource, participants were necessarily aware of which resource they used, but materials never named or characterized the arms (neutral language), and participants were not told the hypothesis. The primary outcome is objectively, automatically scored, and outcome analysts will be blinded to arm.

### Clinical case
All participants worked an identical fictional vignette: a 32-year-old man referred for progressive chronic kidney disease of unclear etiology, with electrocardiographic left ventricular hypertrophy and a family history suggesting X-linked inheritance — consistent with, but not diagnostic of, Fabry disease. Classic confirmatory features (acroparesthesia, angiokeratomas, cornea verticillata, enzyme/genetic results) were intentionally withheld from the initial vignette so they had to be elicited or sought. Fabry disease was chosen as a rare, multisystem condition outside the expected knowledge base of internal medicine residents, so the post-case assessment would measure knowledge acquired during the session rather than prior expertise.

### Tasks and intervention
Within the case, participants completed five sequential free-response tasks: (1) additional history, (2) physical examination, (3) diagnostic workup, (4) next steps in management (additional work-up findings were revealed at this step), and (5) after-visit patient instructions. Participants were encouraged to use their assigned resource throughout the case, as in clinical care.

- **AI arm:** an embedded, general-purpose chat assistant built on a frontier LLM (Anthropic Claude Opus 4.7), available in a side panel, with a one-click option to insert the case context into the conversation. The model was used **out of the box, with no system prompt or other configuration** — no instructions governing tone, length, tutoring, or learning — so the intervention reflects a generic, off-the-shelf conversational assistant rather than a purpose-built educational tool. No separate login was required; all messages were logged.
- **Control arm:** UpToDate, accessed through the Stanford Lane Library institutional proxy with the participant's university credentials, opened alongside the case.

External resources were prohibited during the subsequent assessment, stated explicitly.

### Outcomes
The **primary outcome** was the score on a 12-item multiple-choice knowledge assessment completed **immediately after the case with no resource available** (range 0–12; one correct option per item; auto-scored). Items were curated to test clinically meaningful, "learned-at-the-bedside" knowledge spanning the case domains without directly restating any task's answer; items and the answer key were fixed before enrollment, and the answer key is never transmitted to the participant's browser. **Secondary outcomes:** (1) change in self-rated comfort caring for such a patient (0–10), measured identically at intake (pre) and at the end of the assessment (post); (2) time on task (per task and total); and (3) AI-arm interaction metrics (number and content of messages). Free-response task answers were retained for exploratory analysis.

### Sample size
With 100 residents (50 per arm), a two-sample comparison of the primary continuous outcome has 80% power at two-sided α = 0.05 to detect a standardized between-arm difference of ≈0.57 SD (Cohen's d) — about [one item / X percentage points] given the instrument's pilot SD. The trial is powered to detect a moderate effect in either direction (benefit or harm). [Finalize the minimum detectable difference in score points from the locked instrument's SD.]

### Statistical analysis
Intention-to-treat. The primary outcome is compared between arms with a linear regression adjusting for the PGY randomization stratum (adjusted difference and 95% CI as the primary estimand); an unadjusted two-sample t-test is a sensitivity analysis. Comfort change is analyzed by ANCOVA (post adjusted for pre); time and interaction metrics by appropriate parametric or rank-based tests. The exploratory interaction-posture analysis relates an engagement classification of AI conversations to the knowledge score. Pre-specified secondary and subgroup (PGY) analyses are interpreted as hypothesis-generating with attention to multiplicity. A two-sided P < 0.05 is significant for the primary outcome; the pre-registered plan governs primary inference. Analysis code will be shared (below).

### Data capture and security
A purpose-built web application recorded responses, timing, and (in the AI arm) full conversation logs to a server-side database, enforcing a single active session per participant. The case is fictional and contains no protected health information; participant-level data were stored securely under institutional standards and analyzed de-identified.

---

## Results

> **[DATA — to be completed.]** Template aligned to the analysis plan.

**Enrollment and participants.** Between [start] and [end] 2026, [N] residents enrolled and were randomized (50 AI, 50 control); [N] completed the session and contributed primary-outcome data (Figure 1). Baseline characteristics — PGY distribution, residency track, pre-test comfort — were balanced across arms (Table 1).

**Primary outcome.** Mean post-case unassisted knowledge score was **[X.X ± SD]/12** (AI) versus **[X.X ± SD]/12** (control); adjusted between-arm difference **[Δ] (95% CI [—]; P = [—])** (Table 2, Figure 2). [State direction and whether the pre-specified threshold was met.]

**Secondary outcomes.** Self-rated comfort changed by **[Δ]** (AI) versus **[Δ]** (control) (between-arm difference [—]; P = [—]); [note any dissociation between comfort gain and knowledge]. Median total time was **[—] min** (AI) versus **[—] min** (control) (P = [—]). In the AI arm, participants sent a median of **[—]** messages (IQR [—]).

**Exploratory.** [Interaction-posture (engaged vs. answer-seeking) vs. knowledge score; PGY subgroup; reasoning quality of free-response answers; correlation of comfort change with knowledge.]

---

## Discussion

[DATA-dependent synthesis.] In this randomized trial, internal medicine residents who worked an unfamiliar clinical case with an out-of-the-box AI assistant scored **[higher / no differently / lower]** on an immediately following, resource-free knowledge assessment than residents who used a standard clinical reference. Because the assessment allowed no resource, this outcome reflects what residents *retained and could apply on their own* — knowledge acquisition — not assisted performance.

These results extend the clinical-AI randomized literature, which has measured how clinicians perform *with* a tool,⁴⁻⁷ to the distinct and, for trainees, more consequential question of how much they *acquire* from using one. [If null/negative:] A finding that AI assistance does not improve — or impairs — subsequent unaided knowledge would align with cross-domain evidence that AI can raise output while leaving learning behind,⁸⁻¹³ with the cognitive-science account that fluent answers remove the retrieval effort that builds memory,¹⁵⁻²¹ and with clinical evidence of AI-associated deskilling and automation bias.²²⁻²⁵ [If positive:] A finding that AI assistance enhances acquisition would suggest that even a generic assistant can support learning in the flow of clinical work — and would direct attention to *how* residents use it.⁸

Framed against the de-skilling/never-skilling/mis-skilling taxonomy,²⁶ this trial supplies direct, randomized evidence on a concern that, for cognitive medical tasks, has been argued largely from theory and from analogy to perceptual domains. Because residents sit between acquiring and maintaining clinical reasoning, we framed the endpoint as knowledge acquisition in the **incidental** setting that dominates real practice — working a case with AI as one would in caring for a patient. [DATA: a null or negative difference would be, to our knowledge, the first randomized signal that AI assistance can bypass durable knowledge formation for a cognitive clinical task; a benefit would argue toward AI as a learning aid even when learning is incidental.] The item-level and free-response data additionally let us probe **mis-skilling** — whether AI-arm errors concentrate where a fluent but incomplete assistant is most likely to mislead — and whether any rise in self-rated comfort outpaces actual knowledge, the confidence–competence gap that makes these risks hard to detect at the bedside.¹⁰

Two implications follow. First, **the endpoint matters**: optimizing AI tools and curricula for assisted performance — the outcome most studies and product evaluations report — may select for designs that quietly substitute for, rather than build, the competence residency exists to develop; trainee-facing AI should be evaluated, and possibly engineered, against learning and retention, not just task completion. Second, **AI tools are not interchangeable on this dimension.** We tested a generic, default-configured assistant; a purpose-built tutor, by contrast, can double learning gains.²⁹ Whether a tool built or prompted to reason *with* the resident rather than *for* them — a dedicated medical evidence assistant, or a deliberately Socratic configuration — would change what residents retain is unknown; the same paradigm could compare such tools head to head, and the present result establishes the default-chatbot baseline against which any learning-oriented design would have to prove itself. Finally, consistent with evidence that interaction *posture* governs whether AI builds or erodes skill,⁸,¹² our exploratory analysis [supports/does not support] the hypothesis that *how* residents use AI, more than whether they use it, determines what they learn. If posture proves both consequential and modifiable, the operative educational question shifts from whether residents use AI to whether they can be taught to use it in skill-preserving ways.

### Limitations
This was a single-center trial in one residency program; multi-site replication would strengthen external validity. The case was fictional and the outcome a knowledge assessment administered immediately after the session — a proximal measure that may not capture long-term retention, transfer to new cases, or bedside performance; a delayed reassessment would test durability. Participants could not be blinded to their assigned resource, though they were blinded to arm labels and the hypothesis. The intervention was one model in one default configuration and the comparator one reference resource; results may differ with other tools, configurations, or prompting support. Because the case turns on a disease outside residents' prior knowledge, the trial indexes the cognitive-offloading *mechanism* shared by de- and never-skilling — whether case work with AI yields independently-retained knowledge — rather than erosion of a pre-existing, familiar skill; complementary designs (in medical students; with familiar content; with repeated, longitudinal exposure) would localize where on the training continuum, and over what time course, the effect is largest. Finally, the trial measures a single exposure; cumulative effects of habitual AI use during training remain to be studied.

### Conclusions
[DATA-dependent.] Among internal medicine residents working an unfamiliar clinical case, access to an out-of-the-box AI assistant **[did/did not]** change the knowledge they could subsequently apply without assistance, relative to a standard clinical reference. Concern about AI-induced de-skilling, never-skilling, and mis-skilling has outrun the evidence for cognitive tasks in medicine; this trial provides a direct, randomized test of whether incidental AI use during patient care builds or bypasses durable knowledge. As generative AI becomes ubiquitous in clinical training, randomized evidence on what trainees *acquire* — not only on how they perform with a tool in hand — should govern how AI is introduced into graduate medical education.

---

## Declarations

**Funding.** [Source; participant payments disbursed through the Stanford Department of Medicine.]
**Trial registration.** [Registry and ID; registered before enrollment.]
**Ethics.** Stanford IRB-86737 (exempt); informed consent obtained from all participants.
**Data and code availability.** The clinical case, the 12-item instrument and answer key, the randomization procedure, and the analysis code will be made available [repository/terms]; participant-level data [terms].
**Author contributions.** [CRediT taxonomy; designate equal-contribution authors per NEJM AI policy.]
**Conflicts of interest.** [Disclose any relationship with AI vendors; the intervention used a commercial frontier model.]
**Generative AI disclosure.** The AI assistant is the trial intervention and is described in Methods; [disclose any use of generative AI in manuscript preparation per NEJM AI policy].

---

## Tables and Figures (shells)

**Figure 1.** CONSORT participant flow (assessed → randomized → allocated → completed → analyzed), by arm. *(Drafted: `figures/consort-flow.svg`.)*
**Figure 2.** Distribution of post-case knowledge scores by arm (box/violin with points; mean and 95% CI).
**Table 1.** Baseline characteristics by arm (N; PGY-1/2/3; track; pre-test comfort).
**Table 2.** Outcomes by arm (primary knowledge score with adjusted difference, 95% CI, P; comfort change; total time; AI-interaction metrics).
*(Optional Figure 3: knowledge score vs. AI-interaction engagement metric.)*

---

## References

> *Verify author lists, volumes, and pages against primary sources before submission — especially 2024–2026 items assembled by literature search (flagged ⚠). Decide which preprints to cite as such vs. await final publication. Full annotations: `Literature-Review-Annotated`.*

1. [Representative survey of trainee generative-AI uptake, e.g., BMC Med Educ. 2025; multicenter surveys 2024–2025]. ⚠ select and verify.
2. Kanjee Z, Crowe B, Rodman A. Accuracy of a generative artificial intelligence model in a complex diagnostic challenge. *JAMA.* 2023;330(1):78–80.
3. Strong E, DiGiammarino A, Weng Y, et al. Chatbot vs medical student performance on free-response clinical reasoning examinations. *JAMA Intern Med.* 2023;183(9):1028–1030.
4. Goh E, Gallo R, Hom J, et al. Large language model influence on diagnostic reasoning: a randomized clinical trial. *JAMA Netw Open.* 2024;7(10):e2440969.
5. Goh E, Gallo R, Strong E, et al. Large language model influence on management reasoning: a randomized controlled trial. *medRxiv* 2024.08.05.24311485. ⚠ verify final venue.
6. GPT-4 assistance for improvement of physician performance on patient-care tasks: a randomized controlled trial. *Nat Med.* 2025. doi:10.1038/s41591-024-03456-y. ⚠ verify.
7. Large language model diagnostic assistance for physicians in a lower-middle-income country: a randomized controlled trial. *Nat Health.* 2025. doi:10.1038/s44360-025-00007-8. ⚠ verify.
8. Shen JH, Tamkin A. How AI impacts skill formation. *arXiv:2601.20245* (2026).
9. Fan Y, et al. Beware of metacognitive laziness: effects of generative AI on learning motivation, processes, and performance. *Br J Educ Technol.* 2025 (arXiv:2412.09315). ⚠ verify.
10. Lee H-P, et al. The impact of generative AI on critical thinking: self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers. *Proc. CHI 2025.* doi:10.1145/3706598.3713778.
11. Kosmyna N, et al. Your brain on ChatGPT: accumulation of cognitive debt when using an AI assistant for essay-writing tasks. *arXiv:2506.08872* (2025). ⚠ preprint.
12. [The widening gap: the benefits and harms of generative AI for novice programmers.] *arXiv:2405.17739* (2024). ⚠ verify authors/venue.
13. [Distinguishing performance gains from learning when using generative AI.] *arXiv:2605.13731* (2026). ⚠ verify.
14. Gerlich M. AI tools in society: impacts on cognitive offloading and the future of critical thinking. *Societies.* 2025. ⚠ verify.
15. Roediger HL III, Karpicke JD. The power of testing memory: basic research and implications for educational practice. *Perspect Psychol Sci.* 2006;1(3):181–210.
16. Bjork RA. Memory and metamemory considerations in the training of human beings. In: Metcalfe J, Shimamura AP, eds. *Metacognition: Knowing about Knowing.* MIT Press; 1994:185–205.
17. Slamecka NJ, Graf P. The generation effect: delineation of a phenomenon. *J Exp Psychol Hum Learn Mem.* 1978;4(6):592–604.
18. Sweller J. Cognitive load during problem solving: effects on learning. *Cogn Sci.* 1988;12(2):257–285.
19. Bainbridge L. Ironies of automation. *Automatica.* 1983;19(6):775–779.
20. Sparrow B, Liu J, Wegner DM. Google effects on memory: cognitive consequences of having information at our fingertips. *Science.* 2011;333:776–778.
21. Dahmani L, Bohbot VD. Habitual use of GPS negatively impacts spatial memory during self-guided navigation. *Sci Rep.* 2020;10:6310.
22. Budzyń K, Romańczyk M, et al. Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational, before-and-after study. *Lancet Gastroenterol Hepatol.* 2025;10(10):896–903. ⚠ verify author list.
23. Macnamara BN, Berber I, Çavuşoğlu MC, et al. Does using artificial intelligence assistance accelerate skill decay and hinder skill development without performers' awareness? *Cogn Res Princ Implic.* 2024;9:46.
24. Goddard K, Roudsari A, Wyatt JC. Automation bias: a systematic review of frequency, effect mediators, and mitigators. *J Am Med Inform Assoc.* 2012;19(1):121–127.
25. Lyell D, Coiera E. Automation bias and verification complexity: a systematic review. *J Am Med Inform Assoc.* 2017;24(2):423–431. ⚠ verify.
26. Abdulnour R-EE, Gin B, Boscardin CK. Educational strategies for clinical supervision of artificial intelligence use. *N Engl J Med.* 2025;393:786–797.
27. [Artificial intelligence in undergraduate medical education: an updated scoping review.] *BMC Med Educ.* 2025. ⚠ verify.
28. [Modern AI and large language models in graduate medical education: a scoping review of attitudes, applications & practice.] 2025 (PMID 40394586). ⚠ verify.
29. Kestin G, Miller K, Klales A, Milbourne T, Ponti G. AI tutoring outperforms in-class active learning: a randomized controlled trial. *Sci Rep.* 2025. ⚠ verify.
30. [Large language models improve clinical decision making of medical students through patient simulation and structured feedback: a randomized controlled trial.] 2024. ⚠ verify.
