// Content for the "Skill-Building AI Interaction" learning module.
//
// Source: Shen & Tamkin, "How AI Impacts Skill Formation" (Anthropic, Feb 2026)
// — the randomized study this module is built on. The six interaction patterns,
// quiz scores, and completion times below are taken from Figure 11 and §6 of
// that paper. Example queries are from Table 3.

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
    id: 'debugging',
    name: 'Iterative AI Debugging',
    tier: 'low',
    score: 24,
    time: 31,
    n: 4,
    tagline: '“Here’s my error — fix it.”',
    what:
      'Repeatedly asked the AI to troubleshoot or verify their code (5–15 queries), often pasting error messages straight in rather than reading them.',
    why:
      'Leaning on AI to debug skips the single richest moment for learning. The lowest scores in the whole study — and not even fast, because every error became another round-trip.',
  },
  {
    id: 'progressive',
    name: 'Progressive AI Reliance',
    tier: 'low',
    score: 35,
    time: 22,
    n: 4,
    tagline: '“I’ll just ask one thing… okay, do the rest.”',
    what:
      'Started out engaged — a question or two — then gradually handed all the code-writing to the AI as the task got harder.',
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
    tagline: '“Write this for me.”',
    what:
      'Only ever asked the AI to generate code, then pasted it in as the answer. No explanations, no follow-ups.',
    why:
      'The fastest group — and it shows on the quiz. Productivity without comprehension. You finish the task and learn almost nothing about how it works.',
  },
  {
    id: 'conceptual',
    name: 'Conceptual Inquiry',
    tier: 'high',
    score: 65,
    time: 22,
    n: 7,
    tagline: '“Help me understand how this works.”',
    what:
      'Asked only conceptual questions, then wrote the code themselves and resolved their own errors independently.',
    why:
      'Hit plenty of errors — and fixing them is exactly where the learning happened. The fastest of the high-scoring patterns, and the most common one in the study.',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Code-Explanation',
    tier: 'high',
    score: 68,
    time: 24,
    n: 3,
    tagline: '“Write it — and explain what you wrote.”',
    what:
      'Composed queries that asked for generated code together with an explanation of that code, and actually read the explanations.',
    why:
      'Pairs the speed of generation with the understanding of explanation. Reading the “why” took longer, but the comprehension stuck.',
  },
  {
    id: 'generation',
    name: 'Generation-Then-Comprehension',
    tier: 'high',
    score: 86,
    time: 24,
    n: 2,
    tagline: '“Got it — now quiz my understanding.”',
    what:
      'Let the AI generate the code, then asked follow-up questions specifically to check and deepen their own understanding of it.',
    why:
      'The highest score in the study. Looks almost identical to pure Delegation — except they used the AI to interrogate their own understanding, not just to finish.',
  },
];

// Sorter game: classify each real prompt by the approach it represents.
// Queries adapted from Table 3 of the paper.
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
    prompt: '“Can you remind me what the different async operations are, and when I’d use each?”',
    answer: 'high',
    pattern: 'Conceptual Inquiry',
    explain:
      'A conceptual question. You build a mental model you can reuse — and you still write the code yourself.',
  },
  {
    id: 's2',
    prompt: '“Given these instructions, can you implement the missing parts of main.py?”',
    answer: 'low',
    pattern: 'AI Delegation',
    explain:
      'Pure delegation. You get a working file and almost no understanding of why it works.',
  },
  {
    id: 's3',
    prompt:
      '“Traceback (most recent call last)… NotImplementedError. I’m getting this — what’s wrong?”',
    answer: 'low',
    pattern: 'Iterative AI Debugging',
    explain:
      'Pasting the error for the AI to fix skips the part where you’d actually learn the concept the error is pointing at.',
  },
  {
    id: 's4',
    prompt:
      '“Write the timer function, and walk me through how the await keyword behaves here.”',
    answer: 'high',
    pattern: 'Hybrid Code-Explanation',
    explain:
      'Generation paired with explanation. You get the code and the reasoning — as long as you read it.',
  },
  {
    id: 's5',
    prompt: '“Complete get_user_data.”',
    answer: 'low',
    pattern: 'AI Delegation',
    explain:
      'A terse generate-and-paste request. Fast, but it teaches you nothing about the library.',
  },
  {
    id: 's6',
    prompt:
      '“Here’s the function you generated — can you ask me a couple of questions to check I actually understand it?”',
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
    before: '“Write the function that retrieves a record and handles a missing-record error.”',
    afterLabel: 'Generation-then-comprehension',
    after:
      '“Write that function — then explain how the error handling works, and ask me one question to check I’ve got it.”',
    note:
      'Same starting point, one extra clause. You still get the code; now you also get the understanding — and a check that it stuck.',
  },
  {
    id: 'r2',
    beforeLabel: 'Iterative debugging',
    before: '“I’m getting a RuntimeWarning, fix my code.”',
    afterLabel: 'Conceptual inquiry',
    after:
      '“What does a RuntimeWarning about a coroutine usually mean? I want to find the bug myself.”',
    note:
      'Errors are where skill forms. Ask what the error means, then fix it yourself — that’s the moment the concept lands.',
  },
  {
    id: 'r3',
    beforeLabel: 'Progressive reliance',
    before: '“Just do the rest of the task for me.”',
    afterLabel: 'Hybrid code-explanation',
    after:
      '“Sketch the approach for the rest and explain the key idea — I’ll write it and check back if I’m stuck.”',
    note:
      'Reliance creeps in when the work gets hard. Keep your hands on the keyboard for exactly the parts worth learning.',
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
    body: 'The engaged patterns scored 65–86%. The reliant ones scored under 40%. Same tool, same task. The gap is entirely in the interaction.',
  },
  {
    num: '02',
    title: 'Generate, then comprehend.',
    body: 'If the AI writes it, make it explain it — and have it check your understanding. The highest scorers used AI to interrogate their own grasp, not just to finish.',
  },
  {
    num: '03',
    title: 'Resolve your own errors first.',
    body: 'The control group hit more errors — and learned more, because fixing them is where skill forms. Don’t paste the traceback and move on.',
  },
  {
    num: '04',
    title: 'Ask why, not just what.',
    body: 'Conceptual questions build a model you can reuse. Generate-only requests build a file you’ll forget.',
  },
  {
    num: '05',
    title: 'Watch reliance creep.',
    body: 'Progressive reliance starts as honest inquiry and slides into delegation right when the material gets hard. Notice when you stop typing.',
  },
  {
    num: '06',
    title: 'Time saved isn’t skill gained.',
    body: 'On average AI use gave no real speed-up here — but it did lower conceptual understanding, code-reading, and debugging. Finishing is not learning.',
  },
];
