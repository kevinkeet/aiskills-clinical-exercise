export interface Question {
  number: number;
  text: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
}

export const questions: Question[] = [
  {
    number: 1,
    text: 'What is the primary substrate that accumulates in Fabry disease due to alpha-galactosidase A deficiency?',
    options: [
      {
        label: 'A',
        value:
          'Sphingomyelin, a phospholipid component of cell membranes and myelin sheaths',
      },
      {
        label: 'B',
        value:
          'Glucocerebroside (glucosylceramide), a glycosphingolipid found in macrophage cell membranes',
      },
      {
        label: 'C',
        value:
          'Ganglioside GM2, a complex glycosphingolipid concentrated in neuronal cell membranes',
      },
      {
        label: 'D',
        value:
          'Globotriaosylceramide (Gb3/GL-3), a glycosphingolipid that deposits in vascular endothelium and visceral organs',
      },
    ],
    correctAnswer: 'D',
  },
  {
    number: 2,
    text: 'Fabry disease has two recognized clinical phenotypes. The "later-onset" (previously called "atypical") phenotype is characterized by:',
    options: [
      {
        label: 'A',
        value:
          'Predominant cardiac and/or renal involvement presenting in adulthood, often without the childhood pain or skin findings',
      },
      {
        label: 'B',
        value:
          'Onset in infancy with severe neurodegeneration and progressive loss of motor and cognitive milestones by age 2\u20133',
      },
      {
        label: 'C',
        value:
          'Isolated corneal verticillata and mild acroparesthesias with no progression to renal or cardiac disease throughout life',
      },
      {
        label: 'D',
        value:
          'Exclusive manifestation in female carriers due to skewed X-inactivation favoring the mutant allele in later decades',
      },
    ],
    correctAnswer: 'A',
  },
  {
    number: 3,
    text: 'A patient with Fabry disease undergoes nerve conduction studies (NCS) and EMG to evaluate their neuropathic pain. The most likely result is:',
    options: [
      {
        label: 'A',
        value:
          'Severe demyelinating pattern with prolonged distal latencies and conduction block, consistent with an inflammatory neuropathy',
      },
      {
        label: 'B',
        value:
          'Length-dependent axonal sensorimotor polyneuropathy with reduced amplitudes in distal nerves and denervation on EMG',
      },
      {
        label: 'C',
        value:
          'Normal NCS/EMG results, because Fabry neuropathy affects small unmyelinated fibers not captured by standard electrodiagnostic testing',
      },
      {
        label: 'D',
        value:
          'Asymmetric mononeuritis multiplex pattern with focal conduction abnormalities across multiple individual nerve territories',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 4,
    text: 'Cerebrovascular events in Fabry disease most commonly involve which vascular territory, and what is the predominant mechanism?',
    options: [
      {
        label: 'A',
        value:
          'Anterior cerebral artery territory; vasospasm triggered by autonomic dysfunction and endothelial Gb3 accumulation',
      },
      {
        label: 'B',
        value:
          'Middle cerebral artery territory; cardioembolism from Fabry-related atrial fibrillation and left atrial enlargement',
      },
      {
        label: 'C',
        value:
          'Posterior (vertebrobasilar) circulation; endothelial Gb3 deposition causing progressive vasculopathy and dolichoectasia',
      },
      {
        label: 'D',
        value:
          'Penetrating arterioles diffusely; chronic hypertension from renal disease leading to widespread lacunar infarctions',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 5,
    text: 'On renal biopsy, the characteristic ultrastructural finding in Fabry disease on electron microscopy is:',
    options: [
      {
        label: 'A',
        value:
          'Subepithelial electron-dense deposits along the glomerular basement membrane with a "spike and dome" pattern',
      },
      {
        label: 'B',
        value:
          'Randomly arranged fibrils measuring 8\u201312 nm in diameter within the mesangium, showing apple-green birefringence on Congo red',
      },
      {
        label: 'C',
        value:
          'Lamellar myelin-like inclusions ("zebra bodies") within podocytes, tubular epithelial cells, and endothelial cells',
      },
      {
        label: 'D',
        value:
          'Diffuse foot process effacement with no immune deposits, consistent with a podocytopathy such as minimal change disease',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 6,
    text: 'Enzyme replacement therapy (ERT) with agalsidase beta for Fabry disease is administered by which route and schedule?',
    options: [
      {
        label: 'A',
        value:
          'Subcutaneous injection at 1 mg/kg once weekly, self-administered at home after initial training period',
      },
      {
        label: 'B',
        value:
          'Intravenous infusion at 1 mg/kg every two weeks, typically requiring 2\u20134 hours per session',
      },
      {
        label: 'C',
        value:
          'Oral capsule at 150 mg every other day, taken on an empty stomach with specific dietary restrictions',
      },
      {
        label: 'D',
        value:
          'Intramuscular injection at 0.5 mg/kg once monthly, administered in clinic with 30-minute observation afterward',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 7,
    text: 'Migalastat (Galafold) works by a fundamentally different mechanism than enzyme replacement therapy. Its mechanism is:',
    options: [
      {
        label: 'A',
        value:
          'It inhibits glucosylceramide synthase to reduce upstream production of Gb3, thereby decreasing substrate accumulation in tissues',
      },
      {
        label: 'B',
        value:
          'It is a pharmacological chaperone that binds to and stabilizes the patient\u2019s own misfolded GLA enzyme, improving its trafficking to lysosomes',
      },
      {
        label: 'C',
        value:
          'It delivers a functional copy of the GLA gene via an adeno-associated virus vector, enabling endogenous enzyme production in hepatocytes',
      },
      {
        label: 'D',
        value:
          'It provides recombinant alpha-galactosidase A produced in a mammalian cell line, supplementing the deficient enzyme directly',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 8,
    text: 'Regarding female heterozygous carriers of Fabry disease, which statement is most accurate?',
    options: [
      {
        label: 'A',
        value:
          'They are uniformly asymptomatic throughout life because the normal X chromosome provides sufficient enzyme activity for all tissues',
      },
      {
        label: 'B',
        value:
          'They develop symptoms only after menopause when declining estrogen leads to reduced GLA enzyme transcription and late-onset disease',
      },
      {
        label: 'C',
        value:
          'They can range from asymptomatic to severely affected due to random X-inactivation (lyonization), and approximately 70% develop some manifestations',
      },
      {
        label: 'D',
        value:
          'They are always as severely affected as hemizygous males because the GLA gene escapes X-inactivation and both alleles are expressed',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 9,
    text: 'On cardiac MRI, which finding helps distinguish Fabry cardiomyopathy from hypertrophic cardiomyopathy (HCM) and other infiltrative diseases?',
    options: [
      {
        label: 'A',
        value:
          'Diffusely increased native T1 values on parametric mapping, reflecting expansion of the extracellular space by protein deposition',
      },
      {
        label: 'B',
        value:
          'Low (decreased) native T1 values on parametric mapping, reflecting intracellular glycosphingolipid (Gb3) storage within cardiomyocytes',
      },
      {
        label: 'C',
        value:
          'Asymmetric septal hypertrophy with systolic anterior motion of the mitral valve and dynamic outflow tract obstruction on cine imaging',
      },
      {
        label: 'D',
        value:
          'Diffuse subendocardial late gadolinium enhancement with associated circumferential pericardial effusion and restrictive filling pattern',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 10,
    text: 'In untreated males with classic Fabry disease, which of the following best describes the natural history?',
    options: [
      {
        label: 'A',
        value:
          'Acroparesthesias begin in childhood; progressive renal, cardiac, and cerebrovascular disease develop in the 3rd\u20135th decades, reducing life expectancy by 15\u201320 years',
      },
      {
        label: 'B',
        value:
          'The disease presents with isolated renal failure in the 4th decade; cardiac and neurological complications are rare if dialysis is initiated promptly',
      },
      {
        label: 'C',
        value:
          'Symptoms are limited to episodic pain crises in childhood and adolescence that spontaneously resolve by early adulthood without organ damage',
      },
      {
        label: 'D',
        value:
          'Progressive neurodegeneration beginning in adolescence leads to cognitive decline and dementia as the primary cause of morbidity and mortality',
      },
    ],
    correctAnswer: 'A',
  },
  {
    number: 11,
    text: 'Why is enzyme activity testing alone INSUFFICIENT for diagnosing Fabry disease in females?',
    options: [
      {
        label: 'A',
        value:
          'The standard leukocyte enzyme assay has poor sensitivity in all patients and requires confirmation with plasma lyso-Gb3 regardless of sex',
      },
      {
        label: 'B',
        value:
          'Due to random X-inactivation, heterozygous females can have enzyme levels ranging from very low to completely normal, so a normal result does not rule out the disease',
      },
      {
        label: 'C',
        value:
          'Estrogen and progesterone interfere with the fluorometric enzyme assay, producing falsely elevated activity levels in premenopausal women',
      },
      {
        label: 'D',
        value:
          'Females produce a different isoform of alpha-galactosidase A that is catalytically active but unable to degrade Gb3 in vivo',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 12,
    text: 'Current expert consensus recommends initiating Fabry-specific therapy (ERT or chaperone) at which point?',
    options: [
      {
        label: 'A',
        value:
          'At or before the onset of clinically significant organ damage, because established fibrosis is largely irreversible and responds poorly to treatment',
      },
      {
        label: 'B',
        value:
          'Only after GFR falls below 30 mL/min, because earlier treatment has not demonstrated benefit in randomized controlled trials',
      },
      {
        label: 'C',
        value:
          'After confirming disease progression with serial biomarkers over a minimum 2-year observation period to avoid treating non-progressive variants',
      },
      {
        label: 'D',
        value:
          'Only in males with the classic phenotype and confirmed null mutations, as later-onset variants do not benefit from enzyme replacement',
      },
    ],
    correctAnswer: 'A',
  },
];
