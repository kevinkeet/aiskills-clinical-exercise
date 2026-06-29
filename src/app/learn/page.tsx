'use client';

import { useMemo, useState } from 'react';
import {
  PATTERNS,
  SORT_ITEMS,
  REWRITES,
  PRINCIPLES,
  type Pattern,
  type Tier,
} from './data';

/* ------------------------------------------------------------------ */
/*  Small shared bits                                                  */
/* ------------------------------------------------------------------ */

const TIER_COLOR: Record<Tier, { text: string; bg: string; ring: string; dot: string; soft: string }> = {
  high: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-600',
    ring: 'ring-emerald-500',
    dot: 'bg-emerald-500',
    soft: 'bg-emerald-50 border-emerald-200',
  },
  low: {
    text: 'text-rose-700',
    bg: 'bg-rose-600',
    ring: 'ring-rose-500',
    dot: 'bg-rose-500',
    soft: 'bg-rose-50 border-rose-200',
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  1. Hero                                                            */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-border bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            'radial-gradient(60rem 30rem at 85% -10%, #dbeafe 0%, transparent 60%), radial-gradient(40rem 24rem at 0% 120%, #d1fae5 0%, transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <SectionLabel>Interactive module</SectionLabel>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Does AI help you{' '}
          <span className="text-muted line-through decoration-rose-400/70 decoration-2">finish</span>
          ,<br className="hidden sm:block" /> or help you{' '}
          <span className="text-primary">learn</span>?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
          A randomized study had people learn a brand-new skill — with AI and without it.
          The finishers and the learners used the <em>same</em> tool. What separated them was
          entirely in <strong>how they interacted with it.</strong> This module lets you feel
          that difference, then put it to work.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Stat value="≈17%" label="lower conceptual scores with AI" tone="rose" />
          <Stat value="~0" label="average speed-up from AI" tone="slate" />
          <Stat value="24 → 86%" label="range across how AI was used" tone="emerald" />
        </div>
        <p className="mt-8 text-xs text-muted">
          Based on Shen &amp; Tamkin, <em>How AI Impacts Skill Formation</em> (Anthropic, 2026).
          ~6&nbsp;min · interactive.
        </p>
      </div>
    </header>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'rose' | 'emerald' | 'slate';
}) {
  const map = {
    rose: 'border-rose-200 bg-rose-50 text-rose-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
  } as const;
  return (
    <div className={`rounded-lg border px-3 py-2 ${map[tone]}`}>
      <span className="font-bold tabular-nums">{value}</span>
      <span className="ml-2 opacity-80">{label}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  2. The core insight                                               */
/* ------------------------------------------------------------------ */

function CoreInsight() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <SectionLabel>The core insight</SectionLabel>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Two ways to hold the same tool
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-800">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-sm text-white">↑</span>
            Cognitive engagement
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-emerald-900/80">
            You stay in the driver’s seat: asking why, writing it yourself, checking your own
            understanding, fixing your own errors. The AI is a tutor and a sounding board.
          </p>
          <p className="mt-4 text-sm font-medium text-emerald-800">Skill is preserved. 65–86%.</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-rose-800">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-600 text-sm text-white">↓</span>
            Cognitive offloading
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-rose-900/80">
            You hand the thinking over: generate it, paste it, paste the error back, move on.
            You finish — sometimes faster — but the skill never forms.
          </p>
          <p className="mt-4 text-sm font-medium text-rose-800">Skill erodes. Under 40%.</p>
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Same model. Same task. The only variable is the conversation.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  3. Interactive scatter of the six patterns                        */
/* ------------------------------------------------------------------ */

function PatternExplorer() {
  const [active, setActive] = useState<Pattern>(PATTERNS[5]); // start on the top scorer

  // plot domain
  const xMin = 17,
    xMax = 33; // completion time (min)
  const yMin = 15,
    yMax = 92; // quiz score (%)
  const px = (t: number) => ((t - xMin) / (xMax - xMin)) * 100;
  const py = (s: number) => 100 - ((s - yMin) / (yMax - yMin)) * 100;

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <SectionLabel>The six patterns</SectionLabel>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Everyone got the same AI. Here’s where they landed.
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        Each point is a real cluster of learners from the study, plotted by how long they took
        and how well they understood the material afterward.{' '}
        <span className="font-medium text-foreground">Tap a point to see what they did.</span>
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Plot */}
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="relative aspect-[4/3] w-full">
            {/* axes */}
            <div className="absolute inset-0 rounded-lg border-l border-b border-slate-300" />
            {/* y label */}
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-medium uppercase tracking-wider text-muted">
              Understanding →
            </span>
            <span className="absolute bottom-[-1.4rem] left-1/2 -translate-x-1/2 text-[11px] font-medium uppercase tracking-wider text-muted">
              Completion time →
            </span>
            {/* 40% divider line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-slate-300"
              style={{ top: `${py(52)}%` }}
            >
              <span className="absolute right-0 -top-4 text-[10px] text-slate-400">
                learning preserved ↑ / eroded ↓
              </span>
            </div>

            {PATTERNS.map((p) => {
              const c = TIER_COLOR[p.tier];
              const isActive = active.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActive(p)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{ left: `${px(p.time)}%`, top: `${py(p.score)}%` }}
                  aria-label={`${p.name}, ${p.score}% score`}
                >
                  <span
                    className={`block rounded-full ${c.bg} transition-all ${
                      isActive
                        ? `h-6 w-6 ring-4 ${c.ring} ring-offset-2`
                        : 'h-4 w-4 opacity-70 group-hover:opacity-100 group-hover:scale-125'
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold tabular-nums ${
                      isActive ? c.text : 'text-transparent group-hover:text-slate-500'
                    }`}
                  >
                    {p.score}%
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-center gap-5 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> preserves learning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> erodes learning
            </span>
          </div>
        </div>

        {/* Detail card */}
        <PatternDetail pattern={active} />
      </div>
    </section>
  );
}

function PatternDetail({ pattern }: { pattern: Pattern }) {
  const c = TIER_COLOR[pattern.tier];
  return (
    <div className={`flex flex-col rounded-2xl border p-6 shadow-sm ${c.soft}`}>
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${c.bg}`}
        >
          {pattern.tier === 'high' ? 'Preserves learning' : 'Erodes learning'}
        </span>
        <span className="text-xs text-slate-500">n = {pattern.n}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight text-foreground">{pattern.name}</h3>
      <p className={`mt-1 text-sm font-medium italic ${c.text}`}>{pattern.tagline}</p>

      <div className="mt-5 flex gap-6">
        <div>
          <div className={`text-3xl font-bold tabular-nums ${c.text}`}>{pattern.score}%</div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">quiz score</div>
        </div>
        <div>
          <div className="text-3xl font-bold tabular-nums text-slate-700">{pattern.time}m</div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500">to finish</div>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-700">What they did</dt>
          <dd className="mt-0.5 text-slate-600">{pattern.what}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-700">Why it matters</dt>
          <dd className="mt-0.5 text-slate-600">{pattern.why}</dd>
        </div>
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  4. Sorter game                                                    */
/* ------------------------------------------------------------------ */

function Sorter() {
  const [answers, setAnswers] = useState<Record<string, Tier>>({});
  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => SORT_ITEMS.filter((it) => answers[it.id] === it.answer).length,
    [answers]
  );
  const done = answeredCount === SORT_ITEMS.length;

  function choose(id: string, tier: Tier) {
    setAnswers((a) => (a[id] ? a : { ...a, [id]: tier }));
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-6">
        <SectionLabel>Your turn</SectionLabel>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Skill-building, or skill-eroding?
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          These are real prompts people typed to the AI. For each one, decide whether the{' '}
          <em>approach</em> builds the learner’s skill or quietly offloads it.
        </p>

        <div className="mt-8 space-y-4">
          {SORT_ITEMS.map((item, i) => {
            const picked = answers[item.id];
            const isCorrect = picked === item.answer;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-slate-50/60 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <p className="text-[15px] leading-relaxed text-slate-800">{item.prompt}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 pl-9">
                  <ChoiceButton
                    label="Builds skill"
                    tone="high"
                    selected={picked === 'high'}
                    disabled={!!picked}
                    correct={item.answer === 'high'}
                    revealed={!!picked}
                    onClick={() => choose(item.id, 'high')}
                  />
                  <ChoiceButton
                    label="Erodes skill"
                    tone="low"
                    selected={picked === 'low'}
                    disabled={!!picked}
                    correct={item.answer === 'low'}
                    revealed={!!picked}
                    onClick={() => choose(item.id, 'low')}
                  />
                </div>

                {picked && (
                  <div className="mt-3 pl-9">
                    <p
                      className={`text-sm ${
                        isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      <span className="font-semibold">
                        {isCorrect ? '✓ ' : '✗ '}
                        {item.pattern}.
                      </span>{' '}
                      <span className="text-slate-600">{item.explain}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {done && (
          <div className="mt-6 rounded-xl border border-primary/30 bg-blue-50 p-5 text-center">
            <p className="text-lg font-semibold text-primary-dark">
              {correctCount} / {SORT_ITEMS.length} right.
            </p>
            <p className="mt-1 text-sm text-slate-600">
              The tell isn’t the topic — it’s whether you stay in the loop. Generation is fine{' '}
              <em>if</em> you also build understanding around it.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ChoiceButton({
  label,
  tone,
  selected,
  disabled,
  correct,
  revealed,
  onClick,
}: {
  label: string;
  tone: Tier;
  selected: boolean;
  disabled: boolean;
  correct: boolean;
  revealed: boolean;
  onClick: () => void;
}) {
  let cls =
    'rounded-lg border px-4 py-2 text-sm font-medium transition-colors ';
  if (!revealed) {
    cls +=
      tone === 'high'
        ? 'border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'
        : 'border-slate-300 text-slate-700 hover:border-rose-400 hover:bg-rose-50';
  } else if (correct) {
    // the right answer — always show green once revealed
    cls += 'border-emerald-500 bg-emerald-100 text-emerald-800';
  } else if (selected) {
    // chosen but wrong
    cls += 'border-rose-500 bg-rose-100 text-rose-800';
  } else {
    cls += 'border-slate-200 text-slate-400';
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cls}>
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  5. Prompt rewriter                                                */
/* ------------------------------------------------------------------ */

function Rewriter() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <SectionLabel>Make the swap</SectionLabel>
      <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        One clause turns a shortcut into a lesson
      </h2>
      <p className="mt-3 max-w-2xl text-slate-600">
        You rarely have to give up the AI’s help to keep the learning. Here are offloading
        prompts — reveal the engaged version of each.
      </p>

      <div className="mt-8 space-y-4">
        {REWRITES.map((r) => {
          const open = revealed[r.id];
          return (
            <div key={r.id} className="overflow-hidden rounded-xl border border-border bg-white">
              <div className="border-l-4 border-rose-400 bg-rose-50/50 p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                  {r.beforeLabel}
                </span>
                <p className="mt-1 text-slate-800">{r.before}</p>
              </div>

              {!open ? (
                <button
                  onClick={() => setRevealed((s) => ({ ...s, [r.id]: true }))}
                  className="w-full bg-slate-50 py-3 text-sm font-medium text-primary hover:bg-blue-50"
                >
                  ↓ Reveal the engaged version
                </button>
              ) : (
                <>
                  <div className="border-l-4 border-emerald-400 bg-emerald-50/50 p-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      {r.afterLabel}
                    </span>
                    <p className="mt-1 text-slate-800">{r.after}</p>
                  </div>
                  <p className="bg-white px-5 py-3 text-sm text-slate-500">{r.note}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  6. Playbook                                                       */
/* ------------------------------------------------------------------ */

function Playbook() {
  return (
    <section className="bg-slate-900 py-16 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
          The playbook
        </span>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Six ways to learn while you use AI
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.num} className="bg-slate-900 p-6">
              <span className="text-sm font-bold text-blue-400 tabular-nums">{p.num}</span>
              <h3 className="mt-2 text-base font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  7. Closing                                                        */
/* ------------------------------------------------------------------ */

function Closing() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        The goal isn’t to use AI less. It’s to stay in the loop.
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Productivity is not a shortcut to competence. When you’re building a new skill — especially
        one you’ll be trusted to supervise — let AI accelerate the thinking, not replace it.
      </p>
      <p className="mt-8 text-xs text-muted">
        Source: Judy Hanwen Shen &amp; Alex Tamkin, <em>How AI Impacts Skill Formation</em>,
        Anthropic (2026). Figures&nbsp;1, 11 and §6.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function LearnPage() {
  return (
    <main className="bg-background">
      <Hero />
      <CoreInsight />
      <PatternExplorer />
      <Sorter />
      <Rewriter />
      <Playbook />
      <Closing />
    </main>
  );
}
