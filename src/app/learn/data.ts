// Content for the "Skill-Building AI Interaction" learning module.
//
// Source: Shen & Tamkin, "How AI Impacts Skill Formation" (Anthropic, Feb 2026)
// — the randomized study this module is built on. The six interaction patterns,
// quiz scores, and completion times below are taken from Figure 11 and §6 of
// that paper. The study measured a technical skill; the interaction patterns
// generalize to any skill acquired with AI, so the example prompts here are
// framed for a resident learning a clinical case.

export type Tier = 'high' | 'low';

export interface Pattern {
  id: string;
  name: string;
  tier: Tier;
  score: number; // mean quiz score %, from Fig 11
  time: number; // mean completion time (min), from Fig 11
  n: number; // participants in cluster
  tagline: string;
  what: string; // what these learners actually did
  why: string; // why it helped / hurt skill formation
}

// Ordered low → high so the "ladder" reads as a progression toward engagement.
export const PATTERNS: Pattern[] = [
  {
    id: 'verification',
    name: 'Iterative AI Verification',
    tier: 'low',
    score: 24,
    time: 31,
    n: 4,
    tagline: '“Is this read right? …and this? …and now?”',
    what:
      'Leaned on the AI to verify or correct each interpretation in turn (5–15 rounds) — confirming labs, the ECG, the next step — rather than reasoning to a conclusion themselves.',
    why:
      'Outsourcing judgment was the lowest-scoring pattern in the study — and not even fast, because every uncertainty became another round-trip instead of a moment of learning.',
  },
  {
    id: 'progressive',
    name: 'Progressive AI Reliance',
    tier: 'low',
    score: 35,
    time: 22,
    n: 4,
    tagline: '“I’ll just check one thing… okay, you take it from here.”',
    what:
      'Started out engaged — a question or two — then gradually handed the whole problem to the AI as the case got harder.',
    why:
      'The most seductive failure mode: it begins as genuine inquiry and slides into delegation exactly when the material gets hard enough to be worth learning.',
  },
  {
    id: 'delegation',
    name: 'AI Delegation',
    tier: 'low',
    score: 39,
    time: 19.5,
    n: 4,
    tagline: '“Just give me the diagnosis and the plan.”',
    what:
      'Only ever asked the AI for the answer — the differential, the workup, the plan — and adopted it wholesale, with no follow-up.',
    why:
      'The fastest group — and it shows on the test. You get a finished workup and learn almost nothing about how to reach one yourself.',
  },
  {
    id: 'conceptual',
    name: 'Conceptual Inquiry',
    tier: 'high',
    score: 65,
    time: 22,
    n: 7,
    tagline: '“Help me understand how to think about this.”',
    what:
      'Asked only conceptual questions — frameworks, mechanisms, the “why” — then reasoned to their own conclusions and worked through their own uncertainty.',
    why:
      'Hit plenty of dead ends — and reasoning through them is exactly where the learning happened. The fastest of the high-scoring patterns, and the most common one in the study.',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Answer-Explanation',
    tier: 'high',
    score: 68,
    time: 24,
    n: 3,
    tagline: '“Give me the answer — and the reasoning behind it.”',
    what:
      'Asked for the answer together with the reasoning that justified it, and actually read and engaged with the explanation.',
    why:
      'Pairs the efficiency of getting an answer with the understanding of working through why. Reading the reasoning took longer, but the comprehension stuck.',
  },
  {
    id: 'generation',
    name: 'Generation-Then-Comprehension',
    tier: 'high',
    score: 86,
    time: 24,
    n: 2,
    tagline: '“Got it — now test whether I actually understand it.”',
    what:
      'Let the AI lay out the answer, then asked follow-up questions specifically to check and deepen their own understanding of it.',
    why:
      'The highest score in the study. Looks almost identical to pure delegation — except they used the AI to interrogate their own understanding, not just to finish.',
  },
];

// Sorter game: classify each prompt by the approach it represents.
// Clinical prompts illustrating each pattern.
export interface SortItem {
  id: string;
  prompt: string;
  answer: Tier;
  pattern: string;
  explain: string;
}

export const SORT_ITEMS: SortItem[] = [
  {
    id: 's1',
    prompt:
      '“How should I frame my approach to a young patient with unexplained progressive kidney disease — what’s the right way to think about the differential?”',
    answer: 'high',
    pattern: 'Conceptual Inquiry',
    explain:
      'A conceptual question. You build a framework you can reuse on the next patient — and you still do the reasoning yourself.',
  },
  {
    id: 's2',
    prompt: '“Here’s the case. Just give me the diagnosis and the workup plan.”',
    answer: 'low',
    pattern: 'AI Delegation',
    explain:
      'Pure delegation. You get a finished plan and almost no understanding of why it’s the right one.',
  },
  {
    id: 's3',
    prompt:
      '“Here’s the ECG read I wrote — is it right? And these labs? And does my next step look correct?”',
    answer: 'low',
    pattern: 'Iterative AI Verification',
    explain:
      'Asking the AI to confirm each judgment skips the part where you’d actually develop the judgment yourself.',
  },
  {
    id: 's4',
    prompt:
      '“Give me a differential for this presentation, and explain the reasoning that links each diagnosis to the findings.”',
    answer: 'high',
    pattern: 'Hybrid Answer-Explanation',
    explain:
      'The answer paired with its reasoning. You get the differential and the “why” — as long as you read it.',
  },
  {
    id: 's5',
    prompt: '“Write the assessment and plan for this patient.”',
    answer: 'low',
    pattern: 'AI Delegation',
    explain:
      'A generate-and-paste request. Fast, but it teaches you nothing about how to build an A&P.',
  },
  {
    id: 's6',
    prompt:
      '“Here’s the management plan you suggested — quiz me on why each step is indicated, so I know I actually understand it.”',
    answer: 'high',
    pattern: 'Generation-Then-Comprehension',
    explain:
      'Turning the AI into a tutor for your own understanding. This was the highest-scoring approach in the study.',
  },
];

// Prompt-rewrite interaction: a delegation prompt → an engaged equivalent.
export interface RewritePair {
  id: string;
  before: string;
  beforeLabel: string;
  after: string;
  afterLabel: string;
  note: string;
}

export const REWRITES: RewritePair[] = [
  {
    id: 'r1',
    beforeLabel: 'Delegation',
    before: '“Give me the full differential and workup for this patient.”',
    afterLabel: 'Generation-then-comprehension',
    after:
      '“Give me the differential — then explain the reasoning for the top three, and ask me one question to check I follow it.”',
    note:
      'Same starting point, one extra clause. You still get the differential; now you also get the reasoning — and a check that it stuck.',
  },
  {
    id: 'r2',
    beforeLabel: 'Iterative verification',
    before: '“Is my ECG read right? Just tell me.”',
    afterLabel: 'Conceptual inquiry',
    after:
      '“What features should I be looking for on this ECG, and why do they matter here? I want to read it myself first.”',
    note:
      'Uncertainty is where skill forms. Learn what to look for, commit to your own read, then check it — that’s the moment it lands.',
  },
  {
    id: 'r3',
    beforeLabel: 'Progressive reliance',
    before: '“Just write the rest of the assessment and plan for me.”',
    afterLabel: 'Hybrid answer-explanation',
    after:
      '“Outline the key issues and explain the one I’m least sure about — I’ll write the plan and check back if I’m stuck.”',
    note:
      'Reliance creeps in when the case gets hard. Keep your hands on exactly the parts worth learning.',
  },
];

// Headline principles for the playbook section.
export interface Principle {
  num: string;
  title: string;
  body: string;
}

export const PRINCIPLES: Principle[] = [
  {
    num: '01',
    title: 'It’s not whether you use AI — it’s how.',
    body: 'The engaged patterns scored 65–86%. The reliant ones scored under 40%. Same tool, same case. The gap is entirely in the interaction.',
  },
  {
    num: '02',
    title: 'Get the answer, then comprehend it.',
    body: 'If the AI gives you the answer, make it explain the reasoning — and have it check your understanding. The highest scorers used AI to interrogate their own grasp, not just to finish.',
  },
  {
    num: '03',
    title: 'Work through your own uncertainty first.',
    body: 'The group without AI hit more dead ends — and learned more, because reasoning through difficulty is where skill forms. Don’t accept the answer and move on.',
  },
  {
    num: '04',
    title: 'Ask why, not just what.',
    body: 'Conceptual questions build a model you can reuse on the next patient. Answer-only requests build a note you’ll forget.',
  },
  {
    num: '05',
    title: 'Watch reliance creep.',
    body: 'Progressive reliance starts as honest inquiry and slides into delegation right when the case gets hard. Notice when you stop reasoning.',
  },
  {
    num: '06',
    title: 'Time saved isn’t skill gained.',
    body: 'On average AI use gave no real speed-up here — but it did lower conceptual understanding and independent reasoning. Finishing the workup is not the same as learning to do one.',
  },
];
