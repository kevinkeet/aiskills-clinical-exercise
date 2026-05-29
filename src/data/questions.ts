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
      { label: 'A', value: 'Both parents unaffected, with approximately 25% of siblings affected regardless of sex' },
      { label: 'B', value: 'Affected maternal uncles and male cousins, with no father-to-son transmission' },
      { label: 'C', value: 'Affected men in multiple generations on the father’s side, including father-to-son transmission' },
      { label: 'D', value: 'No family history of similar symptoms in any relative' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 3,
    text: 'A patient with this disease has a long-standing diagnosis of irritable bowel syndrome with episodic abdominal pain and diarrhea. This gastrointestinal pattern is most likely:',
    options: [
      { label: 'A', value: 'A coincidental functional bowel disorder unrelated to the underlying disease' },
      { label: 'B', value: 'An adverse effect of the chronic neuropathic-pain medications he takes' },
      { label: 'C', value: 'A direct gastrointestinal manifestation of the disease, often predating its diagnosis' },
      { label: 'D', value: 'A sign of mesenteric ischemia from vascular involvement, warranting urgent mesenteric angiography' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 4,
    text: 'On physical examination, which of the following dermatologic findings would most strongly support this diagnosis?',
    options: [
      { label: 'A', value: 'Erythematous, silvery-scaled plaques on the extensor surfaces of the elbows and knees' },
      { label: 'B', value: 'Clusters of small, dark-red papules over the lower abdomen, groin, and upper thighs' },
      { label: 'C', value: 'Hyperpigmented, velvety thickened patches in the axillae and the posterior neck folds' },
      { label: 'D', value: 'Firm yellow-orange nodules overlying the Achilles and the extensor tendons of the hands' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 5,
    text: 'Cornea verticillata (bilateral whorl-like opacities of the corneal epithelium) is observed on slit-lamp examination. Which of the following is true about this finding?',
    options: [
      { label: 'A', value: 'It is pathognomonic for this disease and reliably excludes all other diagnoses' },
      { label: 'B', value: 'It typically causes progressive visual loss that requires corneal transplantation' },
      { label: 'C', value: 'It also occurs with chronic amiodarone, chloroquine, or hydroxychloroquine therapy' },
      { label: 'D', value: 'It is usually markedly asymmetric, affecting only one eye in the majority of patients' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 6,
    text: 'Sensory examination of a patient with this disease typically shows:',
    options: [
      { label: 'A', value: 'Reduced pinprick and temperature sensation distally, with preserved vibration sense' },
      { label: 'B', value: 'Reduced vibration and proprioception in the feet, with preserved pinprick and temperature' },
      { label: 'C', value: 'A patchy, asymmetric sensory deficit consistent with a mononeuritis multiplex pattern' },
      { label: 'D', value: 'A symmetric \'stocking-glove\' loss of all sensory modalities with absent ankle reflexes' },
    ],
    correctAnswer: 'A',
  },
  {
    number: 7,
    text: 'For a male patient with clinical suspicion of this disease, the most appropriate initial confirmatory test is:',
    options: [
      { label: 'A', value: 'Renal biopsy with electron microscopy looking for lamellated inclusion bodies' },
      { label: 'B', value: 'Whole-exome sequencing performed on a peripheral blood sample' },
      { label: 'C', value: 'Serum protein electrophoresis with immunofixation' },
      { label: 'D', value: 'Plasma or leukocyte alpha-galactosidase A enzyme activity assay' },
    ],
    correctAnswer: 'D',
  },
  {
    number: 8,
    text: 'The patient’s 35-year-old sister is being evaluated as a possible carrier. Her plasma alpha-galactosidase A activity is reported as normal. The most appropriate interpretation is:',
    options: [
      { label: 'A', value: 'Send GLA gene sequencing, because enzyme activity is unreliable in carrier females' },
      { label: 'B', value: 'She is definitively unaffected and requires no further evaluation or genetic testing' },
      { label: 'C', value: 'Her diagnosis is confirmed; the normal enzyme activity reflects compensatory pathways' },
      { label: 'D', value: 'She has a 50% chance of carrying it and should defer testing until she is symptomatic' },
    ],
    correctAnswer: 'A',
  },
  {
    number: 9,
    text: 'Which of the following ECG findings is characteristic of cardiac involvement in this disease, particularly in earlier stages?',
    options: [
      { label: 'A', value: 'A prolonged QTc interval with marked T-wave inversion' },
      { label: 'B', value: 'Right bundle branch block with marked right axis deviation' },
      { label: 'C', value: 'Pathologic Q waves in the inferior and lateral leads' },
      { label: 'D', value: 'A short PR interval, often less than 120 milliseconds' },
    ],
    correctAnswer: 'D',
  },
  {
    number: 10,
    text: 'Migalastat (Galafold) for this disease:',
    options: [
      { label: 'A', value: 'Is an oral substrate reduction therapy that inhibits the enzyme glucosylceramide synthase' },
      { label: 'B', value: 'Is a pharmacologic chaperone that works only in patients with \'amenable\' GLA mutations' },
      { label: 'C', value: 'Is given intravenously every two weeks alongside standard enzyme replacement therapy' },
      { label: 'D', value: 'Is curative when it is combined with hematopoietic stem-cell transplantation early on' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 11,
    text: 'In a patient with this disease, stage 3 CKD, and persistent proteinuria, a cornerstone of renal protection — independent of disease-specific therapy — is:',
    options: [
      { label: 'A', value: 'A high-dose loop diuretic such as furosemide to control chronic fluid overload' },
      { label: 'B', value: 'Chronic empiric oral corticosteroids to slow progressive glomerular injury over time' },
      { label: 'C', value: 'An ACE inhibitor or angiotensin receptor blocker titrated to reduce proteinuria' },
      { label: 'D', value: 'A calcineurin inhibitor such as tacrolimus to suppress ongoing glomerular inflammation' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 12,
    text: 'You are counseling a male patient with this disease about implications for his future children. Which of the following statements is most accurate?',
    options: [
      { label: 'A', value: 'Each of his children, regardless of sex, has a 50% chance of inheriting the mutation' },
      { label: 'B', value: 'Only his sons are at risk; his daughters cannot inherit the mutation' },
      { label: 'C', value: 'None of his children are at increased risk because the disease typically arises de novo' },
      { label: 'D', value: 'All of his daughters will inherit the mutation; none of his sons will inherit it' },
    ],
    correctAnswer: 'D',
  },
  {
    number: 15,
    text: 'The neuropathic pain experienced in Fabry disease is most directly related to:',
    options: [
      { label: 'A', value: 'Deposition of glycosphingolipids within small nerve fibers' },
      { label: 'B', value: 'Immune-mediated demyelination of the peripheral sensory nerves' },
      { label: 'C', value: 'Entrapment and compression neuropathy from soft-tissue edema' },
      { label: 'D', value: 'Autoimmune small-vessel vasculitis affecting the peripheral nerves' },
    ],
    correctAnswer: 'A',
  },
  {
    number: 16,
    text: 'Which mechanism most likely explains the development of left ventricular hypertrophy in Fabry disease?',
    options: [
      { label: 'A', value: 'Chronic, poorly controlled systemic arterial hypertension' },
      { label: 'B', value: 'Coronary vasospasm causing recurrent ischemia and fibrosis' },
      { label: 'C', value: 'Recurrent viral myocarditis with inflammatory remodeling' },
      { label: 'D', value: 'Glycosphingolipid accumulation within the cardiomyocytes' },
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
      { label: 'A', value: 'Reverse all of the organ damage that has already accumulated' },
      { label: 'B', value: 'Eliminate the risk of transmitting the disease to offspring' },
      { label: 'C', value: 'Prevent irreversible organ fibrosis and loss of function' },
      { label: 'D', value: 'Restore a normal life expectancy in essentially all patients' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 22,
    text: 'Which patient presentation should most strongly prompt consideration of Fabry disease?',
    options: [
      { label: 'A', value: 'Young man with proteinuric CKD, lifelong burning pain in the hands and feet, and a maternal uncle on dialysis' },
      { label: 'B', value: 'Young woman with proteinuria, a photosensitive facial rash, and inflammatory polyarthralgia of the hands' },
      { label: 'C', value: 'Young man with persistent hematuria, progressive sensorineural hearing loss, and a family history of kidney failure' },
      { label: 'D', value: 'Young adult with episodic flank pain, gross hematuria, and numerous bilateral renal cysts seen on imaging' },
    ],
    correctAnswer: 'A',
  },
  {
    number: 23,
    text: 'Beyond left ventricular hypertrophy, which of the following is another characteristic cardiac manifestation of Fabry disease?',
    options: [
      { label: 'A', value: 'Recurrent paroxysmal supraventricular tachycardia arising from a congenital accessory pathway' },
      { label: 'B', value: 'Progressive conduction disease and arrhythmias, such as AV block and atrial fibrillation' },
      { label: 'C', value: 'Congenital long-QT syndrome that predisposes the patient to torsades de pointes' },
      { label: 'D', value: 'Pulmonary arterial hypertension that leads to progressive right heart failure' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 24,
    text: 'In a patient on enzyme replacement therapy for Fabry disease, which blood test best reflects biochemical disease activity and treatment response over time?',
    options: [
      { label: 'A', value: 'Plasma globotriaosylceramide (Gb3) concentration' },
      { label: 'B', value: 'Plasma globotriaosylsphingosine (lyso-Gb3)' },
      { label: 'C', value: 'Leukocyte alpha-galactosidase A enzyme activity' },
      { label: 'D', value: 'A 24-hour urine protein-to-creatinine ratio' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 25,
    text: 'Patients with Fabry disease are at markedly increased risk of stroke, often at a young age. Which stroke pattern is most characteristic?',
    options: [
      { label: 'A', value: 'Large-artery cardioembolic stroke as the single predominant mechanism' },
      { label: 'B', value: 'Lobar intracerebral hemorrhage caused by underlying cerebral amyloid angiopathy' },
      { label: 'C', value: 'Small-vessel ischemic stroke with a predilection for the posterior circulation' },
      { label: 'D', value: 'Subarachnoid hemorrhage from the rupture of a berry (saccular) aneurysm in the circle of Willis' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 26,
    text: 'A young man with Fabry disease reports that he cannot tolerate hot weather or exercise and rarely sweats. The most likely explanation is:',
    options: [
      { label: 'A', value: 'An anticholinergic adverse effect of one of his current medications' },
      { label: 'B', value: 'Primary hypothalamic thermoregulatory dysfunction of central origin' },
      { label: 'C', value: 'Physical deconditioning and reduced cardiac output from his cardiomyopathy' },
      { label: 'D', value: 'Fabry-related small-fiber and autonomic dysfunction that impairs sweating' },
    ],
    correctAnswer: 'D',
  },
  {
    number: 27,
    text: 'A patient with Fabry disease reaches end-stage kidney disease and receives a kidney transplant. Which statement is most accurate?',
    options: [
      { label: 'A', value: 'The graft is largely spared, but cardiac and cerebrovascular disease keep progressing' },
      { label: 'B', value: 'The graft re-accumulates glycosphingolipid and predictably fails within the first year' },
      { label: 'C', value: 'Transplantation corrects the enzyme deficiency systemically and halts disease elsewhere' },
      { label: 'D', value: 'A living related-donor graft is strongly preferred because relatives resist recurrence' },
    ],
    correctAnswer: 'A',
  },
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
