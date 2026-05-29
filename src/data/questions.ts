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
 * NOTE: The runtime source of truth is the `quiz_questions` Supabase
 * table (editable from /admin). These defaults are only seeded when that
 * table is empty, so they double as a backup of the curated live set.
 * Last synced to the live DB on 2026-05-29 — 22 MCQs + 1 comfort scale.
 *
 * Question numbers are stable IDs, not positions: numbers 14, 17, 18, 20
 * were retired (see docs/Retired-Questions.md) and 23–27 were added later,
 * so the sequence has intentional gaps. loadQuestions() sorts the comfort
 * scale (Q13) first, then MCQs in ascending numeric order.
 *
 * Correct-answer positions across the 22 MCQs are balanced: A=6, B=5,
 * C=5, D=6. Distractor lengths are kept similar to the correct answer
 * within each question so that "longest option" cannot be used as a
 * guessing heuristic.
 */

/** Multiple-choice question (default). */
export interface MCQQuestion {
  number: number;
  type?: 'mcq';
  text: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  /**
   * Whether this question is shown to participants in the live assessment.
   * Undefined is treated as `true` (live). Set to `false` from /admin to
   * hide a question non-destructively (it stays in the database and the
   * editor, but real participants no longer see it). Defaults / seeds never
   * set this — the database column default (true) governs new rows.
   */
  active?: boolean;
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
  /** See MCQQuestion.active. */
  active?: boolean;
}

export type Question = MCQQuestion | ScaleQuestion;

/** Type guard convenience */
export function isMCQ(q: Question): q is MCQQuestion {
  return !q.type || q.type === 'mcq';
}

/**
 * Defaults seeded into the `quiz_questions` Supabase table on first read.
 * The runtime source of truth is the database (editable from /admin).
 * Use src/lib/content.ts → loadQuestions() to read questions at runtime.
 */
export const defaultQuestions: Question[] = [
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

  // --- ADDITIONAL MECHANISM / CORE-CONCEPT ITEMS (Q15, Q16, Q19, Q21, Q22) ---
  {
    number: 15,
    text: 'The neuropathic pain experienced in Fabry disease is most directly related to:',
    options: [
      {
        label: 'A',
        value: 'Deposition of glycosphingolipids within small nerve fibers',
      },
      { label: 'B', value: 'Immune-mediated demyelination' },
      { label: 'C', value: 'Compression neuropathy from tissue edema' },
      { label: 'D', value: 'Autoimmune vasculitis of peripheral nerves' },
    ],
    correctAnswer: 'A',
  },
  {
    number: 16,
    text: 'Which mechanism most likely explains the development of left ventricular hypertrophy in Fabry disease?',
    options: [
      { label: 'A', value: 'Chronic systemic hypertension alone' },
      { label: 'B', value: 'Coronary vasospasm causing fibrosis' },
      { label: 'C', value: 'Recurrent myocarditis' },
      {
        label: 'D',
        value: 'Glycosphingolipid accumulation within cardiomyocytes',
      },
    ],
    correctAnswer: 'D',
  },
  {
    number: 19,
    text: 'Proteinuria in Fabry disease most directly reflects injury to which renal structure?',
    options: [
      { label: 'A', value: 'Distal tubules' },
      { label: 'B', value: 'Collecting ducts' },
      { label: 'C', value: 'Renal arteries' },
      { label: 'D', value: 'Podocytes' },
    ],
    correctAnswer: 'D',
  },
  {
    number: 21,
    text: 'The primary rationale for initiating disease-specific therapy early in Fabry disease is to:',
    options: [
      { label: 'A', value: 'Reverse all accumulated organ damage' },
      { label: 'B', value: 'Eliminate inheritance risk' },
      {
        label: 'C',
        value: 'Prevent irreversible organ fibrosis and dysfunction',
      },
      { label: 'D', value: 'Normalize lifespan' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 22,
    text: 'Which patient presentation should most strongly prompt consideration of Fabry disease?',
    options: [
      {
        label: 'A',
        value:
          'Young man with unexplained CKD, neuropathic pain, and family history of renal disease',
      },
      { label: 'B', value: 'Elderly patient with diabetic nephropathy' },
      { label: 'C', value: 'Middle-aged smoker with hematuria' },
      { label: 'D', value: 'Woman with isolated nephrolithiasis' },
    ],
    correctAnswer: 'A',
  },

  // --- HARDER "LEARNED-AT-THE-BEDSIDE" ITEMS (Q23–Q27) ---
  {
    number: 23,
    text: 'Beyond left ventricular hypertrophy, which cardiac complication most commonly leads to pacemaker or ICD placement in patients with Fabry disease?',
    options: [
      { label: 'A', value: 'Recurrent supraventricular tachycardia' },
      {
        label: 'B',
        value:
          'Progressive conduction-system disease (sinus node dysfunction and AV block)',
      },
      {
        label: 'C',
        value: 'Congenital long-QT syndrome with torsades de pointes',
      },
      {
        label: 'D',
        value: 'Right heart failure from pulmonary arterial hypertension',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 24,
    text: 'In a patient on enzyme replacement therapy for Fabry disease, which blood test best reflects biochemical disease activity and treatment response over time?',
    options: [
      { label: 'A', value: 'Plasma globotriaosylceramide (Gb3)' },
      { label: 'B', value: 'Plasma globotriaosylsphingosine (lyso-Gb3)' },
      { label: 'C', value: 'Leukocyte alpha-galactosidase A activity' },
      { label: 'D', value: '24-hour urine protein-to-creatinine ratio' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 25,
    text: 'Patients with Fabry disease are at markedly increased risk of stroke, often at a young age. Which stroke pattern is most characteristic?',
    options: [
      {
        label: 'A',
        value: 'Cardioembolic stroke as the predominant mechanism',
      },
      {
        label: 'B',
        value: 'Lobar intracerebral hemorrhage from cerebral amyloid angiopathy',
      },
      {
        label: 'C',
        value:
          'Small-vessel ischemic stroke with a predilection for the posterior (vertebrobasilar) circulation',
      },
      {
        label: 'D',
        value: 'Subarachnoid hemorrhage from ruptured saccular aneurysms',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 26,
    text: 'A young man with Fabry disease reports that he cannot tolerate hot weather or exercise and rarely sweats. The most likely explanation is:',
    options: [
      {
        label: 'A',
        value: 'Anticholinergic side effect of one of his medications',
      },
      { label: 'B', value: 'Hypothalamic thermoregulatory dysfunction' },
      {
        label: 'C',
        value:
          'Deconditioning and reduced cardiac output from his cardiomyopathy',
      },
      {
        label: 'D',
        value:
          'Fabry-related small-fiber and autonomic dysfunction impairing sweating (hypohidrosis)',
      },
    ],
    correctAnswer: 'D',
  },
  {
    number: 27,
    text: 'A patient with Fabry disease reaches end-stage kidney disease and receives a kidney transplant. Which statement is most accurate?',
    options: [
      {
        label: 'A',
        value:
          'The transplanted kidney is generally spared, but heart and brain disease continue to progress without disease-specific therapy',
      },
      {
        label: 'B',
        value:
          'The transplanted kidney rapidly develops Fabry nephropathy and fails within a year',
      },
      {
        label: 'C',
        value:
          'Transplantation cures Fabry disease by restoring systemic enzyme levels',
      },
      { label: 'D', value: 'Transplantation is contraindicated in Fabry disease' },
    ],
    correctAnswer: 'A',
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
