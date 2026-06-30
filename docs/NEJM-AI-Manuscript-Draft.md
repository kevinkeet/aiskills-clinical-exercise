# Does an AI Assistant Help Internal Medicine Residents Learn, or Only Perform? A Randomized Trial

**Target journal:** *NEJM AI* (Original Article)

**Authors:** Kevin Keet, MD¹\*; [Co-authors]¹; [Senior author]¹
*(Author order / equal-contribution to be finalized per NEJM AI policy; one corresponding author.)*

¹ Department of Medicine, Stanford University School of Medicine, Stanford, CA · \*kkeet@stanford.edu

**Trial registration:** [register on OSF before first enrollment]

> **Drafting note.** Lean pre-results draft (intentionally compact to leave room for a data-rich Results and Discussion). Methods reflect the study as built; **Results are templated and marked [DATA]**. References were assembled by literature search; **verify the 2024–2026 items before submission** (flagged ⚠). Fuller bibliography: `Literature-Review-Annotated`.

---

## Abstract

**Background.** Large language model (LLM) assistants pervade clinical training, and randomized trials show they can change clinicians' real-time reasoning. But those trials measure *assisted performance* — how well a clinician does while holding the tool. For trainees the outcome that matters is different: whether working a case *with* AI builds knowledge they can later deploy *without* it. Evidence from other fields shows AI can raise output while leaving — or eroding — the underlying learning; educators have named the risks (de-skilling, never-skilling, mis-skilling), but for cognitive tasks in medicine the concern is untested by randomized trial.

**Methods.** In a single-center, parallel-group, 1:1 randomized trial at the Stanford internal medicine residency, residents worked an unfamiliar clinical case (suspected Fabry disease) through five free-response tasks, randomized to one of two resources available *during* the case: an embedded, out-of-the-box AI chat assistant or UpToDate. Immediately afterward, with **no resource available**, they completed a 12-item knowledge assessment (the primary outcome). Randomization used PGY-stratified permuted blocks with server-side allocation concealment. Secondary outcomes were change in self-rated comfort (0–10, pre vs. post), time on task, and AI-interaction metrics.

**Results.** [DATA] Of 100 residents randomized (50 AI, 50 control), [N] completed the session. Mean post-case knowledge score was [X.X/12] (AI) vs. [X.X/12] (control); adjusted difference [Δ] (95% CI [—]; P = [—]).

**Conclusions.** [DATA-dependent.] Access to an out-of-the-box AI assistant during an unfamiliar case [did/did not] change the knowledge residents could subsequently apply unaided. The trial gives direct randomized evidence on whether incidental AI use during patient care builds or bypasses durable clinical knowledge.

---

## Introduction

Generative artificial intelligence has entered clinical training faster than the evidence needed to guide it; most trainees already use tools such as ChatGPT to study and to work.¹ The tools are capable — a large language model (LLM) has matched or exceeded physicians on free-response clinical-reasoning examinations² — and randomized trials of LLM *assistance* are accumulating. But those trials measure **assisted performance**: how well the clinician does while holding the tool, with results that are mixed and, for a learner, beside the point.³ The purpose of residency is to build durable, transferable knowledge and reasoning a physician can deploy unaided — and increasingly can use to supervise AI. Performance with a tool and the *formation of skill* are dissociable: in randomized experiments, workers who used AI to learn an unfamiliar task gained less understanding than those who did not, and which outcome occurred depended on *how* they engaged the tool.⁴

Outside medicine, AI assistance can raise output while leaving learning behind. Students who wrote with generative AI produced better work but gained no measurable knowledge when later tested unaided ("metacognitive laziness");⁵ a survey of knowledge workers linked greater confidence in AI to less critical thinking and less cognitive effort;⁶ and essay-writers using an LLM showed the weakest neural engagement, the least ownership of their work, and reduced engagement that persisted after the AI was withdrawn.⁷ Among novices, the benefit was uneven — those with strong metacognitive skills gained, weaker ones were harmed.⁸ The mechanism is well grounded: durable learning depends on effortful retrieval and "desirable difficulties," the very effort a fluent answer removes.⁹,¹⁰ The concern is also old — Bainbridge's "ironies of automation" noted that automation deskills the operator while leaving them to take over precisely when the most skill is needed,¹¹ and habitual reliance on tools as ordinary as GPS produces dose-dependent decline in the underlying cognitive skill.¹²

Medicine has begun to see this directly: after routine AI-assisted colonoscopy, endoscopists' unassisted detection skill fell,¹³ and automation bias — over-trusting and under-verifying machine advice — is a known hazard, worse in less experienced clinicians.¹⁴ But these demonstrations are of *perceptual and procedural* skill. Educators have named the analogous cognitive risks — **de-skilling**, **never-skilling**, and **mis-skilling**¹⁵ — yet for cognitive tasks the concern rests on theory, and the medical-education literature on generative AI is overwhelmingly descriptive.¹⁶ Residents occupy a muddy middle — physicians still both acquiring and consolidating reasoning — so rather than adjudicate which label applies, we focus on the construct common to all three and directly measurable: **knowledge acquisition**, whether working a case with AI leaves a resident with knowledge they can later deploy unaided.

One distinction is decisive and largely unmade. AI can be used to *deliberately* learn — a purpose-built, scaffolded tutor has doubled learning gains in a randomized trial.¹⁷ But the AI use that pervades clinical training is *incidental*, embedded in caring for patients: a resident asks a chatbot for a differential or a draft note to complete the task, and any learning is a byproduct. Incidental learning has been the engine of clinical training since Osler; it is also where the offloading risk is greatest, because learning is not the aim — unless the trainee brings a learning-oriented posture to the interaction. Evidence about purpose-built tutors does not transfer to this setting. We conducted a randomized trial to test, directly, whether incidental AI use during a clinical case builds or bypasses durable knowledge: residents worked an unfamiliar case (chosen to lie outside their existing knowledge) with an out-of-the-box AI assistant or a standard reference, and we measured what they retained on an immediately following, resource-free assessment — separating an *assisted-performance* phase from an *unassisted-acquisition* phase. As an exploratory aim, we examined whether more cognitively engaged interaction predicted greater retained knowledge.⁴

---

## Methods

### Design and oversight
Single-center, parallel-group, individually randomized trial with 1:1 allocation, reviewed by the Stanford University IRB (IRB-86737; exempt). All participants reviewed an IRB-approved information sheet and consented before any data were collected. The trial was [pre-registered] before enrollment; reporting follows CONSORT (Figure 1).

### Participants and randomization
Resident physicians (PGY-1–3; categorical and preliminary internal medicine) in the Stanford internal medicine residency, recruited by program-wide email; participation was voluntary, compensated ($100, prorated), and independent of training or evaluation. A randomization list (permuted blocks of 4, stratified by PGY, fixed seed) assigned 1:1 within each stratum; each resident's enrollment code mapped server-side to a concealed arm, revealed only at the start of the case. Materials never named the arms, and participants were not told the hypothesis; the primary outcome is objectively scored and analysts are blinded to arm.

### Case and intervention
All participants worked an identical fictional vignette — a 32-year-old man with progressive chronic kidney disease, electrocardiographic left ventricular hypertrophy, and an X-linked family history, consistent with but not diagnostic of Fabry disease; classic confirmatory features were withheld so they had to be elicited. Fabry disease was chosen as a rare, multisystem condition outside residents' expected knowledge, so the assessment would capture newly acquired knowledge. Participants completed five sequential free-response tasks (history, examination, workup, management [additional findings revealed here], after-visit instructions), encouraged to use their assigned resource throughout:

- **AI arm:** an embedded chat assistant built on a frontier LLM (Anthropic Claude Opus 4.7), used **out of the box, with no system prompt or configuration**, so the intervention reflects a generic, off-the-shelf assistant rather than an educational tool; a one-click button inserted the case context; all messages were logged.
- **Control arm:** UpToDate via the Stanford Lane Library institutional proxy.

No resource was permitted during the subsequent assessment.

### Outcomes and analysis
The **primary outcome** is the score (0–12) on a 12-item multiple-choice assessment completed immediately after the case **with no resource available**; items test clinically meaningful knowledge across the case domains without restating any task's answer, were fixed before enrollment, and the answer key is never sent to the participant's browser. **Secondary outcomes:** change in self-rated comfort (0–10, identical pre/post item), time on task, and AI-interaction metrics. With 50 per arm, the trial has 80% power (two-sided α = 0.05) to detect a between-arm difference of ≈0.57 SD. Analysis is intention-to-treat: the primary outcome is compared by linear regression adjusting for PGY stratum (adjusted difference, 95% CI); comfort by ANCOVA; secondary/subgroup analyses are exploratory. The pre-registered plan governs primary inference. A purpose-built application recorded responses, timing, and AI conversations to a secure server-side database; the case is fictional and contains no protected health information.

---

## Results

> **[DATA — to be completed]** (templated to the analysis plan).

Of [N] residents randomized (50 AI, 50 control), [N] completed the session and contributed primary-outcome data (Figure 1); baseline characteristics were balanced (Table 1). Mean post-case unassisted knowledge score was **[X.X ± SD]/12** (AI) versus **[X.X ± SD]/12** (control); adjusted difference **[Δ] (95% CI [—]; P = [—])** (Table 2, Figure 2). Comfort changed by **[Δ]** versus **[Δ]** (P = [—]); median total time **[—]** versus **[—] min**; AI-arm participants sent a median of **[—]** messages. [Exploratory: interaction posture vs. knowledge; PGY subgroup; comfort–knowledge dissociation.]

---

## Discussion

[DATA-dependent.] Residents who worked an unfamiliar case with an out-of-the-box AI assistant scored **[higher / no differently / lower]** on an immediately following, resource-free assessment than those who used a standard reference. Because no resource was allowed, this reflects knowledge residents *retained and could apply on their own*, not assisted performance — extending the clinical-AI randomized literature, which measures performance with a tool,³ to the question that matters for trainees.

Framed against the de-/never-/mis-skilling taxonomy,¹⁵ the trial supplies direct evidence on a concern that, for cognitive medical tasks, has been argued from theory and from analogy to perceptual domains.¹³ [A null or negative difference would be the first randomized signal that AI assistance can bypass durable knowledge formation for a cognitive clinical task; a benefit would argue toward AI as a learning aid even when learning is incidental.] The item-level data also let us probe **mis-skilling** and the confidence–competence gap — whether any rise in comfort outpaces actual knowledge.⁶ Two implications follow regardless of direction. First, **the endpoint matters**: tools and curricula optimized for assisted performance may quietly substitute for the competence residency exists to build, so trainee-facing AI should be evaluated against learning, not task completion. Second, **AI tools are not interchangeable** on this dimension: we tested a generic assistant, whereas a purpose-built tutor can enhance learning,¹⁷ and the present result establishes the default-chatbot baseline against which any learning-oriented design must prove itself. Consistent with evidence that *how* one engages AI governs whether it builds or erodes skill,⁴,⁸ our exploratory analysis [supports/does not support] interaction posture as the operative variable; if posture is both consequential and modifiable, the question becomes whether residents can be taught to use AI in skill-preserving ways.

### Limitations
Single center and one residency program; multi-site replication would strengthen generalizability. The outcome is a knowledge assessment given immediately after a single, fictional case — a proximal measure that may not capture long-term retention, transfer, or bedside performance; delayed and longitudinal designs would test durability and cumulative effects. Participants could not be blinded to their resource (though they were blinded to arm labels and hypothesis). The intervention was one model in one default configuration against one comparator; results may differ with other tools or configurations. Because the case lies outside residents' prior knowledge, the trial indexes the acquisition mechanism shared by de- and never-skilling rather than erosion of a familiar skill; complementary designs (medical students; familiar content) would localize the effect along the training continuum.

### Conclusions
[DATA-dependent.] Among internal medicine residents working an unfamiliar case, access to an out-of-the-box AI assistant **[did/did not]** change the knowledge they could subsequently apply unaided. As generative AI becomes ubiquitous in training, randomized evidence on what trainees *acquire* — not only how they perform with a tool in hand — should govern how AI is introduced into graduate medical education.

---

## Declarations
**Funding:** [source]. **Registration:** [registry/ID, before enrollment]. **Ethics:** Stanford IRB-86737 (exempt); informed consent obtained. **Data/code:** case, 12-item instrument and key, randomization procedure, and analysis code to be shared [terms]. **Author contributions:** [CRediT]. **Conflicts:** [disclose AI-vendor relationships]. **Generative-AI disclosure:** the AI assistant is the trial intervention (Methods); [disclose any use in manuscript preparation per NEJM AI policy].

## Figures and Tables
**Figure 1.** CONSORT flow by arm (`figures/consort-flow.svg`). **Figure 2.** Knowledge-score distribution by arm. **Table 1.** Baseline characteristics by arm. **Table 2.** Outcomes by arm (primary score with adjusted difference/CI/P; comfort change; time; AI-interaction metrics).

---

## References

> *Verify 2024–2026 items (⚠) and resolve preprint vs. published status before submission.*

1. [Representative survey of trainee generative-AI uptake, 2024–2025.] ⚠ select and verify.
2. Strong E, DiGiammarino A, Weng Y, et al. Chatbot vs medical student performance on free-response clinical reasoning examinations. *JAMA Intern Med.* 2023;183(9):1028–1030.
3. Goh E, Gallo R, Hom J, et al. Large language model influence on diagnostic reasoning: a randomized clinical trial. *JAMA Netw Open.* 2024;7(10):e2440969.
4. Shen JH, Tamkin A. How AI impacts skill formation. *arXiv:2601.20245* (2026).
5. Fan Y, et al. Beware of metacognitive laziness: effects of generative AI on learning motivation, processes, and performance. *Br J Educ Technol.* 2025 (arXiv:2412.09315). ⚠ verify.
6. Lee H-P, et al. The impact of generative AI on critical thinking: self-reported reductions in cognitive effort and confidence effects from a survey of knowledge workers. *Proc. CHI 2025.* doi:10.1145/3706598.3713778.
7. Kosmyna N, et al. Your brain on ChatGPT: accumulation of cognitive debt when using an AI assistant for essay-writing tasks. *arXiv:2506.08872* (2025). ⚠ preprint.
8. [The widening gap: the benefits and harms of generative AI for novice programmers.] *arXiv:2405.17739* (2024). ⚠ verify authors/venue.
9. Roediger HL III, Karpicke JD. The power of testing memory: basic research and implications for educational practice. *Perspect Psychol Sci.* 2006;1(3):181–210.
10. Bjork RA. Memory and metamemory considerations in the training of human beings. In: Metcalfe J, Shimamura AP, eds. *Metacognition.* MIT Press; 1994:185–205.
11. Bainbridge L. Ironies of automation. *Automatica.* 1983;19(6):775–779.
12. Dahmani L, Bohbot VD. Habitual use of GPS negatively impacts spatial memory during self-guided navigation. *Sci Rep.* 2020;10:6310.
13. Budzyń K, Romańczyk M, et al. Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational, before-and-after study. *Lancet Gastroenterol Hepatol.* 2025;10(10):896–903. ⚠ verify author list.
14. Goddard K, Roudsari A, Wyatt JC. Automation bias: a systematic review of frequency, effect mediators, and mitigators. *J Am Med Inform Assoc.* 2012;19(1):121–127.
15. Abdulnour R-EE, Gin B, Boscardin CK. Educational strategies for clinical supervision of artificial intelligence use. *N Engl J Med.* 2025;393:786–797.
16. [Generative AI / LLMs in graduate (or undergraduate) medical education: a scoping review, 2025.] ⚠ select and verify (e.g., PMID 40394586).
17. Kestin G, Miller K, Klales A, Milbourne T, Ponti G. AI tutoring outperforms in-class active learning: a randomized controlled trial. *Sci Rep.* 2025. ⚠ verify.
