'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');
  const [group, setGroup] = useState<'ai' | 'control' | ''>('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!participantId.trim()) {
      setError('Please enter your participant ID.');
      return;
    }
    if (!group) {
      setError('Please select your group assignment.');
      return;
    }
    if (!consent) {
      setError('Please acknowledge the consent statement to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          participantId: participantId.trim(),
          group,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('participantId', participantId.trim());
      sessionStorage.setItem('group', group);
      sessionStorage.setItem('currentTask', '1');
      sessionStorage.setItem(
        'taskStartTime',
        new Date().toISOString()
      );

      router.push('/exercise');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-card rounded-xl shadow-lg border border-border p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            AI-Assisted Learning in Clinical Medicine
          </h1>
          <p className="text-muted text-lg">
            Clinical Case Exercise &amp; Knowledge Assessment: Fabry Disease
          </p>
          <div className="mt-3 inline-block bg-blue-50 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            Estimated Time: 60&ndash;90 minutes
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-5 mb-6 text-sm text-foreground leading-relaxed">
          <p className="mb-3">
            You will work through a clinical case involving a patient with
            suspected <strong>Fabry disease</strong>, a rare lysosomal storage
            disorder presenting with progressive chronic kidney disease and
            multi-organ involvement. The exercise includes{' '}
            <strong>6 clinical tasks</strong> followed by a{' '}
            <strong>12-question knowledge assessment</strong>.
          </p>
          <p className="mb-3">
            Depending on your group assignment, you will have access to either
            an AI assistant or UpToDate to help with the clinical tasks. You may{' '}
            <strong>not</strong> use any external resources during the knowledge
            assessment.
          </p>
          <p>
            Your responses are timed and recorded for research purposes. Please
            work through each task carefully and thoroughly.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="participantId"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              Participant ID
            </label>
            <input
              id="participantId"
              type="text"
              value={participantId}
              onChange={(e) => setParticipantId(e.target.value)}
              placeholder="Enter your assigned participant ID"
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">
              Group Assignment
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGroup('ai')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  group === 'ai'
                    ? 'border-primary bg-blue-50'
                    : 'border-border hover:border-muted'
                }`}
              >
                <div className="font-semibold text-sm">AI Group</div>
                <div className="text-xs text-muted mt-1">
                  AI chat assistant for Tasks 1&ndash;6
                </div>
              </button>
              <button
                type="button"
                onClick={() => setGroup('control')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  group === 'control'
                    ? 'border-primary bg-blue-50'
                    : 'border-border hover:border-muted'
                }`}
              >
                <div className="font-semibold text-sm">Control Group</div>
                <div className="text-xs text-muted mt-1">
                  UpToDate access for Tasks 1&ndash;6
                </div>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary rounded border-border"
            />
            <label htmlFor="consent" className="text-sm text-foreground">
              I understand that my responses will be recorded and used for
              research purposes. I agree to participate in this clinical case
              exercise and knowledge assessment.
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Starting...' : 'Begin Exercise'}
          </button>
        </div>
      </div>
    </div>
  );
}
