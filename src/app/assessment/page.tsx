'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { questions, isMCQ } from '@/data/questions';

export default function AssessmentPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const [assessmentStartTime, setAssessmentStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const questionTimesRef = useRef<Record<number, number>>({});
  const questionStartRef = useRef<Date>(new Date());

  useEffect(() => {
    let cancelled = false;
    fetch('/api/session/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (!data?.authenticated) {
          router.push('/intake');
          return;
        }
        setParticipantId(data.participantId);
      })
      .catch(() => router.push('/intake'));
    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!assessmentStartTime) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - assessmentStartTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [assessmentStartTime]);

  function startAssessment() {
    setShowTransition(false);
    setAssessmentStartTime(new Date());
    questionStartRef.current = new Date();
  }

  function recordQuestionTime() {
    const qNum = questions[currentQuestion].number;
    const timeOnQuestion = Math.floor(
      (Date.now() - questionStartRef.current.getTime()) / 1000
    );
    questionTimesRef.current[qNum] =
      (questionTimesRef.current[qNum] || 0) + timeOnQuestion;
    questionStartRef.current = new Date();
  }

  function selectAnswer(questionNumber: number, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
    // Per-answer autosave: persist this single answer immediately so a
    // browser crash before "Submit Assessment" doesn't lose the response.
    // The submit-assessment endpoint upserts by (participant_id, question_number).
    fetch('/api/submit-assessment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: [
          {
            questionNumber,
            selectedAnswer: answer,
            timeSpentSeconds: questionTimesRef.current[questionNumber] || 0,
          },
        ],
      }),
    }).catch(() => {
      // Silent — final submit will retry the full set anyway.
    });
  }
  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      recordQuestionTime();
      setCurrentQuestion((prev) => prev + 1);
    }
  }
  function prevQuestion() {
    if (currentQuestion > 0) {
      recordQuestionTime();
      setCurrentQuestion((prev) => prev - 1);
    }
  }
  function goToQuestion(idx: number) {
    if (idx !== currentQuestion) {
      recordQuestionTime();
      setCurrentQuestion(idx);
    }
  }

  async function submitAssessment() {
    setSubmitting(true);
    recordQuestionTime();
    const totalTimeSeconds = assessmentStartTime
      ? Math.floor((Date.now() - assessmentStartTime.getTime()) / 1000)
      : 0;
    const answerArray = Object.entries(answers).map(([qNum, ans]) => ({
      questionNumber: parseInt(qNum, 10),
      selectedAnswer: ans,
      timeSpentSeconds: questionTimesRef.current[parseInt(qNum, 10)] || 0,
    }));
    try {
      await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerArray, totalTimeSeconds, final: true }),
      });
    } catch {
      // Continue even if save fails
    }
    router.push('/complete');
  }

  if (!participantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading…</div>
      </div>
    );
  }

  if (showTransition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-card rounded-xl shadow-lg border border-border p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Knowledge Assessment
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium">
              You have completed the clinical exercise. You will now complete a
              12-question knowledge assessment.
            </p>
            <p className="text-sm text-red-700 mt-2">
              You may <strong>NOT</strong> use any external resources for this section.
            </p>
          </div>
          <p className="text-sm text-muted mb-6">
            Each question is multiple choice. Answer to the best of your
            ability based on what you have learned.
          </p>
          <button
            onClick={startAssessment}
            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between">
        <h1 className="font-bold text-sm text-foreground">Knowledge Assessment</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-mono tabular-nums text-xs">
              {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
            No external resources allowed
          </div>
          <span className="text-xs text-muted">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
      </div>

      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex gap-1.5 justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => goToQuestion(i)}
              className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                i === currentQuestion
                  ? 'bg-primary text-white'
                  : answers[questions[i].number]
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-muted hover:bg-slate-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="text-xs text-muted mb-2 font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-5 leading-relaxed">
          {q.text}
        </h2>

        {isMCQ(q) ? (
          <div className="space-y-3">
            {q.options.map((option) => (
              <button
                key={option.label}
                onClick={() => selectAnswer(q.number, option.label)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all text-sm ${
                  answers[q.number] === option.label
                    ? 'border-primary bg-blue-50'
                    : 'border-border hover:border-muted'
                }`}
              >
                <span className="font-semibold mr-2">{option.label}.</span>
                {option.value}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-11 gap-1">
              {Array.from({ length: q.max - q.min + 1 }, (_, i) => q.min + i).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => selectAnswer(q.number, String(v))}
                  aria-pressed={answers[q.number] === String(v)}
                  aria-label={`Rating ${v}`}
                  className={`py-2 rounded-md border text-sm font-medium transition-colors ${
                    answers[q.number] === String(v)
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-blue-50'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            {(q.minLabel || q.maxLabel) && (
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>{q.minLabel ? `${q.min} — ${q.minLabel}` : ''}</span>
                <span>{q.maxLabel ? `${q.max} — ${q.maxLabel}` : ''}</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-sm text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submitAssessment}
              disabled={!allAnswered || submitting}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? 'Submitting...'
                : allAnswered
                ? 'Submit Assessment'
                : `Answer all questions (${answeredCount}/${questions.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
