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
  | { key: 'medSchoolGradYear'; label: string; type: 'numberYear'; min: number; max: number };

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
];

// --- Step 4: Clinical comfort (single 0-10 question) ---
//
// Same wording is reused as the post-test comfort item (Q13 of the
// assessment) so the change in self-rated comfort can be measured.

export const COMFORT_QUESTION_TEXT =
  'How comfortable would you be taking care of a patient with Fabry disease?';

export const COMFORT_SCALE_MIN = 0;
export const COMFORT_SCALE_MAX = 10;
export const COMFORT_SCALE_MIN_LABEL = 'Not at all comfortable';
export const COMFORT_SCALE_MAX_LABEL = 'Very comfortable';
