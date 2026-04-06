export interface Task {
  number: number;
  title: string;
  prompt: string;
  minChars: number;
  showAdditionalFindings?: boolean;
}

export const tasks: Task[] = [
  {
    number: 1,
    title: 'Additional History',
    prompt:
      'This patient has progressive CKD of unclear etiology, chronic neuropathic pain, and several other symptoms. Fabry disease is suspected. Based on the information provided, what additional history questions would you want to ask? List at least 8 specific questions and briefly explain your reasoning for each.',
    minChars: 200,
  },
  {
    number: 2,
    title: 'Physical Examination',
    prompt:
      'Fabry disease is suspected. What physical exam maneuvers would be most important for this patient? For each, describe what specific finding you are looking for and why it would be relevant to the clinical picture.',
    minChars: 200,
  },
  {
    number: 3,
    title: 'Diagnostic Workup',
    prompt:
      'Fabry disease is the leading diagnosis. What laboratory tests, imaging, and other diagnostic studies would you order to confirm the diagnosis and assess for organ involvement? For each test, explain what you are looking for and how the result would change your management.',
    minChars: 200,
  },
  {
    number: 4,
    title: 'Assessment & Plan',
    prompt:
      'You are now provided with the following additional findings from the physical exam and diagnostic workup. The diagnosis of Fabry disease is confirmed. Using all available information, write a comprehensive Assessment and Plan as you would in a clinical note.',
    minChars: 500,
    showAdditionalFindings: true,
  },
  {
    number: 5,
    title: 'Patient Instructions',
    prompt:
      'Write after-visit patient instructions for Marcus Thompson. He has just been given the diagnosis of Fabry disease. Write at an 8th-grade reading level, use an empathetic tone, and cover: what the diagnosis means, next steps, medications, lifestyle modifications, warning signs to watch for, and family implications. Aim for approximately 1 page.',
    minChars: 400,
  },
];
