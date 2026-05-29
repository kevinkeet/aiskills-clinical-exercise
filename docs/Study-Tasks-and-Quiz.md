# Study Content — Tasks & Knowledge Assessment

**Stanford IRB-86737 — Clinical Case-Based Learning in Internal Medicine Residency**
**Live at:** https://aiskills.kevinkeet.com

This document is a snapshot of every task prompt and quiz item that
participants see during the case exercise. The canonical source of
truth lives in the repository at:

- `src/data/tasks.ts` (5 free-response tasks)
- `src/data/questions.ts` (22 graded MCQs + 1 post-test comfort scale)
- `src/data/intakeContent.ts` (intake comfort scale, IRB consent text)

Note: the live runtime source of truth is the `quiz_questions` / `tasks`
Supabase tables (editable from `/admin`); `src/data/*.ts` only seeds those
tables when empty. If anything changes in either place, regenerate this
document. Last regenerated 2026-05-29.

---

## Patient case (shown alongside every task)

A 32-year-old man, **Marcus Thompson**, referred to internal medicine for
progressive chronic kidney disease of unclear etiology. Creatinine has
risen from 1.2 to 1.8 mg/dL over 18 months with persistent proteinuria
(1.4 g/g). He has no diabetes or hypertension, and a standard workup
(ANA, hepatitis serologies, HIV, complements) is unremarkable. The
referral is deliberately lean — the classic Fabry clues (acroparesthesia,
GI symptoms, angiokeratomas, corneal findings) are **not** volunteered in
the vignette, so the resident must elicit them through history and exam.

The plausible reason Fabry is on the table: the ECG shows a short PR
interval (110 ms) and **LVH by voltage criteria**, unexpected in a
normotensive 32-year-old, and the family history points to an X-linked
pattern — a mother with an unspecified "heart condition" diagnosed in her
50s and a maternal uncle who reached dialysis in his 40s, with a healthy
paternal side and no father-to-son transmission.

The full case (HPI, PMH, meds, family history, ROS, vitals, labs)
is rendered in a collapsible panel above each task and can be inserted
into the AI chat with one click.

---

## The 5 clinical tasks

Each task is free-response. Participants type their answer into a
textarea below the task prompt; minimum-character thresholds are kept
internal as a soft check.

### Task 1 — Additional History

> *"This is a young man with progressive chronic kidney disease of
> unclear etiology, and Fabry disease is being considered. The referral
> provided only a limited history, so it is up to you to take a focused
> history today. What additional history questions would you want to ask,
> and briefly explain your reasoning for each?"*

### Task 2 — Physical Examination

> *"What physical exam maneuvers would be important for this patient
> and why?"*

### Task 3 — Diagnostic Workup

> *"What laboratory tests, imaging, and other diagnostic studies would
> you order and why?"*

### Task 4 — Next Steps in Management

> *"New findings from the physical exam and diagnostic workup have been
> added to the patient case panel above. The diagnosis of Fabry disease
> is confirmed. What would be your next steps in management?"*

At Task 4 the patient case panel reveals additional findings —
angiokeratomas in a "swimming-trunk" distribution, S4 gallop on
auscultation, decreased pinprick with preserved vibration, orthostatic
hypotension, cornea verticillata on slit-lamp, concentric LVH on
echo, low alpha-galactosidase A activity, elevated lyso-Gb3, hemizygous
pathogenic GLA variant, late gadolinium enhancement and low native T1
on cardiac MRI, mild bilateral high-frequency hearing loss, scattered
white-matter hyperintensities on brain MRI, and mildly elevated
NT-proBNP / troponin I.

### Task 5 — Patient Instructions

> *"Write after-visit patient instructions for this patient with newly
> diagnosed Fabry disease."*

---

## Knowledge Assessment

**Format:** 22 multiple-choice questions (graded) + 1 post-test comfort
scale (Q13, not graded). Question numbers are stable IDs with intentional
gaps: Q14, Q17, Q18, Q20 were retired as redundant (preserved in
`Retired-Questions.md`), and Q23–Q27 were added later. The full graded set
is Q1–Q12, Q15, Q16, Q19, Q21, Q22, Q23–Q27. External resources are not
permitted during the assessment.

**Difficulty calibration target (per study lead):**

| Population | Expected score |
|---|---|
| Naive resident (no exposure to the case) | ~10–20% correct |
| AI group (chatted with Claude during the case) | ~40–50% correct |
| Control group (used UpToDate during the case) | ~70–80% correct |

Distractors are deliberately chosen so that "common medical sense"
points to the wrong answer (e.g., cold-triggered pain, the diabetic
"stocking-glove" sensory pattern, autosomal-dominant inheritance).
Correct answers are balanced across positions A/B/C/D (A=6, B=5, C=5,
D=6 across the 22 MCQs), and option lengths within a question are kept
similar so "longest option" cannot be used as a guessing heuristic.

**Question → task mapping:**

The original twelve items map onto the five tasks. The later items
(Q15, Q16, Q19, Q21, Q22 and Q23–Q27) test cross-cutting mechanism and
"learned-at-the-bedside" knowledge that is not tied to a single task.

| Questions | Maps to |
|---|---|
| Q1–Q3 | Task 1 (history) |
| Q4–Q6 | Task 2 (physical exam) |
| Q7–Q9 | Task 3 (diagnostic workup) |
| Q10–Q11 | Task 4 (management) |
| Q12 | Task 5 (patient counseling) |
| Q15, Q16, Q19, Q21, Q22 | Mechanism / core-concept items |
| Q23–Q27 | Harder "bedside" items (cardiac conduction, lyso-Gb3 monitoring, stroke pattern, hypohidrosis, transplant outcome) |
| Q13 | Post-test comfort (paired with the intake item) |

---

### Q1 — Acroparesthesia triggers (history)

**Episodes of severe burning pain in the hands and feet, present since childhood, in this disease are most characteristically triggered by:**

- **A. ✓ Heat, fever, and physical exertion**
- B. Cold exposure, stress, and certain foods
- C. Sustained pressure on the affected limbs
- D. Prolonged immobility, such as long flights or bed rest

**Correct: A.** Naive resident pattern-matches to *cold* (Raynaud's,
diabetic neuropathy paradigm). Both case groups should learn the right
answer.

### Q2 — Family-history pattern (history)

**A 32-year-old man with this disease is asking about inheritance. Which family-history pattern would most support the diagnosis?**

- A. Both parents unaffected, with approximately 25% of siblings affected regardless of sex
- **B. ✓ Affected maternal uncles and male cousins, with no father-to-son transmission**
- C. Affected men in multiple generations on the father’s side, including father-to-son transmission
- D. No family history of similar symptoms in any relative

**Correct: B (X-linked).** Naive guesses *autosomal dominant* (option C).

### Q3 — GI symptoms misdiagnosed as IBS (history)

**A patient with this disease has a long-standing diagnosis of irritable bowel syndrome with episodic abdominal pain and diarrhea. This gastrointestinal pattern is most likely:**

- A. A coincidental functional bowel disorder unrelated to the underlying disease
- B. An adverse effect of the chronic neuropathic-pain medications he takes
- **C. ✓ A direct gastrointestinal manifestation of the disease, often predating its diagnosis**
- D. A sign of mesenteric ischemia from vascular involvement, warranting urgent mesenteric angiography

**Correct: C.** "Common sense" says unrelated. Tested in the case
prompt itself.

### Q4 — Angiokeratoma distribution (physical exam)

**On physical examination, which of the following dermatologic findings would most strongly support this diagnosis?**

- A. Erythematous, silvery-scaled plaques on the extensor surfaces of the elbows and knees
- **B. ✓ Clusters of small, dark-red papules over the lower abdomen, groin, and upper thighs**
- C. Hyperpigmented, velvety thickened patches in the axillae and the posterior neck folds
- D. Firm yellow-orange nodules overlying the Achilles and the extensor tendons of the hands

**Correct: B.** "Swimming-trunk" angiokeratoma distribution.

### Q5 — Cornea verticillata is *not* pathognomonic (physical exam)

**Cornea verticillata (bilateral whorl-like opacities of the corneal epithelium) is observed on slit-lamp examination. Which of the following is true about this finding?**

- A. It is pathognomonic for this disease and reliably excludes all other diagnoses
- B. It typically causes progressive visual loss that requires corneal transplantation
- **C. ✓ It also occurs with chronic amiodarone, chloroquine, or hydroxychloroquine therapy**
- D. It is usually markedly asymmetric, affecting only one eye in the majority of patients

**Correct: C.** *Strong AI-vs-Control differentiator.* The AI is likely
to call it "characteristic" and stop. UpToDate explicitly lists the
drug differential.

### Q6 — Small-fiber selective sensory pattern (physical exam)

**Sensory examination of a patient with this disease typically shows:**

- **A. ✓ Reduced pinprick and temperature sensation distally, with preserved vibration sense**
- B. Reduced vibration and proprioception in the feet, with preserved pinprick and temperature
- C. A patchy, asymmetric sensory deficit consistent with a mononeuritis multiplex pattern
- D. A symmetric 'stocking-glove' loss of all sensory modalities with absent ankle reflexes

**Correct: A.** Naive guesses the *diabetic* stocking-glove pattern (D).

### Q7 — Initial confirmatory test in males (workup)

**For a male patient with clinical suspicion of this disease, the most appropriate initial confirmatory test is:**

- A. Renal biopsy with electron microscopy looking for lamellated inclusion bodies
- B. Whole-exome sequencing performed on a peripheral blood sample
- C. Serum protein electrophoresis with immunofixation
- **D. ✓ Plasma or leukocyte alpha-galactosidase A enzyme activity assay**

**Correct: D.**

### Q8 — Why a "normal" enzyme activity in a female does NOT rule out (workup)

**The patient’s 35-year-old sister is being evaluated as a possible carrier. Her plasma alpha-galactosidase A activity is reported as normal. The most appropriate interpretation is:**

- **A. ✓ Send GLA gene sequencing, because enzyme activity is unreliable in carrier females**
- B. She is definitively unaffected and requires no further evaluation or genetic testing
- C. Her diagnosis is confirmed; the normal enzyme activity reflects compensatory pathways
- D. She has a 50% chance of carrying it and should defer testing until she is symptomatic

**Correct: A.** *Strongest AI-vs-Control differentiator.* UpToDate is
explicit about X-inactivation. The AI may say "test her enzyme"
without flagging the false-negative problem in females.

### Q9 — Short PR interval on ECG (workup)

**Which of the following ECG findings is characteristic of cardiac involvement in this disease, particularly in earlier stages?**

- A. A prolonged QTc interval with marked T-wave inversion
- B. Right bundle branch block with marked right axis deviation
- C. Pathologic Q waves in the inferior and lateral leads
- **D. ✓ A short PR interval, often less than 120 milliseconds**

**Correct: D.** *Strong differentiator.* UpToDate lists it; AI tends
to emphasize LVH instead. The case vignette actually shows PR 110 ms
— Control reading carefully notices.

### Q10 — Migalastat is genotype-restricted (management)

**Migalastat (Galafold) for this disease:**

- A. Is an oral substrate reduction therapy that inhibits the enzyme glucosylceramide synthase
- **B. ✓ Is a pharmacologic chaperone that works only in patients with 'amenable' GLA mutations**
- C. Is given intravenously every two weeks alongside standard enzyme replacement therapy
- D. Is curative when it is combined with hematopoietic stem-cell transplantation early on

**Correct: B.** *Strong differentiator.* UpToDate is explicit that it
only works for amenable mutations.

### Q11 — Renal protection independent of disease-specific therapy (management)

**In a patient with this disease, stage 3 CKD, and persistent proteinuria, a cornerstone of renal protection — independent of disease-specific therapy — is:**

- A. A high-dose loop diuretic such as furosemide to control chronic fluid overload
- B. Chronic empiric oral corticosteroids to slow progressive glomerular injury over time
- **C. ✓ An ACE inhibitor or angiotensin receptor blocker titrated to reduce proteinuria**
- D. A calcineurin inhibitor such as tacrolimus to suppress ongoing glomerular inflammation

**Correct: C.**

### Q12 — Inheritance counselling (patient instructions)

**You are counseling a male patient with this disease about implications for his future children. Which of the following statements is most accurate?**

- A. Each of his children, regardless of sex, has a 50% chance of inheriting the mutation
- B. Only his sons are at risk; his daughters cannot inherit the mutation
- C. None of his children are at increased risk because the disease typically arises de novo
- **D. ✓ All of his daughters will inherit the mutation; none of his sons will inherit it**

**Correct: D.** Hemizygous male passes his X to all daughters and
his Y to all sons.

### Q15 — Mechanism of neuropathic pain (mechanism)

**The neuropathic pain experienced in Fabry disease is most directly related to:**

- **A. ✓ Deposition of glycosphingolipids within small nerve fibers**
- B. Immune-mediated demyelination of the peripheral sensory nerves
- C. Entrapment and compression neuropathy from soft-tissue edema
- D. Autoimmune small-vessel vasculitis affecting the peripheral nerves

**Correct: A.** Small-fiber storage, not an inflammatory or compressive
mechanism.

### Q16 — Mechanism of LVH (mechanism)

**Which mechanism most likely explains the development of left ventricular hypertrophy in Fabry disease?**

- A. Chronic, poorly controlled systemic arterial hypertension
- B. Coronary vasospasm causing recurrent ischemia and fibrosis
- C. Recurrent viral myocarditis with inflammatory remodeling
- **D. ✓ Glycosphingolipid accumulation within the cardiomyocytes**

**Correct: D.** A storage cardiomyopathy, not pressure-overload LVH.

### Q19 — Renal target of injury (mechanism)

**Proteinuria in Fabry disease most directly reflects injury to which renal structure?**

- A. Distal tubules
- B. Collecting ducts
- C. Renal arteries
- **D. ✓ Podocytes**

**Correct: D.** Podocyte injury drives the proteinuria.

### Q21 — Rationale for early therapy (management)

**The primary rationale for initiating disease-specific therapy early in Fabry disease is to:**

- A. Reverse all of the organ damage that has already accumulated
- B. Eliminate the risk of transmitting the disease to offspring
- **C. ✓ Prevent irreversible organ fibrosis and loss of function**
- D. Restore a normal life expectancy in essentially all patients

**Correct: C.** Therapy halts progression; established fibrosis is not
reversed.

### Q22 — When to suspect Fabry (recognition)

**Which patient presentation should most strongly prompt consideration of Fabry disease?**

- **A. ✓ Young man with proteinuric CKD, lifelong burning pain in the hands and feet, and a maternal uncle on dialysis**
- B. Young woman with proteinuria, a photosensitive facial rash, and inflammatory polyarthralgia of the hands
- C. Young man with persistent hematuria, progressive sensorineural hearing loss, and a family history of kidney failure
- D. Young adult with episodic flank pain, gross hematuria, and numerous bilateral renal cysts seen on imaging

**Correct: A.** Multisystem disease in a young patient with a suggestive
family history.

### Q23 — Conduction disease and device therapy (cardiac, advanced)

**Beyond left ventricular hypertrophy, which of the following is another characteristic cardiac manifestation of Fabry disease?**

- A. Recurrent paroxysmal supraventricular tachycardia arising from a congenital accessory pathway
- **B. ✓ Progressive conduction disease and arrhythmias, such as AV block and atrial fibrillation**
- C. Congenital long-QT syndrome that predisposes the patient to torsades de pointes
- D. Pulmonary arterial hypertension that leads to progressive right heart failure

**Correct: B.** Conduction-system disease (and ventricular arrhythmia
from fibrosis) drives device therapy.

### Q24 — Biomarker for ERT monitoring (workup / monitoring)

**In a patient on enzyme replacement therapy for Fabry disease, which blood test best reflects biochemical disease activity and treatment response over time?**

- A. Plasma globotriaosylceramide (Gb3) concentration
- **B. ✓ Plasma globotriaosylsphingosine (lyso-Gb3)**
- C. Leukocyte alpha-galactosidase A enzyme activity
- D. A 24-hour urine protein-to-creatinine ratio

**Correct: B.** lyso-Gb3 tracks disease activity and treatment response;
enzyme activity is diagnostic, not a monitoring marker.

### Q25 — Stroke pattern (neurology, advanced)

**Patients with Fabry disease are at markedly increased risk of stroke, often at a young age. Which stroke pattern is most characteristic?**

- A. Large-artery cardioembolic stroke as the single predominant mechanism
- B. Lobar intracerebral hemorrhage caused by underlying cerebral amyloid angiopathy
- **C. ✓ Small-vessel ischemic stroke with a predilection for the posterior circulation**
- D. Subarachnoid hemorrhage from the rupture of a berry (saccular) aneurysm in the circle of Willis

**Correct: C.** Small-vessel cerebrovasculopathy with posterior-circulation
predilection (dolichoectasia).

### Q26 — Heat intolerance and hypohidrosis (autonomic, advanced)

**A young man with Fabry disease reports that he cannot tolerate hot weather or exercise and rarely sweats. The most likely explanation is:**

- A. An anticholinergic adverse effect of one of his current medications
- B. Primary hypothalamic thermoregulatory dysfunction of central origin
- C. Physical deconditioning and reduced cardiac output from his cardiomyopathy
- **D. ✓ Fabry-related small-fiber and autonomic dysfunction that impairs sweating**

**Correct: D.** Hypohidrosis from small-fiber/autonomic involvement is a
classic and under-recognized feature.

### Q27 — Kidney transplant outcome (management, advanced)

**A patient with Fabry disease reaches end-stage kidney disease and receives a kidney transplant. Which statement is most accurate?**

- **A. ✓ The graft is largely spared, but cardiac and cerebrovascular disease keep progressing**
- B. The graft re-accumulates glycosphingolipid and predictably fails within the first year
- C. Transplantation corrects the enzyme deficiency systemically and halts disease elsewhere
- D. A living related-donor graft is strongly preferred because relatives resist recurrence

**Correct: A.** The allograft is largely spared, but extrarenal disease
progresses without enzyme/chaperone therapy.

### Q13 — Post-test comfort scale (not graded)

> *"How comfortable would you be taking care of a patient with Fabry
> disease?"*

0–10 scale, anchored 0 = "Not at all comfortable", 10 = "Very
comfortable". Same wording is used as the intake/pre-test item, so the
change in self-rated comfort can be analysed as a paired pre/post
measure.

---

## Answer-position distribution (sanity check)

| A | B | C | D |
|---|---|---|---|
| Q1, Q6, Q8, Q15, Q22, Q27 | Q2, Q4, Q10, Q23, Q24 | Q3, Q5, Q11, Q21, Q25 | Q7, Q9, Q12, Q16, Q19, Q26 |
| 6 | 5 | 5 | 6 |
