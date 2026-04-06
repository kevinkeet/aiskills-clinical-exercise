export const caseVignette = {
  chiefComplaint:
    '"My kidneys are getting worse and nobody can figure out why."',
  hpi: `Marcus Thompson is a 32-year-old male referred to the internal medicine clinic by his primary care physician for evaluation of progressive chronic kidney disease (CKD) of unclear etiology. His creatinine has risen from 1.2 mg/dL eighteen months ago to 1.8 mg/dL on his most recent lab work, with persistent proteinuria (urine protein-to-creatinine ratio 1.4 g/g). Standard workup including ANA, hepatitis serologies, HIV, and complements have been unremarkable.

On further questioning, he mentions that he has had "pain in his hands and feet on and off since he was a kid." He says multiple doctors have looked into it over the years without a clear answer. He was prescribed gabapentin a few years ago, which helps somewhat. He also reports intermittent episodes of abdominal pain and diarrhea every few weeks, previously attributed to irritable bowel syndrome.

Over the past year, he has noticed increasing fatigue and some shortness of breath when climbing stairs. He denies chest pain or leg swelling.

He mentions that his mother has "some kind of heart problem" and that a cousin on his mother's side is on dialysis, though he is unsure of the details.`,
  pmh: 'Chronic pain in hands/feet (diagnosed as "neuropathy, unclear etiology" at age 16), IBS, CKD stage 3a (diagnosed 18 months ago), corneal opacities noted on routine optometry visit',
  medications: 'Gabapentin 300 mg TID, omeprazole 20 mg daily, acetaminophen PRN',
  allergies: 'NKDA',
  socialHistory:
    'Graphic designer. Non-smoker. Occasional alcohol. No recreational drugs. Lives with girlfriend. Planning to start a family.',
  familyHistory:
    'Mother: "heart problem," age 58. Maternal cousin (male): on dialysis, age 28, cause unclear. Father: healthy, age 60. No known genetic diseases in the family.',
  ros: 'Positive: hand/foot pain (chronic), fatigue, exertional dyspnea, intermittent abdominal pain/diarrhea. Negative: no fevers, weight loss, hemoptysis, hematuria, joint swelling, rash (patient-reported).',
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
