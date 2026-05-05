# Study Content — Tasks & Knowledge Assessment

**Stanford IRB-86737 — Clinical Case-Based Learning in Internal Medicine Residency**
**Live at:** https://aiskills.kevinkeet.com

This document is a snapshot of every task prompt and quiz item that
participants see during the case exercise. The canonical source of
truth lives in the repository at:

- `src/data/tasks.ts` (5 free-response tasks)
- `src/data/questions.ts` (12 graded MCQs + 1 post-test comfort scale)
- `src/data/intakeContent.ts` (intake comfort scale, IRB consent text)

If anything in those files changes, this document should be regenerated.

---

## Patient case (shown alongside every task)

A 32-year-old man, **Marcus Thompson**, referred to internal medicine for
progressive chronic kidney disease of unclear etiology. Creatinine has
risen from 1.2 to 1.8 mg/dL over 18 months with persistent proteinuria
(1.4 g/g). He has had burning pain in his hands and feet since
childhood, intermittent abdominal pain and diarrhea attributed to IBS,
exertional dyspnea, and corneal opacities noted on a routine
optometry visit. Family history includes a mother with "some kind of
heart problem" and a maternal cousin on dialysis. ECG shows a short PR
interval (110 ms) and LVH by voltage criteria. Standard workup (ANA,
hepatitis serologies, HIV, complements) is unremarkable.

The full case (HPI, PMH, meds, family history, ROS, vitals, labs)
is rendered in a collapsible panel above each task and can be inserted
into the AI chat with one click.

---

## The 5 clinical tasks

Each task is free-response. Participants type their answer into a
textarea below the task prompt; minimum-character thresholds are kept
internal as a soft check.

### Task 1 — Additional History

> *"This patient has progressive CKD of unclear etiology, chronic
> neuropathic pain, and several other symptoms. Fabry disease is
> suspected. Based on the information provided, what additional
> history questions would you want to ask, and briefly explain your
> reasoning for each."*

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

**Format:** 12 multiple-choice questions (Q1–Q12, graded) + 1 post-test
comfort scale (Q13, not graded). External resources are not permitted.

**Difficulty calibration target (per study lead):**

| Population | Expected score |
|---|---|
| Naive resident (no exposure to the case) | ~10–20% correct |
| AI group (chatted with Claude during the case) | ~40–50% correct |
| Control group (used UpToDate during the case) | ~70–80% correct |

Distractors are deliberately chosen so that "common medical sense"
points to the wrong answer (e.g., cold-triggered pain, the diabetic
"stocking-glove" sensory pattern, autosomal-dominant inheritance).
Correct answers are evenly distributed across positions A/B/C/D
(3 each), and option lengths within a question are kept similar so
"longest option" cannot be used as a guessing heuristic.

**Question → task mapping:**

| Questions | Maps to |
|---|---|
| Q1–Q3 | Task 1 (history) |
| Q4–Q6 | Task 2 (physical exam) |
| Q7–Q9 | Task 3 (diagnostic workup) |
| Q10–Q11 | Task 4 (management) |
| Q12 | Task 5 (patient counseling) |
| Q13 | Post-test comfort (paired with the intake item) |

---

### Q1 — Acroparesthesia triggers (history)

**Episodes of severe burning pain in the hands and feet, present since
childhood, in this disease are most characteristically triggered by:**

- **A. ✓ Heat, fever, and physical exertion**
- B. Cold exposure, stress, and certain foods
- C. Sustained pressure on the affected limbs
- D. Prolonged immobility, such as long flights or bed rest

**Correct: A.** Naive resident pattern-matches to *cold* (Raynaud's,
diabetic neuropathy paradigm). Both case groups should learn the right
answer.

### Q2 — Family-history pattern (history)

**A 32-year-old man with this disease is asking about inheritance.
Which family-history pattern would most support the diagnosis?**

- A. Both parents unaffected, with approximately 25% of siblings
  affected regardless of sex
- **B. ✓ Affected maternal uncles and male cousins, with no
  father-to-son transmission**
- C. Affected men in multiple generations on the father's side,
  including father-to-son transmission
- D. No family history of similar symptoms in any relative

**Correct: B (X-linked).** Naive guesses *autosomal dominant* (option C).

### Q3 — GI symptoms misdiagnosed as IBS (history)

**A patient with this disease has a long-standing diagnosis of
irritable bowel syndrome with episodic abdominal pain and diarrhea.
This gastrointestinal pattern is most likely:**

- A. An unrelated comorbidity that should be managed independently
- B. A side effect of long-term gabapentin therapy
- **C. ✓ A direct manifestation of the underlying disease, often
  delaying its diagnosis**
- D. An indication for empiric antibiotic therapy for small-intestinal
  bacterial overgrowth

**Correct: C.** "Common sense" says unrelated. Tested in the case
prompt itself.

### Q4 — Angiokeratoma distribution (physical exam)

**On physical examination, which of the following dermatologic findings
would most strongly support this diagnosis?**

- A. Erythematous, scaly plaques on the extensor surfaces of the
  elbows and knees *(psoriasis)*
- **B. ✓ Clusters of small, dark-red papules on the lower abdomen,
  groin, and upper thighs**
- C. Hyperpigmented velvety patches in the axillae and posterior
  neck *(acanthosis nigricans)*
- D. Yellow nodules along the Achilles and extensor tendons of the
  hands *(xanthomas)*

**Correct: B.** "Swimming-trunk" angiokeratoma distribution.

### Q5 — Cornea verticillata is *not* pathognomonic (physical exam)

**Cornea verticillata (bilateral whorl-like opacities of the corneal
epithelium) is observed on slit-lamp examination. Which of the
following is true about this finding?**

- A. It is pathognomonic for this disease and excludes other diagnoses
- B. It typically causes significant visual loss requiring corneal
  transplantation
- **C. ✓ It is also seen with chronic amiodarone, chloroquine, and
  other cationic amphiphilic drug use**
- D. It is usually asymmetric, affecting only one eye in most patients

**Correct: C.** *Strong AI-vs-Control differentiator.* The AI is likely
to call it "characteristic" and stop. UpToDate explicitly lists the
drug differential.

### Q6 — Small-fiber selective sensory pattern (physical exam)

**Sensory examination of a patient with this disease typically shows:**

- **A. ✓ Decreased pinprick and temperature sensation distally, with
  preserved vibration and proprioception**
- B. Decreased vibration and proprioception in the feet, with preserved
  pinprick and temperature
- C. A patchy, asymmetric distribution consistent with mononeuritis
  multiplex
- D. A "stocking-glove" loss of all sensory modalities with absent
  ankle reflexes

**Correct: A.** Naive guesses the *diabetic* stocking-glove pattern (D).

### Q7 — Initial confirmatory test in males (workup)

**For a male patient with clinical suspicion of this disease, the most
appropriate initial confirmatory test is:**

- A. Renal biopsy with electron microscopy looking for lamellated
  inclusion bodies
- B. Whole-exome sequencing performed on a peripheral blood sample
- C. Serum protein electrophoresis with immunofixation *(amyloid trap)*
- **D. ✓ Plasma or leukocyte alpha-galactosidase A enzyme activity
  assay**

**Correct: D.**

### Q8 — Why a "normal" enzyme activity in a female does NOT rule out (workup)

**The patient's 35-year-old sister is being evaluated as a possible
carrier. Her plasma alpha-galactosidase A activity is reported as
normal. The most appropriate interpretation is:**

- **A. ✓ GLA gene sequencing is required, because enzyme activity is
  unreliable in heterozygous females**
- B. She is definitively unaffected and does not require further
  evaluation
- C. She has the disease confirmed; her enzyme activity is normal due
  to compensatory pathways
- D. She has a 50% chance of being a carrier and should defer testing
  until she becomes symptomatic

**Correct: A.** *Strongest AI-vs-Control differentiator.* UpToDate is
explicit about X-inactivation. The AI may say "test her enzyme"
without flagging the false-negative problem in females.

### Q9 — Short PR interval on ECG (workup)

**Which of the following ECG findings is characteristic of cardiac
involvement in this disease, particularly in earlier stages?**

- A. A prolonged QTc interval with marked T-wave inversion
- B. Right bundle branch block with marked right axis deviation
- C. Pathologic Q waves in the inferior and lateral leads
- **D. ✓ A short PR interval, often less than 120 milliseconds**

**Correct: D.** *Strong differentiator.* UpToDate lists it; AI tends
to emphasize LVH instead. The case vignette actually shows PR 110 ms
— Control reading carefully notices.

### Q10 — Migalastat is genotype-restricted (management)

**Migalastat (Galafold) for this disease:**

- A. Is a substrate reduction therapy that inhibits glucosylceramide
  synthase *(Gaucher trap)*
- **B. ✓ Is a pharmacologic chaperone effective only in patients with
  specific "amenable" GLA mutations**
- C. Is administered intravenously every two weeks alongside enzyme
  replacement therapy
- D. Is curative when combined with hematopoietic stem cell
  transplantation

**Correct: B.** *Strong differentiator.* UpToDate is explicit that it
only works for amenable mutations.

### Q11 — Renal protection independent of disease-specific therapy (management)

**In a patient with this disease, stage 3 CKD, and persistent
proteinuria, a cornerstone of renal protection — independent of
disease-specific therapy — is:**

- A. A high-dose loop diuretic such as furosemide to control fluid
  overload
- B. Chronic empiric oral corticosteroids to slow glomerular injury
- **C. ✓ An ACE inhibitor or angiotensin receptor blocker, titrated to
  reduce proteinuria**
- D. A calcineurin inhibitor such as tacrolimus to suppress glomerular
  inflammation

**Correct: C.**

### Q12 — Inheritance counselling (patient instructions)

**You are counseling a male patient with this disease about
implications for his future children. Which of the following statements
is most accurate?**

- A. Each of his children, regardless of sex, has a 50% chance of
  inheriting the mutation *(autosomal-dominant trap)*
- B. Only his sons are at risk; his daughters cannot inherit the
  mutation
- C. None of his children are at increased risk because the disease
  typically arises de novo
- **D. ✓ All of his daughters will inherit the mutation; none of his
  sons will inherit it**

**Correct: D.** Hemizygous male passes his X to all daughters and
his Y to all sons.

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
| Q1, Q6, Q8 | Q2, Q4, Q10 | Q3, Q5, Q11 | Q7, Q9, Q12 |
| 3 | 3 | 3 | 3 |
