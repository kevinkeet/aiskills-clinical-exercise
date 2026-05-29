export const caseVignette = {
  chiefComplaint:
    '"My kidneys are getting worse and nobody can figure out why."',
  hpi: `Marcus Thompson is a 32-year-old man referred to the internal medicine clinic by his primary care physician for evaluation of progressive chronic kidney disease (CKD) of unclear etiology. His creatinine has risen from 1.2 mg/dL eighteen months ago to 1.8 mg/dL on his most recent labs, with persistent proteinuria (urine protein-to-creatinine ratio 1.4 g/g). He has no history of diabetes or hypertension, and a standard workup ordered by his primary care physician — including ANA, hepatitis serologies, HIV, and complement levels — has been unremarkable.

Notably, an ECG obtained during the workup showed left ventricular hypertrophy, which is unexpected in a normotensive 32-year-old. Because unexplained kidney disease together with unexplained cardiac hypertrophy in a young patient can point to a hereditary multisystem condition, his primary care physician raised the question of Fabry disease and referred him for evaluation.

He is otherwise healthy-appearing and frustrated that no one has been able to explain why a young person would be losing kidney function. The referral note contains little other history, so it is up to you to take a focused history during today's visit.`,
  pmh: 'CKD stage 3a, diagnosed 18 months ago. No other chronic medical conditions documented.',
  medications: 'Acetaminophen as needed. No other regular medications.',
  allergies: 'NKDA',
  socialHistory:
    'Graphic designer. Non-smoker. Occasional alcohol. No recreational drug use. Lives with his partner.',
  familyHistory:
    'Mother has an unspecified "heart condition" diagnosed in her 50s. A maternal uncle developed kidney failure requiring dialysis in his 40s. Father and his side of the family are healthy, with no father-to-son pattern of illness.',
  ros: 'Limited in the referral note. The patient denies fever and unintentional weight loss; other systems were not systematically reviewed.',
  vitals:
    'BP 138/88 mmHg, HR 78 bpm, RR 14, Temp 98.4\u00b0F, SpO2 98% on RA, BMI 24.1',
  labs: [
    { test: 'Creatinine', result: '1.8 mg/dL', reference: '0.7\u20131.3 mg/dL' },
    { test: 'eGFR', result: '48 mL/min/1.73m\u00b2', reference: '>60 mL/min/1.73m\u00b2' },
    { test: 'BUN', result: '28 mg/dL', reference: '7\u201320 mg/dL' },
    {
      test: 'Urine protein/creatinine ratio',
      result: '1.4 g/g',
      reference: '<0.2 g/g',
    },
    {
      test: 'Urinalysis',
      result: 'Protein 2+, no blood, no casts',
      reference: 'Negative',
    },
    { test: 'CBC', result: 'WNL', reference: '' },
    { test: 'CMP (remainder)', result: 'WNL except Cr above', reference: '' },
    { test: 'HbA1c', result: '5.2%', reference: '<5.7%' },
    { test: 'ANA', result: 'Negative', reference: 'Negative' },
    { test: 'Hepatitis B/C', result: 'Negative', reference: 'Negative' },
    { test: 'HIV', result: 'Negative', reference: 'Negative' },
    { test: 'Complement C3/C4', result: 'Normal', reference: '' },
    {
      test: 'Lipid panel',
      result: 'Total chol 198, LDL 118',
      reference: '',
    },
    {
      test: 'ECG',
      result: 'NSR, short PR interval (110 ms), LVH by voltage criteria',
      reference: '',
    },
  ],
};

/**
 * Plain-text version of the patient case suitable for pasting into the AI chat.
 * Optionally appends the new workup findings (revealed at Task 4).
 */
export function getCaseAsText(includeAdditionalFindings = false): string {
  const labs = caseVignette.labs
    .map((l) => `${l.test}: ${l.result}${l.reference ? ` (ref: ${l.reference})` : ''}`)
    .join('\n');
  const base = `Patient: Marcus Thompson, 32M — Suspected Fabry Disease

Chief Complaint: ${caseVignette.chiefComplaint}

HPI: ${caseVignette.hpi}

PMH: ${caseVignette.pmh}
Medications: ${caseVignette.medications}
Allergies: ${caseVignette.allergies}
Social History: ${caseVignette.socialHistory}
Family History: ${caseVignette.familyHistory}
ROS: ${caseVignette.ros}

Vitals: ${caseVignette.vitals}

Labs:
${labs}`;
  if (includeAdditionalFindings) {
    return `${base}\n\nNew Findings:\n${additionalFindings.replace(/\*\*/g, '')}`;
  }
  return base;
}

export const additionalFindings = `**Physical exam:** Clusters of small dark-red papules on lower abdomen, periumbilical area, and bilateral upper thighs. S4 gallop on cardiac auscultation. Decreased pinprick sensation in bilateral feet and hands with preserved vibration sense. Orthostatic vitals: BP drops from 138/88 sitting to 112/74 standing with HR increase 78 to 96.

**Ophthalmology consult:** Cornea verticillata (bilateral whorl-like corneal opacities) confirmed on slit-lamp exam. No visual impairment.

**Echocardiogram:** Concentric LVH (max wall thickness 13 mm), grade I diastolic dysfunction, LVEF 60%, mild mitral regurgitation.

**Alpha-galactosidase A activity:** 0.8 nmol/hr/mg protein (reference: 2.4\u201318.0) \u2014 markedly decreased.

**Plasma lyso-Gb3:** 42.8 ng/mL (reference: <1.8) \u2014 markedly elevated.

**GLA gene sequencing:** Hemizygous pathogenic variant c.644A>G (p.Asn215Ser) identified.

**Cardiac MRI:** Concentric LVH, late gadolinium enhancement in posterolateral wall, low native T1 values.

**Audiometry:** Mild bilateral high-frequency sensorineural hearing loss.

**Brain MRI:** Scattered T2/FLAIR white matter hyperintensities in periventricular distribution, no acute infarct.

**NT-proBNP:** 380 pg/mL (mildly elevated). **Troponin I:** 0.06 ng/mL (mildly elevated).`;
