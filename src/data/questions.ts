export interface Question {
  number: number;
  text: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
}

export const questions: Question[] = [
  // --- HISTORY TAKING (Questions 1-3, relates to Task 1) ---
  {
    number: 1,
    text: 'A 32-year-old male with progressive CKD of unclear etiology reports burning pain in his hands and feet since childhood. Which historical feature would most strongly support suspecting Fabry disease over other causes of small fiber neuropathy?',
    options: [
      {
        label: 'A',
        value:
          'The pain worsens with cold exposure and improves with warming of the extremities',
      },
      {
        label: 'B',
        value:
          'The pain is triggered or worsened by febrile illness, exercise, or heat exposure',
      },
      {
        label: 'C',
        value:
          'The pain follows a dermatomal distribution and is associated with vesicular skin lesions',
      },
      {
        label: 'D',
        value:
          'The pain began after age 30 and is associated with impaired fasting glucose levels',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 2,
    text: 'When taking a family history from a patient with suspected Fabry disease, which pattern of inheritance should raise your suspicion?',
    options: [
      {
        label: 'A',
        value:
          'Father-to-son transmission with no affected females in the family',
      },
      {
        label: 'B',
        value:
          'Affected maternal relatives (males and some females) with no male-to-male transmission',
      },
      {
        label: 'C',
        value:
          'Both parents are unaffected carriers and 25% of siblings are affected regardless of sex',
      },
      {
        label: 'D',
        value:
          'Spontaneous new mutation in the patient with no family history expected in the vast majority of cases',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 3,
    text: 'Which gastrointestinal symptom pattern in the history is characteristic of Fabry disease and often leads to misdiagnosis?',
    options: [
      {
        label: 'A',
        value:
          'Progressive dysphagia and weight loss due to esophageal glycolipid deposition',
      },
      {
        label: 'B',
        value:
          'Recurrent postprandial abdominal pain, diarrhea, and nausea frequently diagnosed as irritable bowel syndrome',
      },
      {
        label: 'C',
        value:
          'Chronic constipation and megacolon from autonomic ganglion cell destruction',
      },
      {
        label: 'D',
        value:
          'Recurrent pancreatitis from glycosphingolipid deposition in the pancreatic duct',
      },
    ],
    correctAnswer: 'B',
  },

  // --- PHYSICAL EXAM (Questions 4-6, relates to Task 2) ---
  {
    number: 4,
    text: 'During a physical exam of a patient with suspected Fabry disease, you observe clusters of small dark-red papules on the lower abdomen, periumbilical area, and upper thighs. These lesions are most likely:',
    options: [
      {
        label: 'A',
        value:
          'Cherry angiomas, which are benign vascular proliferations common in adults over age 30',
      },
      {
        label: 'B',
        value:
          'Angiokeratomas, which result from glycolipid deposition in dermal vessel walls causing vascular ectasia',
      },
      {
        label: 'C',
        value:
          'Petechiae from thrombocytopenia secondary to splenic sequestration and bone marrow infiltration',
      },
      {
        label: 'D',
        value:
          'Eruptive xanthomas from hypertriglyceridemia associated with nephrotic-range proteinuria',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 5,
    text: 'Cornea verticillata found on slit-lamp examination in a patient with suspected Fabry disease is characterized by:',
    options: [
      {
        label: 'A',
        value:
          'Brown copper deposits in the peripheral Descemet membrane forming a ring-like pattern',
      },
      {
        label: 'B',
        value:
          'Bilateral whorl-like (vortex) corneal opacities in the epithelium that typically do not impair vision',
      },
      {
        label: 'C',
        value:
          'Central corneal clouding with progressive visual loss requiring early corneal transplantation',
      },
      {
        label: 'D',
        value:
          'Band-shaped calcification deposits across the central cornea at the level of Bowman layer',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 6,
    text: 'Which cardiovascular finding on physical examination is most consistent with the cardiac involvement seen in Fabry disease?',
    options: [
      {
        label: 'A',
        value:
          'Wide fixed splitting of S2 with a right ventricular heave suggesting an atrial septal defect',
      },
      {
        label: 'B',
        value:
          'An S4 gallop reflecting decreased ventricular compliance from concentric left ventricular hypertrophy',
      },
      {
        label: 'C',
        value:
          'A loud holosystolic murmur at the apex radiating to the axilla from severe mitral valve prolapse',
      },
      {
        label: 'D',
        value:
          'A pericardial friction rub with distant heart sounds from constrictive pericarditis',
      },
    ],
    correctAnswer: 'B',
  },

  // --- DIAGNOSTIC WORKUP & TREATMENT (Questions 7-9, relates to Tasks 3-4) ---
  {
    number: 7,
    text: 'Which initial diagnostic test is most appropriate for confirming Fabry disease in a male patient?',
    options: [
      {
        label: 'A',
        value:
          'Renal biopsy with electron microscopy to identify characteristic lamellar inclusion bodies',
      },
      {
        label: 'B',
        value:
          'Measurement of alpha-galactosidase A enzyme activity in leukocytes or plasma',
      },
      {
        label: 'C',
        value:
          'Plasma lyso-Gb3 level, which is the most sensitive and specific single test in both sexes',
      },
      {
        label: 'D',
        value:
          'GLA gene sequencing, since enzyme activity levels can be normal in males with later-onset variants',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 8,
    text: 'A patient with confirmed Fabry disease has concentric left ventricular hypertrophy on echocardiography. On cardiac MRI, which finding helps distinguish Fabry cardiomyopathy from other causes of LVH?',
    options: [
      {
        label: 'A',
        value:
          'Low native T1 values on parametric mapping, reflecting intracellular glycosphingolipid accumulation within cardiomyocytes',
      },
      {
        label: 'B',
        value:
          'Diffusely elevated native T1 values, reflecting myocardial edema and extracellular expansion from fibrosis',
      },
      {
        label: 'C',
        value:
          'Asymmetric septal hypertrophy with systolic anterior motion of the mitral valve on cine imaging',
      },
      {
        label: 'D',
        value:
          'Diffuse subendocardial late gadolinium enhancement in a circumferential pattern with pericardial effusion',
      },
    ],
    correctAnswer: 'A',
  },
  {
    number: 9,
    text: 'When developing a treatment plan for a patient with Fabry disease and stage 3 CKD, which adjunctive medication is a cornerstone of renal protection regardless of whether the patient receives disease-specific therapy?',
    options: [
      {
        label: 'A',
        value:
          'A calcineurin inhibitor such as tacrolimus to reduce proteinuria through afferent arteriole vasoconstriction',
      },
      {
        label: 'B',
        value:
          'An ACE inhibitor or ARB titrated to maximize reduction of proteinuria and control blood pressure',
      },
      {
        label: 'C',
        value:
          'A high-dose statin regardless of lipid levels to stabilize renal endothelial glycocalyx function',
      },
      {
        label: 'D',
        value:
          'Low-dose aspirin to prevent glomerular microthrombosis from endothelial glycolipid deposition',
      },
    ],
    correctAnswer: 'B',
  },

  // --- PATIENT EDUCATION & LIFESTYLE (Questions 10-12, relates to Task 5) ---
  {
    number: 10,
    text: 'When counseling a patient newly diagnosed with Fabry disease about family implications, which statement is most accurate?',
    options: [
      {
        label: 'A',
        value:
          'All of the patient\'s daughters will inherit the GLA mutation, but none of his sons will be affected',
      },
      {
        label: 'B',
        value:
          'Each of the patient\'s children has a 50% chance of inheriting the mutation regardless of sex',
      },
      {
        label: 'C',
        value:
          'Only the patient\'s sons are at risk since the condition follows autosomal dominant inheritance',
      },
      {
        label: 'D',
        value:
          'There is a 25% chance of having an affected child, and genetic testing of siblings is not necessary',
      },
    ],
    correctAnswer: 'A',
  },
  {
    number: 11,
    text: 'Which lifestyle recommendation is most appropriate for a patient with Fabry disease who experiences acroparesthesias triggered by physical activity?',
    options: [
      {
        label: 'A',
        value:
          'Strict avoidance of all exercise to prevent pain crises and reduce cardiac workload',
      },
      {
        label: 'B',
        value:
          'Continue regular moderate exercise but avoid overheating, stay well-hydrated, and use cooling strategies',
      },
      {
        label: 'C',
        value:
          'Switch to exclusively high-intensity interval training, which has been shown to reduce neuropathic pain episodes',
      },
      {
        label: 'D',
        value:
          'Exercise only in heated pools, as warmth improves peripheral blood flow and reduces small fiber neuropathy symptoms',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 12,
    text: 'A patient with Fabry disease asks what warning signs should prompt them to seek immediate medical attention. Which of the following is most important to emphasize?',
    options: [
      {
        label: 'A',
        value:
          'Sudden severe headache, facial drooping, speech difficulty, or limb weakness, as Fabry patients have increased stroke risk particularly in the posterior circulation',
      },
      {
        label: 'B',
        value:
          'Worsening of chronic hand and foot pain during a mild febrile illness, as this suggests disease progression requiring therapy adjustment',
      },
      {
        label: 'C',
        value:
          'Development of new angiokeratomas on the trunk, as rapid appearance of new skin lesions correlates with acute organ damage',
      },
      {
        label: 'D',
        value:
          'Any episode of diarrhea or abdominal pain, since bowel ischemia from mesenteric vasculopathy is a common emergency in Fabry disease',
      },
    ],
    correctAnswer: 'A',
  },
];
