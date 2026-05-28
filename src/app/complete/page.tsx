'use client';

import { useEffect, useState } from 'react';

interface ReviewItem {
  number: number;
  text: string;
  yourAnswer: string | null;
  yourAnswerText: string | null;
  correctAnswer: string;
  correctAnswerText: string | null;
  isCorrect: boolean;
}

interface Results {
  score: number;
  total: number;
  showKey: boolean;
  review: ReviewItem[] | null;
}

export default function CompletePage() {
  const [results, setResults] = useState<Results | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/my-results')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && typeof data.score === 'number') setResults(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const pct =
    results && results.total > 0
      ? Math.round((results.score / results.total) * 100)
      : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-xl shadow-lg border border-border p-8">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Exercise Complete
          </h1>
          <p className="text-sm text-muted mb-6 leading-relaxed">
            Thank you for completing the clinical case exercise and knowledge
            assessment. Your responses have been recorded.
          </p>
        </div>

        {/* Score */}
        {loaded && results && (
          <div className="bg-slate-50 border border-border rounded-lg p-5 mb-5 text-center">
            <div className="text-xs text-muted uppercase tracking-wide mb-1">
              Your knowledge assessment score
            </div>
            <div className="text-3xl font-bold text-foreground">
              {results.score} / {results.total}
              {pct !== null && (
                <span className="text-lg text-muted font-medium ml-2">
                  ({pct}%)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Answer review (pilots, or if globally enabled) */}
        {loaded && results?.showKey && results.review && (
          <div className="mb-5">
            <h2 className="font-semibold text-foreground mb-3">
              Answer review
            </h2>
            <div className="space-y-3">
              {results.review.map((item, idx) => (
                <div
                  key={item.number}
                  className={`rounded-lg border p-3 text-sm ${
                    item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/50'
                      : 'border-red-200 bg-red-50/50'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span
                      className={`text-xs font-bold mt-0.5 ${
                        item.isCorrect ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {item.isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="font-medium text-foreground">
                      {idx + 1}. {item.text}
                    </span>
                  </div>
                  <div className="ml-5 space-y-0.5 text-xs">
                    <div
                      className={
                        item.isCorrect ? 'text-emerald-800' : 'text-red-800'
                      }
                    >
                      Your answer:{' '}
                      {item.yourAnswer
                        ? `${item.yourAnswer}. ${item.yourAnswerText ?? ''}`
                        : '(no answer)'}
                    </div>
                    {!item.isCorrect && (
                      <div className="text-emerald-800">
                        Correct answer: {item.correctAnswer}.{' '}
                        {item.correctAnswerText ?? ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-50 rounded-lg p-4 text-sm text-foreground">
          <p>
            Your participation contributes to research on clinical case-based
            learning in Internal Medicine residency. Results will be reported
            only in de-identified, aggregate form.
          </p>
        </div>
        <p className="text-xs text-muted mt-6 text-center">
          You may now close this window.
        </p>
      </div>
    </div>
  );
}
