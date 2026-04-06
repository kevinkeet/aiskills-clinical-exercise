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
      { label: 'A', value: 'Sphingomyelin' },
      { label: 'B', value: 'Glucocerebroside' },
      { label: 'C', value: 'Globotriaosylceramide (Gb3/GL-3)' },
      { label: 'D', value: 'Ganglioside GM2' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 2,
    text: 'Fabry disease has two recognized clinical phenotypes. The "later-onset" (previously called "atypical") phenotype is characterized by:',
    options: [
      { label: 'A', value: 'Onset in infancy with severe neurodegeneration' },
      {
        label: 'B',
        value:
          'Predominant cardiac and/or renal involvement presenting in adulthood, often without the childhood pain or skin findings',
      },
      {
        label: 'C',
        value: 'Isolated corneal findings with no systemic disease',
      },
      {
        label: 'D',
        value: 'Only female carriers are affected in the later-onset form',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 3,
    text: 'A patient with Fabry disease undergoes nerve conduction studies (NCS) and EMG to evaluate their neuropathic pain. The most likely result is:',
    options: [
      {
        label: 'A',
        value: 'Severe demyelinating pattern with prolonged distal latencies',
      },
      { label: 'B', value: 'Axonal sensorimotor polyneuropathy' },
      {
        label: 'C',
        value:
          'Normal NCS/EMG, because Fabry affects small fibers that are not captured by standard electrodiagnostic testing',
      },
      { label: 'D', value: 'Asymmetric mononeuritis multiplex pattern' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 4,
    text: 'Cerebrovascular events in Fabry disease most commonly involve which vascular territory, and what is the predominant mechanism?',
    options: [
      {
        label: 'A',
        value: 'Anterior circulation; atherosclerotic plaque rupture',
      },
      {
        label: 'B',
        value:
          'Posterior (vertebrobasilar) circulation; endothelial Gb3 deposition causing vasculopathy and dolichoectasia',
      },
      {
        label: 'C',
        value:
          'Middle cerebral artery; cardioembolism from atrial fibrillation',
      },
      {
        label: 'D',
        value: 'Lacunar infarcts only; from chronic hypertension',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 5,
    text: 'On renal biopsy, the characteristic ultrastructural finding in Fabry disease on electron microscopy is:',
    options: [
      {
        label: 'A',
        value: 'Dense deposits along the glomerular basement membrane',
      },
      {
        label: 'B',
        value:
          'Lamellar myelin-like inclusions ("zebra bodies") within podocytes',
      },
      { label: 'C', value: "Crescent formation in Bowman's space" },
      {
        label: 'D',
        value:
          'Amyloid fibrils with apple-green birefringence on Congo red staining',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 6,
    text: 'Enzyme replacement therapy (ERT) with agalsidase beta for Fabry disease is administered:',
    options: [
      { label: 'A', value: 'Orally, once daily' },
      { label: 'B', value: 'Subcutaneously, once weekly' },
      {
        label: 'C',
        value:
          'Intravenously, every two weeks, typically requiring 2\u20134 hours per infusion',
      },
      { label: 'D', value: 'Intrathecally, once monthly' },
    ],
    correctAnswer: 'C',
  },
  {
    number: 7,
    text: 'Migalastat (Galafold) works by a fundamentally different mechanism than enzyme replacement therapy. Its mechanism is:',
    options: [
      {
        label: 'A',
        value:
          'It provides exogenous enzyme to replace the deficient alpha-galactosidase A',
      },
      {
        label: 'B',
        value:
          'It reduces production of Gb3 by inhibiting its synthesis (substrate reduction)',
      },
      {
        label: 'C',
        value:
          "It is a pharmacological chaperone that stabilizes the patient's own misfolded but partially functional GLA enzyme, improving its trafficking to lysosomes",
      },
      {
        label: 'D',
        value: 'It is a gene therapy that replaces the defective GLA gene',
      },
    ],
    correctAnswer: 'C',
  },
  {
    number: 8,
    text: 'Regarding female heterozygous carriers of Fabry disease, which statement is most accurate?',
    options: [
      {
        label: 'A',
        value:
          'They are uniformly asymptomatic because they have one functional X chromosome',
      },
      {
        label: 'B',
        value:
          'They can range from asymptomatic to severely affected due to random X-inactivation (lyonization), and approximately 70% develop some disease manifestations',
      },
      {
        label: 'C',
        value:
          'They only develop symptoms after menopause when estrogen levels decline',
      },
      {
        label: 'D',
        value: 'They are always as severely affected as hemizygous males',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 9,
    text: 'On cardiac MRI, which finding helps distinguish Fabry cardiomyopathy from hypertrophic cardiomyopathy (HCM) and other infiltrative diseases?',
    options: [
      {
        label: 'A',
        value: 'Diffusely increased native T1 values on T1 mapping',
      },
      {
        label: 'B',
        value:
          'Low (decreased) native T1 values on T1 mapping, reflecting intracellular lipid (Gb3) storage',
      },
      { label: 'C', value: 'Pericardial effusion' },
      { label: 'D', value: 'Right ventricular dilation' },
    ],
    correctAnswer: 'B',
  },
  {
    number: 10,
    text: 'In untreated males with classic Fabry disease, which of the following best describes the natural history?',
    options: [
      {
        label: 'A',
        value: 'The disease is self-limited and resolves after adolescence',
      },
      {
        label: 'B',
        value:
          'Acroparesthesias begin in childhood; progressive renal, cardiac, and cerebrovascular disease develop in the 3rd\u20135th decades; median life expectancy is reduced by approximately 15\u201320 years compared to the general population',
      },
      {
        label: 'C',
        value:
          'Only the kidneys are affected, and prognosis is determined solely by renal function',
      },
      {
        label: 'D',
        value:
          'Neurodegeneration with cognitive decline is the primary cause of death',
      },
    ],
    correctAnswer: 'B',
  },
  {
    number: 11,
    text: 'Why is enzyme activity testing alone INSUFFICIENT for diagnosing Fabry disease in females?',
    options: [
      { label: 'A', value: 'Females do not have the GLA gene' },
      {
        label: 'B',
        value:
          'Due to random X-inactivation, heterozygous females can have enzyme activity levels ranging from very low to completely normal, so a normal enzyme level does not rule out the disease',
      },
      {
        label: 'C',
        value: 'The enzyme assay is only validated for pediatric patients',
      },
      {
        label: 'D',
        value:
          'Females always have normal enzyme levels regardless of carrier status',
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
        value: 'Only after the patient reaches end-stage renal disease',
      },
      {
        label: 'B',
        value:
          'At or before the onset of clinically significant organ damage, because established fibrosis (renal or cardiac) is largely irreversible and responds poorly to treatment',
      },
      {
        label: 'C',
        value: 'Only in symptomatic males over age 40',
      },
      {
        label: 'D',
        value:
          'Treatment should be withheld until a clinical trial slot becomes available',
      },
    ],
    correctAnswer: 'B',
  },
];
