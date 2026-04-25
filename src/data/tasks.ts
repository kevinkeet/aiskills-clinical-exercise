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
      'This patient has progressive CKD of unclear etiology, chronic neuropathic pain, and several other symptoms. Fabry disease is suspected. Based on the information provided, what additional history questions would you want to ask, and briefly explain your reasoning for each.',
    minChars: 200,
  },
  {
    number: 2,
    title: 'Physical Examination',
    prompt:
      'What physical exam maneuvers would be important for this patient and why?',
    minChars: 200,
  },
  {
    number: 3,
    title: 'Diagnostic Workup',
    prompt:
      'What laboratory tests, imaging, and other diagnostic studies would you order and why?',
    minChars: 200,
  },
  {
    number: 4,
    title: 'Next Steps in Management',
    prompt:
      'New findings from the physical exam and diagnostic workup have been added to the patient case panel above. The diagnosis of Fabry disease is confirmed. What would be your next steps in management?',
    minChars: 500,
    showAdditionalFindings: true,
  },
  {
    number: 5,
    title: 'Patient Instructions',
    prompt:
      'Write after-visit patient instructions for this patient with newly diagnosed Fabry disease.',
    minChars: 400,
  },
];
