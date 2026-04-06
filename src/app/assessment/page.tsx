'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';

export default function AssessmentPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    const pid = sessionStorage.getItem('participantId');
    if (!pid) {
      router.push('/');
      return;
    }
    setParticipantId(pid);
  }, [router]);

  function selectAnswer(questionNumber: number, answer: string) {
    setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  }

  function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }

  async function submitAssessment() {
    setSubmitting(true);

    const answerArray = Object.entries(answers).map(([qNum, ans]) => ({
      questionNumber: parseInt(qNum),
      selectedAnswer: ans,
    }));

    try {
      await fetch('/api/submit-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          answers: answerArray,
        }),
      });
    } catch {
      // Continue even if save fails
    }

    router.push('/complete');
  }

  if (!participantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
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
              You may <strong>NOT</strong> use any external resources (including
              AI tools or UpToDate) for this section.
            </p>
          </div>
          <p className="text-sm text-muted mb-6">
            Each question is multiple choice. Answer to the best of your
            ability based on what you have learned.
          </p>
          <button
            onClick={() => setShowTransition(false)}
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

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between">
        <h1 className="font-bold text-sm text-foreground">
          Knowledge Assessment
        </h1>
        <div className="flex items-center gap-3">
          <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
            No external resources allowed
          </div>
          <span className="text-xs text-muted">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex gap-1.5 justify-center">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
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

      {/* Question */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-xs text-muted mb-2 font-medium">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-5 leading-relaxed">
          {q.text}
        </h2>

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
