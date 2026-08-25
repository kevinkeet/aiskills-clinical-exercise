# Learning or Only Performing? A Randomized Trial of an AI Assistant's Effect on Knowledge Acquisition in Internal Medicine Residents

**Target journal:** *NEJM AI* (Original Article)

**Authors:** Kevin Keet, MD¹\*; [Co-authors]¹; [Senior author]¹
*(Author order and equal-contribution designation to be finalized per NEJM AI policy; one corresponding author.)*

¹ Department of Medicine, Stanford University School of Medicine, Stanford, CA. \*kkeet@stanford.edu

**Trial registration:** Preregistered on the Open Science Framework before enrollment (registration frozen and embargoed; ID to be released at publication). ClinicalTrials.gov registration in process.

> **Drafting note.** Pre-results draft, kept compact to leave room for the Results and Discussion. Methods reflect the study as built. Results are templated and marked [DATA]. References were assembled by literature search; the 2024 to 2026 items should be verified before submission. Fuller bibliography: `Literature-Review-Annotated`.

---

## Abstract

**Background.** Large language model (LLM) assistants are now common in clinical training, and randomized trials show they can change clinicians' reasoning in the moment. Those trials measure assisted performance, meaning how well a clinician does while using the tool. For a trainee the relevant outcome is different: whether working a case with AI builds knowledge that can later be used without it. Evidence from other fields shows that AI can raise the quality of work while leaving the underlying learning unchanged or worse. Educators have named the risks as de-skilling, never-skilling, and mis-skilling, but for cognitive tasks in medicine these risks have not been tested in a randomized trial.

**Methods.** In a single-center, parallel-group, 1:1 randomized trial at the Stanford internal medicine residency, residents worked an unfamiliar clinical case (suspected Fabry disease) through five free-response tasks, randomized to one of two resources available during the case: an embedded, out-of-the-box AI chat assistant or UpToDate. Immediately afterward, with no resource available, they completed a 12-item knowledge assessment, which was the primary outcome. Randomization used PGY-stratified permuted blocks with server-side allocation concealment. The trial was preregistered with a pre-specified analysis plan, and outcome scoring was automated and blinded. Secondary outcomes were change in self-rated comfort (0 to 10, before and after) and time on task. In a pre-specified exploratory analysis, AI-arm conversation logs were qualitatively coded for interaction patterns and related to the knowledge score.

**Results.** [DATA] Of 100 residents randomized (50 AI, 50 control), [N] completed the session. The mean post-case knowledge score was [X.X] of 12 in the AI arm and [X.X] of 12 in the control arm (adjusted difference [Δ]; 95% CI [__]; P = [__]).

**Conclusions.** [DATA-dependent.] Access to an out-of-the-box AI assistant during an unfamiliar case [did or did not] change the knowledge residents could subsequently apply unaided. The trial provides direct randomized evidence on whether incidental AI use during patient care builds or bypasses the knowledge trainees can deploy on their own.

---

## Introduction

Generative artificial intelligence has entered clinical training faster than the evidence needed to guide it, and most trainees already use tools such as ChatGPT to study and to work.¹ The tools are capable. A large language model (LLM) has matched or exceeded physicians on free-response clinical-reasoning examinations,² and randomized trials of LLM assistance are accumulating. Those trials measure assisted performance, meaning how well the clinician does while using the tool, and the results are mixed.³,⁴ For a learner that is not the question that matters. The purpose of residency is to build knowledge and reasoning a physician can use unaided, and increasingly to supervise AI. Performance with a tool and the formation of skill can come apart. In randomized experiments, workers who used AI to learn an unfamiliar task gained less understanding than those who did not, and the outcome depended on the way they engaged the tool.⁵

Outside medicine, AI assistance can raise output while leaving learning behind. Students who wrote with generative AI produced better work but gained no measurable knowledge when tested later without it, a pattern the authors called metacognitive laziness.⁶ In a survey of knowledge workers, greater confidence in AI was associated with less critical thinking and less cognitive effort.⁷ In a preliminary electroencephalographic study, essay writers using an LLM showed the weakest neural engagement and the least ownership of their own essays.⁸ Among novices the benefit was uneven, since those with strong metacognitive skills gained while weaker ones were harmed.⁹ The mechanism is well grounded. Durable learning depends on effortful retrieval and on desirable difficulties, which is precisely the effort a fluent answer removes.¹⁰,¹¹ The problem is also long-standing. Bainbridge's ironies of automation noted that automation deskills operators while leaving them to take over at exactly the moment the most skill is required,¹² and habitual reliance on tools as ordinary as GPS produces a dose-dependent decline in the underlying cognitive skill.¹³

Medicine has begun to see this directly. After routine use of AI-assisted colonoscopy, endoscopists' unassisted detection skill fell,¹⁴ and automation bias, meaning over-trust and under-verification of machine advice, is a known hazard that is worse in less experienced clinicians.¹⁵ These demonstrations concern perceptual and procedural skill. Educators have named the analogous cognitive risks as de-skilling, never-skilling, and mis-skilling,¹⁶,¹⁷ and the concern has reached internal medicine's flagship journals,¹⁸ but for cognitive tasks it still rests on theory: the randomized evidence in medical education has tested AI as a deliberate teaching tool, not as an aid used incidentally during clinical work.¹⁹ Residents sit between these categories, since they are physicians who are still both acquiring and consolidating clinical reasoning. Rather than decide which label applies, we measured the construct common to all three: knowledge acquisition, meaning whether working a case with AI leaves a resident with knowledge that can later be used unaided.

One distinction is decisive and has largely gone unmade. AI can be used to study deliberately: a purpose-built, scaffolded tutor has doubled learning gains in a randomized trial,²⁰ and across twenty randomized trials, generative-AI teaching interventions improved short-term knowledge and skills.¹⁹ But the AI use now common in clinical training is incidental and embedded in patient care. A resident asks a chatbot for a differential or a draft note in order to finish the task, and any learning is a byproduct. Incidental learning has been the engine of clinical training since Osler, and it is also where the risk of offloading is greatest, because learning is not the aim unless the trainee brings a learning-oriented posture to the interaction. Evidence about purpose-built tutors does not transfer to this setting.

We therefore conducted a randomized trial to test whether incidental AI use during a clinical case builds or bypasses the knowledge a resident can independently deploy. Residents worked an unfamiliar case, chosen to lie outside their existing knowledge, with either an out-of-the-box AI assistant or a standard reference, and we measured what they retained on an immediately following assessment taken without any resource. The design separates a phase of assisted performance from a phase of unassisted acquisition. As an exploratory aim, we tested whether more cognitively engaged interaction predicted greater retained knowledge.⁵

---

## Methods

### Design and oversight

This was a single-center, parallel-group, individually randomized trial with 1:1 allocation, reviewed by the Stanford University IRB (IRB-86737; exempt). All participants reviewed an IRB-approved information sheet and consented before any data were collected. The trial was preregistered on the Open Science Framework before enrollment, with a statistical analysis plan fixed prior to data collection. Reporting follows CONSORT (Figure 1).

### Participants and randomization

Participants were resident physicians (PGY-1 to PGY-3; categorical and preliminary internal medicine) in the Stanford internal medicine residency, recruited by program-wide email. Participation was voluntary, compensated ($100, prorated), and independent of training or evaluation. A randomization list (permuted blocks of 4, stratified by PGY, from a fixed seed) assigned participants 1:1 within each stratum. Each resident's enrollment code mapped server-side to a concealed arm, revealed only at the start of the case. Study materials never named the arms, and participants were not told the hypothesis. The primary outcome is objectively scored, and analysts are blinded to arm.

### Case and intervention

All participants worked an identical fictional vignette describing a 32-year-old man with progressive chronic kidney disease, electrocardiographic left ventricular hypertrophy, and a family history consistent with X-linked inheritance, a presentation compatible with but not diagnostic of Fabry disease. Classic confirmatory features were withheld so that they had to be elicited. Fabry disease was chosen as a rare, multisystem condition outside residents' expected knowledge, so that the assessment would capture newly acquired knowledge. Participants completed five sequential free-response tasks (history, examination, workup, management, and after-visit instructions), with additional workup findings revealed at the management task. Participants were encouraged to use their assigned resource throughout the case.

The AI arm received an embedded chat assistant built on a frontier LLM (Anthropic Claude Opus 4.7), used out of the box with no system prompt or other configuration, so that the intervention reflects a generic, off-the-shelf assistant rather than an educational tool. A one-click button inserted the case context into the conversation, and all messages were logged. The control arm received UpToDate through the Stanford Lane Library institutional proxy. No resource was permitted during the subsequent assessment.

### Outcomes and analysis

The primary outcome is the score (0 to 12) on a 12-item multiple-choice assessment completed immediately after the case with no resource available. Items test clinically meaningful knowledge across the case domains without restating the answer to any task, were fixed before enrollment, and the answer key is never transmitted to the participant's browser. The instrument was developed and pilot-tested before the trial, with items refined for difficulty and discrimination, and its internal-consistency reliability will be reported. Secondary outcomes are the change in self-rated comfort (0 to 10, identical item before and after), time on task, and AI-interaction metrics (message count and the qualitative interaction-pattern analysis described below).

With 50 participants per arm, the trial has 80% power (two-sided α = 0.05) to detect a between-arm difference of approximately 0.57 SD, corresponding to roughly [1.5 to 2] points on the 12-point scale, to be finalized from the observed SD. The trial is powered for a moderate effect and may miss smaller differences. Analysis is by intention to treat. The primary outcome is compared by linear regression adjusting for the PGY stratum (adjusted difference with 95% CI), comfort by ANCOVA, and secondary and subgroup analyses are exploratory. Because the primary comparison is two-sided superiority, a non-significant result will be interpreted from the point estimate and its confidence interval, which bound the plausible effect, rather than as proof of no effect. The preregistered plan governs primary inference. A purpose-built application recorded responses, timing, and full AI conversations to a secure server-side database. The case is fictional and contains no protected health information.

### Interaction-pattern analysis (pre-specified, exploratory)

Because the application logs every AI-arm conversation in full, we will examine the way residents engaged the assistant, not merely how much, and whether interaction style relates to learning. Two trained coders, blinded to knowledge scores, will independently code each AI-arm conversation by directed content analysis against an a priori framework adapted from work on AI interaction patterns and skill formation.⁵ The framework distinguishes cognitively engaged patterns, such as asking conceptual questions, treating outputs as hypotheses to verify, and requesting reasoning in order to probe its weakest link, from offloading patterns, such as requesting answers to transcribe, delegating the reasoning, and accepting outputs without scrutiny. The scheme will be refined inductively for clinical content, inter-rater reliability will be reported (Cohen's κ), and disagreements will be resolved by consensus. Each participant receives a dominant-pattern classification and a continuous engagement score, which we relate to the post-case knowledge score by linear regression adjusting for PGY stratum and message count. Because interaction style is self-selected rather than randomized, this analysis is correlational and hypothesis-generating.

---

## Results

> **[DATA to be completed]** (templated to the analysis plan).

Of [N] residents randomized (50 AI, 50 control), [N] completed the session and contributed primary-outcome data (Figure 1). Baseline characteristics were balanced between arms (Table 1). The mean post-case unassisted knowledge score was [X.X ± SD] of 12 in the AI arm and [X.X ± SD] of 12 in the control arm (adjusted difference [Δ]; 95% CI [__]; P = [__]) (Table 2, Figure 2). Comfort changed by [Δ] in the AI arm and [Δ] in the control arm (P = [__]). Median total time was [__] minutes in the AI arm and [__] minutes in the control arm. Residents in the AI arm sent a median of [__] messages. In the exploratory interaction-pattern analysis (inter-rater κ = [__]), residents whose conversations were coded as predominantly engaged scored [X.X] of 12, compared with [X.X] of 12 among residents whose conversations were predominantly offloading (adjusted difference [Δ]; P = [__]) (Figure 3). [Also to report: PGY subgroup; the relationship between comfort change and knowledge.]

---

## Discussion

[DATA-dependent.] Residents who worked an unfamiliar case with an out-of-the-box AI assistant scored [higher than, no differently from, or lower than] residents who used a standard reference on an assessment taken immediately afterward without any resource. Because no resource was allowed, this score reflects knowledge that residents retained and could apply on their own rather than assisted performance. The finding extends the randomized clinical-AI literature, which measures performance with a tool in hand,³,⁴ to the question that matters for trainees.

Set against the taxonomy of de-skilling, never-skilling, and mis-skilling,¹⁶,¹⁷ the trial provides direct evidence on a problem that, for cognitive medical tasks, has until now been argued from theory and from analogy to perceptual domains.¹⁴ [A null or negative difference would be the first randomized signal that AI assistance can bypass knowledge acquisition for a cognitive clinical task, leaving residents no better able to reason unaided. A benefit would argue toward AI as a learning aid even when learning is incidental.] The item-level data also allow us to examine mis-skilling and the gap between confidence and competence, that is, whether any rise in self-rated comfort outpaces actual knowledge.⁷

Two implications follow regardless of the direction of the result. The first concerns the choice of endpoint. Tools and curricula optimized for assisted performance may quietly substitute for the competence that residency exists to build, so trainee-facing AI should be evaluated against learning rather than task completion. The second is that AI tools are not interchangeable on this dimension. We tested a generic assistant, whereas a purpose-built tutor can improve learning,²⁰ and the present result establishes the baseline for a default chatbot against which any learning-oriented design should be judged. The direction of the effect may also depend on the domain and the task: in a randomized trial of junior ophthalmologists learning to build a machine-learning project, assistance from a large language model increased both assisted and subsequent unassisted completion, scaffolding rather than supplanting independent capability.²¹ Consistent with evidence that the manner of engagement determines whether AI builds or erodes skill,⁵,⁹ our coding of residents' conversations [supports or does not support] interaction posture as the operative variable. In non-medical skill formation, engaged and offloading styles differed several-fold on post-task learning.⁵ If posture proves both consequential and modifiable, the question becomes whether residents can be taught to use AI in ways that preserve their own learning.

### Limitations

This was a single-center trial in one residency program, and multi-site replication would strengthen generalizability. The outcome is a knowledge assessment given immediately after a single fictional case. This is a proximal measure that may not capture long-term retention, transfer to new cases, or bedside performance, and delayed or longitudinal designs would be needed to test durability and cumulative effects. Participants could not be blinded to the resource they used, although they were blinded to the arm labels and to the hypothesis. The intervention was one model in one default configuration tested against a single comparator, and results may differ with other tools or configurations. Because the case lies outside residents' prior knowledge, the trial indexes the acquisition mechanism shared by de-skilling and never-skilling rather than the erosion of a familiar skill. Complementary designs in medical students, and with familiar clinical content, would help localize the effect along the training continuum.

### Conclusions

[DATA-dependent.] Among internal medicine residents working an unfamiliar case, access to an out-of-the-box AI assistant [did or did not] change the knowledge they could subsequently apply without assistance. As generative AI becomes common in training, decisions about how it is introduced into graduate medical education should rest on randomized evidence about what trainees acquire, rather than on how they perform with a tool in hand.

---

## Declarations

**Funding:** [source]. **Registration:** Preregistered on the Open Science Framework before enrollment (embargoed; registration ID released at publication); ClinicalTrials.gov [ID pending]. **Ethics:** Stanford IRB-86737 (exempt); informed consent obtained from all participants. **Data and code:** the clinical case, the 12-item instrument and answer key, the randomization procedure, and the analysis code will be shared [terms]. **Author contributions:** [CRediT]. **Conflicts of interest:** [disclose any relationship with AI vendors]. **Generative-AI disclosure:** the AI assistant is the trial intervention and is described in Methods; [disclose any use in manuscript preparation per NEJM AI policy].

## Figures and tables

**Figure 1.** CONSORT participant flow by arm (`figures/consort-flow.svg`). **Figure 2.** Distribution of knowledge scores by arm. **Figure 3.** Knowledge score by AI-interaction pattern (engaged versus offloading), AI arm only. **Table 1.** Baseline characteristics by arm. **Table 2.** Outcomes by arm, including the primary score with adjusted difference, confidence interval, and P value; comfort change; time on task; and AI-interaction metrics.

---

## References

> *Verify the 2024 to 2026 items and resolve preprint versus published status before submission.*

1. [Representative survey of trainee generative-AI uptake, 2024 to 2025.] Select and verify.
2. Strong E, DiGiammarino A, Weng Y, et al. Chatbot vs medical student performance on free-response clinical reasoning examinations. *JAMA Intern Med.* 2023;183(9):1028–1030.
3. Goh E, Gallo R, Hom J, et al. Large language model influence on diagnostic reasoning: a randomized clinical trial. *JAMA Netw Open.* 2024;7(10):e2440969.
4. [Generative AI-enabled clinical decision support in primary care: a pragmatic, cluster-randomized trial.] *Nat Med.* 2026. doi:10.1038/s41591-026-04503-6. Verify authors.
5. Shen JH, Tamkin A. How AI impacts skill formation. *arXiv:2601.20245* (2026).
6. Fan Y, et al. Beware of metacognitive laziness: effects of generative artificial intelligence on learning motivation, processes, and performance. *Br J Educ Technol.* 2025 (arXiv:2412.09315). Verify.
7. Lee H-P, et al. The impact of generative AI on critical thinking: self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers. *Proc. CHI 2025.* doi:10.1145/3706598.3713778.
8. Kosmyna N, et al. Your brain on ChatGPT: accumulation of cognitive debt when using an AI assistant for essay-writing tasks. *arXiv:2506.08872* (2025). Preprint; a methodological critique has been published (arXiv:2601.00856), so the citation is framed as preliminary.
9. [The widening gap: the benefits and harms of generative AI for novice programmers.] *arXiv:2405.17739* (2024). Verify authors and venue.
10. Roediger HL III, Karpicke JD. The power of testing memory: basic research and implications for educational practice. *Perspect Psychol Sci.* 2006;1(3):181–210.
11. Bjork RA. Memory and metamemory considerations in the training of human beings. In: Metcalfe J, Shimamura AP, eds. *Metacognition.* MIT Press; 1994:185–205.
12. Bainbridge L. Ironies of automation. *Automatica.* 1983;19(6):775–779.
13. Dahmani L, Bohbot VD. Habitual use of GPS negatively impacts spatial memory during self-guided navigation. *Sci Rep.* 2020;10:6310.
14. Budzyń K, Romańczyk M, et al. Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational, before-and-after study. *Lancet Gastroenterol Hepatol.* 2025;10(10):896–903. Verify author list.
15. Goddard K, Roudsari A, Wyatt JC. Automation bias: a systematic review of frequency, effect mediators, and mitigators. *J Am Med Inform Assoc.* 2012;19(1):121–127.
16. Abdulnour R-EE, Gin B, Boscardin CK. Educational strategies for clinical supervision of artificial intelligence use. *N Engl J Med.* 2025;393:786–797.
17. Ke Y, et al. AI-induced never-skilling in medical education. *Nat Med.* 2026;32(6):1997–2006. Verify author list.
18. [The deskilling effect: is artificial intelligence eroding clinical competence?] *Ann Intern Med.* 2026. doi:10.7326/ANNALS-26-00613. Verify authors and article type.
19. [The impact of integrating generative artificial intelligence into medical education on short-term learning outcomes: a systematic review and meta-analysis of randomized controlled trials.] 2026 (PMC13274167). Verify citation.
20. Kestin G, Miller K, Klales A, Milbourne T, Ponti G. AI tutoring outperforms in-class active learning: a randomized controlled trial. *Sci Rep.* 2025. Verify.
21. [The effectiveness of large language models in medical AI research for physicians: a randomized controlled trial.] *Cell Rep Med.* 2025 (PMC12765838). Verify citation.
