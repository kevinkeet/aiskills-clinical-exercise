/**
 * Intake content. The consent text is IRB-approved verbatim copy
 * (Stanford IRB-86737). Any edit requires a protocol amendment.
 */

export const PAGE_TITLE = 'Clinical Case-Based Learning in Internal Medicine Residency';
export const TAB_TITLE = 'Clinical Case-Based Learning Study';
export const IRB_LINE = 'Stanford University | Exempt Research Information Sheet | IRB# 86737';
export const ESTIMATED_TIME = '30 to 45 minutes';

/**
 * Verbatim IRB-approved Information Sheet. Each entry is one section.
 * Section labels are bolded; body is rendered as paragraphs.
 * DO NOT EDIT without an IRB protocol amendment.
 */
export const CONSENT_SECTIONS: ReadonlyArray<{ label: string; body: string }> = [
  {
    label: 'DESCRIPTION',
    body:
      'You are invited to participate in a research study about how Internal Medicine residents work through clinical case-based exercises. You will be asked to complete a brief background survey, work through an online clinical case-based exercise, and then answer some questions about the case. You will be randomly assigned to one of two conditions that determines which digital resource is available to you during the case-based exercise; no external resources may be used during the questions that follow. Your written responses, the time you take, and your interactions with the assigned resource will be recorded for research purposes. Participation in this research is voluntary, and you are free to withdraw your consent at any time.',
  },
  {
    label: 'TIME INVOLVEMENT',
    body: 'Your participation will take approximately 30 to 45 minutes.',
  },
  {
    label: 'PAYMENTS',
    body:
      'You will receive $100 as payment for your participation, disbursed through the Stanford Department of Medicine after you complete the full session.',
  },
  {
    label: 'PRIVACY AND CONFIDENTIALITY',
    body:
      'The risks associated with this study are minimal and are limited to the time burden of participation and the small risk of a confidentiality breach of your responses and resource-use records. Study data will be stored securely, in compliance with Stanford University standards, minimizing the risk of confidentiality breach. Your individual privacy will be maintained during the research and in all published and written data resulting from the study; only de-identified, aggregate results will be reported.',
  },
];

export const CONTACT_BLOCK = {
  questionsLabel: 'Questions:',
  questionsBody:
    'If you have any questions, concerns or complaints about this research, its procedures, risks and benefits, contact the Protocol Director, Kevin Keet, MD, at kkeet@stanford.edu.',
  independentLabel: 'Independent Contact:',
  independentBody:
    'If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at 650-723-5244 or toll free at 1-866-680-2906. You can also write to the Stanford IRB at irbeducation@stanford.edu.',
};

export const PRINT_REMINDER = 'Please save or print a copy of this page for your records.';

export const CONSENT_CHECKBOX_LABEL =
  'I have read the information above and agree to participate in this research.';

// --- Step 3: Demographics ---

export type DemographicField =
  | { key: 'pgy'; label: string; type: 'radio'; options: { value: string; label: string }[] }
  | { key: 'track'; label: string; type: 'radio'; options: { value: string; label: string }[] }
  | { key: 'medSchoolGradYear'; label: string; type: 'numberYear'; min: number; max: number }
  | { key: 'sex'; label: string; type: 'radio'; options: { value: string; label: string }[] }
  | {
      key: 'priorAiUseFrequency';
      label: string;
      type: 'radio';
      options: { value: string; label: string }[];
    };

export const DEMOGRAPHIC_FIELDS = (currentYear: number): DemographicField[] => [
  {
    key: 'pgy',
    label: 'Post-graduate year',
    type: 'radio',
    options: [
      { value: 'PGY-1', label: 'PGY-1' },
      { value: 'PGY-2', label: 'PGY-2' },
      { value: 'PGY-3', label: 'PGY-3' },
    ],
  },
  {
    key: 'track',
    label: 'Residency track',
    type: 'radio',
    options: [
      { value: 'Categorical Internal Medicine', label: 'Categorical Internal Medicine' },
      { value: 'Preliminary Medicine', label: 'Preliminary Medicine' },
    ],
  },
  {
    key: 'medSchoolGradYear',
    label: 'Year of medical school graduation',
    type: 'numberYear',
    min: 2015,
    max: currentYear,
  },
  {
    key: 'sex',
    label: 'Sex',
    type: 'radio',
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' },
      { value: 'Prefer not to say', label: 'Prefer not to say' },
    ],
  },
  {
    key: 'priorAiUseFrequency',
    label:
      'How often do you currently use a generative AI tool (e.g., a chatbot or large language model) for clinical questions in your training?',
    type: 'radio',
    options: [
      { value: 'Never', label: 'Never' },
      { value: 'Less than once a month', label: 'Less than once a month' },
      { value: 'A few times a month', label: 'A few times a month' },
      { value: 'A few times a week', label: 'A few times a week' },
      { value: 'Daily or more', label: 'Daily or more' },
    ],
  },
];

// --- Step 4: Self-rated familiarity ---

export const FAMILIARITY_CONDITIONS = [
  'Fabry disease',
  'IgA nephropathy',
  'Sarcoidosis',
  'Light-chain (AL) amyloidosis',
] as const;

export const FAMILIARITY_SCALE: ReadonlyArray<{ value: number; label: string }> = [
  { value: 1, label: 'Not at all familiar' },
  { value: 2, label: 'Slightly familiar' },
  { value: 3, label: 'Moderately familiar' },
  { value: 4, label: 'Very familiar' },
  { value: 5, label: 'Expert' },
];

export const CONFIDENCE_SCALE: ReadonlyArray<{ value: number; label: string }> = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
];

// Sub-items intentionally name the focus condition since the question must.
// This is the only place the word "Fabry" appears on the intake page.
export const FABRY_SUBITEMS: ReadonlyArray<{
  key: string;
  label: string;
  type: 'likert5' | 'yesno';
}> = [
  { key: 'inheritancePattern', label: 'I can describe the inheritance pattern.', type: 'likert5' },
  {
    key: 'organSystems',
    label: 'I can list at least three organ systems involved.',
    type: 'likert5',
  },
  {
    key: 'diseaseSpecificTherapy',
    label: 'I can name a disease-specific therapy.',
    type: 'likert5',
  },
  {
    key: 'everSeenPatient',
    label: 'I have ever cared for or seen a patient with this condition.',
    type: 'yesno',
  },
];

/**
 * Deterministic seeded order for the four conditions, keyed by participantId.
 * Uses a tiny xmur3 hash + mulberry32 PRNG so the same participantId always
 * sees the same order across visits.
 */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffledConditionsForParticipant(participantId: string): string[] {
  const seedFn = xmur3(participantId || 'unknown');
  const rng = mulberry32(seedFn());
  const arr = FAMILIARITY_CONDITIONS.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
