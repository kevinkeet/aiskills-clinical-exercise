/**
 * Knowledge assessment for the Fabry disease clinical case exercise.
 *
 * Design intent (per study lead):
 * - Naive resident, no exposure to the case → target ~10–20% correct.
 *   Distractors are intentionally chosen so that "common medical sense"
 *   leads to the wrong answer (cold-triggered pain, diabetic-pattern
 *   neuropathy, autosomal-dominant inheritance, etc.).
 * - AI group (used Claude during the case) → target ~40–50%. They get
 *   the gist but the AI may not surface the specific nuances unless
 *   asked (drug-induced cornea verticillata, X-inactivation in
 *   heterozygous females, low native T1 on cardiac MRI, the short PR
 *   on ECG, that migalastat is genotype-specific).
 * - Control group (UpToDate) → target ~70–80%. UpToDate explicitly
 *   lists the differentials, the female-diagnosis caveat, the cardiac
 *   imaging signatures, and the ERT/migalastat distinction.
 *
 * Each question maps to one of the five tasks:
 *   Q1–3  → Task 1 (additional history)
 *   Q4–6  → Task 2 (physical examination)
 *   Q7–9  → Task 3 (diagnostic workup)
 *   Q10–11 → Task 4 (next steps in management)
 *   Q12   → Task 5 (patient instructions)
 *
 * Correct-answer positions are evenly distributed: 3 each of A, B, C, D.
 * Position pattern: A, B, C, B, C, A, D, A, D, B, C, D
 *
 * Distractor lengths are kept similar to the correct answer within each
 * question so that "longest option" cannot be used as a guessing heuristic.
 */

/** Multiple-choice question (default). */
export interface MCQQuestion {
  number: number;
  type?: 'mcq';
  text: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
}

/** Numeric-scale question (e.g., 0–10 comfort rating). No correct answer. */
export interface ScaleQuestion {
  number: number;
  type: 'scale';
  text: string;
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
}

export type Question = MCQQuestion | ScaleQuestion;

/** Type guard convenience */
export function isMCQ(q: Question): q is MCQQuestion {
  return !q.type || q.type === 'mcq';
}

export const questions: Question[] = [
  // --- TASK 1: HISTORY (Q1–Q3) ---
  {
    number: 1,
    text: 'Episodes of severe burning pain in the hands and feet, present since childhood, in this disease are most characteristically triggered by:',
    options: [
      { label: 'A', value: 'Heat, fever, and physical exertion' },
      { label: 'B', value: 'Cold exposure, stress, and certain foods' },
      { label: 'C', value: 'Sustained pressure on the affected limbs' },
      { label: 'D', value: 'Prolonged immobility, such as long flights or bed rest' },
    ],
    correctAnswer: 'A',
  },
  {
    number: 2,
    text: 'A 32-year-old man with this disease is asking about inheritance. Which family-history pattern would most support the diagnosis?',
    options: [
      {
        label: 'A',
        value:
          'Both parents unaffected, with approximately 25% of siblings affected regardless of sex',
      },
      {
        label: 'B',
        value:
          'Affected maternal uncles and male cousins, with no father-to-son transmission',
      },
      {
        label: 'C',
        value:
          'Affected men in multiple generations on the father\u2019s side, including father-to-son transmission',
      },
      {
        label: 'D',
        value: 'No family history of similar symptoms in any relative',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 3,
    text: 'A patient with this disease has a long-standing diagnosis of irritable bowel syndrome with episodic abdominal pain and diarrhea. This gastrointestinal pattern is most likely:',
    options: [
      {
        label: 'A',
        value: 'An unrelated comorbidity that should be managed independently',
      },
      {
        label: 'B',
        value: 'A side effect of long-term gabapentin therapy',
      },
      {
        label: 'C',
        value:
          'A direct manifestation of the underlying disease, often delaying its diagnosis',
      },
      {
        label: 'D',
        value:
          'An indication for empiric antibiotic therapy for small-intestinal bacterial overgrowth',
      },
    ],
    correctAnswer: 'C',
  },

  // --- TASK 2: PHYSICAL EXAMINATION (Q4–Q6) ---
  {
    number: 4,
    text: 'On physical examination, which of the following dermatologic findings would most strongly support this diagnosis?',
    options: [
      {
        label: 'A',
        value:
          'Erythematous, scaly plaques on the extensor surfaces of the elbows and knees',
      },
      {
        label: 'B',
        value:
          'Clusters of small, dark-red papules on the lower abdomen, groin, and upper thighs',
      },
      {
        label: 'C',
        value:
          'Hyperpigmented velvety patches in the axillae and posterior neck',
      },
      {
        label: 'D',
        value:
          'Yellow nodules along the Achilles and extensor tendons of the hands',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 5,
    text: 'Cornea verticillata (bilateral whorl-like opacities of the corneal epithelium) is observed on slit-lamp examination. Which of the following is true about this finding?',
    options: [
      {
        label: 'A',
        value:
          'It is pathognomonic for this disease and excludes other diagnoses',
      },
      {
        label: 'B',
        value:
          'It typically causes significant visual loss requiring corneal transplantation',
      },
      {
        label: 'C',
        value:
          'It is also seen with chronic amiodarone, chloroquine, and other cationic amphiphilic drug use',
      },
      {
        label: 'D',
        value:
          'It is usually asymmetric, affecting only one eye in most patients',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 6,
    text: 'Sensory examination of a patient with this disease typically shows:',
    options: [
      {
        label: 'A',
        value:
          'Decreased pinprick and temperature sensation distally, with preserved vibration and proprioception',
      },
      {
        label: 'B',
        value:
          'Decreased vibration and proprioception in the feet, with preserved pinprick and temperature',
      },
      {
        label: 'C',
        value:
          'A patchy, asymmetric distribution consistent with mononeuritis multiplex',
      },
      {
        label: 'D',
        value:
          'A "stocking-glove" loss of all sensory modalities with absent ankle reflexes',
      },
    ],
    correctAnswer: 'A',
  },

  // --- TASK 3: DIAGNOSTIC WORKUP (Q7–Q9) ---
  {
    number: 7,
    text: 'For a male patient with clinical suspicion of this disease, the most appropriate initial confirmatory test is:',
    options: [
      {
        label: 'A',
        value:
          'Renal biopsy with electron microscopy looking for lamellated inclusion bodies',
      },
      {
        label: 'B',
        value: 'Whole-exome sequencing performed on a peripheral blood sample',
      },
      {
        label: 'C',
        value: 'Serum protein electrophoresis with immunofixation',
      },
      {
        label: 'D',
        value:
          'Plasma or leukocyte alpha-galactosidase A enzyme activity assay',
      },
    ],
    correctAnswer: 'D',
  },
  {
    number: 8,
    text: 'The patient\u2019s 35-year-old sister is being evaluated as a possible carrier. Her plasma alpha-galactosidase A activity is reported as normal. The most appropriate interpretation is:',
    options: [
      {
        label: 'A',
        value:
          'GLA gene sequencing is required, because enzyme activity is unreliable in heterozygous females',
      },
      {
        label: 'B',
        value: 'She is definitively unaffected and does not require further evaluation',
      },
      {
        label: 'C',
        value:
          'She has the disease confirmed; her enzyme activity is normal due to compensatory pathways',
      },
      {
        label: 'D',
        value:
          'She has a 50% chance of being a carrier and should defer testing until she becomes symptomatic',
      },
    ],
    correctAnswer: 'A',
  },
  {
    number: 9,
    text: 'Which of the following ECG findings is characteristic of cardiac involvement in this disease, particularly in earlier stages?',
    options: [
      {
        label: 'A',
        value: 'A prolonged QTc interval with marked T-wave inversion',
      },
      {
        label: 'B',
        value: 'Right bundle branch block with marked right axis deviation',
      },
      {
        label: 'C',
        value: 'Pathologic Q waves in the inferior and lateral leads',
      },
      {
        label: 'D',
        value: 'A short PR interval, often less than 120 milliseconds',
      },
    ],
    correctAnswer: 'D',
  },

  // --- TASK 4: NEXT STEPS IN MANAGEMENT (Q10–Q11) ---
  {
    number: 10,
    text: 'Migalastat (Galafold) for this disease:',
    options: [
      {
        label: 'A',
        value:
          'Is a substrate reduction therapy that inhibits glucosylceramide synthase',
      },
      {
        label: 'B',
        value:
          'Is a pharmacologic chaperone effective only in patients with specific "amenable" GLA mutations',
      },
      {
        label: 'C',
        value:
          'Is administered intravenously every two weeks alongside enzyme replacement therapy',
      },
      {
        label: 'D',
        value:
          'Is curative when combined with hematopoietic stem cell transplantation',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 11,
    text: 'In a patient with this disease, stage 3 CKD, and persistent proteinuria, a cornerstone of renal protection \u2014 independent of disease-specific therapy \u2014 is:',
    options: [
      {
        label: 'A',
        value:
          'A high-dose loop diuretic such as furosemide to control fluid overload',
      },
      {
        label: 'B',
        value: 'Chronic empiric oral corticosteroids to slow glomerular injury',
      },
      {
        label: 'C',
        value:
          'An ACE inhibitor or angiotensin receptor blocker, titrated to reduce proteinuria',
      },
      {
        label: 'D',
        value:
          'A calcineurin inhibitor such as tacrolimus to suppress glomerular inflammation',
      },
    ],
    correctAnswer: 'C',
  },

  // --- TASK 5: PATIENT INSTRUCTIONS (Q12) ---
  {
    number: 12,
    text: 'You are counseling a male patient with this disease about implications for his future children. Which of the following statements is most accurate?',
    options: [
      {
        label: 'A',
        value:
          'Each of his children, regardless of sex, has a 50% chance of inheriting the mutation',
      },
      {
        label: 'B',
        value:
          'Only his sons are at risk; his daughters cannot inherit the mutation',
      },
      {
        label: 'C',
        value:
          'None of his children are at increased risk because the disease typically arises de novo',
      },
      {
        label: 'D',
        value:
          'All of his daughters will inherit the mutation; none of his sons will inherit it',
      },
    ],
    correctAnswer: 'D',
  },

  // --- POST-TEST COMFORT (Q13) ---
  // Same wording as the intake comfort item (src/data/intakeContent.ts).
  // Stored as the participant's selected_answer string ("0".."10");
  // not graded — `is_correct` is left blank in CSV exports.
  {
    number: 13,
    type: 'scale',
    text: 'How comfortable would you be taking care of a patient with Fabry disease?',
    min: 0,
    max: 10,
    minLabel: 'Not at all comfortable',
    maxLabel: 'Very comfortable',
  },
];
