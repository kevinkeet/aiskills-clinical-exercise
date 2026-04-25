'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tasks } from '@/data/tasks';
import { additionalFindings } from '@/data/case';
import CasePanel from '@/components/CasePanel';
import ChatSidebar from '@/components/ChatSidebar';
import UpToDateSidebar from '@/components/UpToDateSidebar';
import ProgressBar from '@/components/ProgressBar';
import Timer from '@/components/Timer';

type Arm = 'AI' | 'CONTROL';

export default function ExercisePage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');
  const [arm, setArm] = useState<Arm | ''>('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [taskStartTime, setTaskStartTime] = useState<Date>(new Date());
  const [exerciseStartTime] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [findingsCopied, setFindingsCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  // Resolve arm from server-side session cookie. Never trust client storage.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/session/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (!data?.authenticated || !data.intakeComplete) {
          router.push('/intake');
          return;
        }
        setParticipantId(data.participantId);
        setArm(data.arm);
        const savedTask = sessionStorage.getItem('currentTask');
        let resumeIdx = 0;
        if (savedTask) {
          const taskIdx = parseInt(savedTask, 10) - 1;
          if (taskIdx >= 0 && taskIdx < tasks.length) {
            setCurrentTaskIndex(taskIdx);
            resumeIdx = taskIdx;
          }
        }
        // Restore any draft from localStorage (per participant + task)
        const draftKey = `taskDraft:${data.participantId}:${tasks[resumeIdx].number}`;
        const draft = localStorage.getItem(draftKey);
        if (draft) setResponse(draft);
        setTaskStartTime(new Date());
        setLoading(false);
      })
      .catch(() => router.push('/intake'));
    return () => {
      cancelled = true;
    };
  }, [router]);

  const task = tasks[currentTaskIndex];

  const submitTask = useCallback(async () => {
    if (!task) return;
    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - taskStartTime.getTime()) / 1000);

    try {
      await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskNumber: task.number,
          response,
          timeSpentSeconds: timeSpent,
          startedAt: taskStartTime.toISOString(),
        }),
      });
    } catch {
      // Continue even if save fails - don't block participant
    }

    // Clear the draft for the task we just submitted.
    if (typeof window !== 'undefined' && participantId) {
      try {
        localStorage.removeItem(`taskDraft:${participantId}:${task.number}`);
      } catch {
        // ignore
      }
    }

    if (currentTaskIndex < tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      sessionStorage.setItem('currentTask', String(nextIndex + 1));
      // Load draft for the next task if any.
      let nextDraft = '';
      if (typeof window !== 'undefined' && participantId) {
        try {
          nextDraft =
            localStorage.getItem(
              `taskDraft:${participantId}:${tasks[nextIndex].number}`
            ) ?? '';
        } catch {
          nextDraft = '';
        }
      }
      setResponse(nextDraft);
      setTaskStartTime(new Date());
    } else {
      sessionStorage.setItem('currentTask', 'assessment');
      router.push('/assessment');
    }

    setSubmitting(false);
  }, [task, response, taskStartTime, currentTaskIndex, router, participantId]);

  if (loading || !participantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading…</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-sm text-foreground">
            Clinical Case Exercise
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Timer startTime={exerciseStartTime} label="Total" />
          <Timer startTime={taskStartTime} label="Task" />
          <div className="w-48">
            <ProgressBar current={currentTaskIndex + 1} total={tasks.length} />
          </div>
        </div>
      </div>

      {/* Neutral guidance banner — does not name the resource */}
      <div className="px-4 py-2 text-xs font-medium bg-slate-50 text-foreground border-b border-border">
        You may use the resource panel on the right to help with Tasks 1&ndash;5. Do
        NOT use any external resources for the Knowledge Assessment that follows.
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel: Case + Task */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <CasePanel defaultOpen={currentTaskIndex === 0} />

          <div className="flex-1 overflow-y-auto p-5">
            <div className="max-w-3xl">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Task {task.number}: {task.title}
              </h2>

              {task.showAdditionalFindings && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-amber-800 text-sm">
                      Additional Findings
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          additionalFindings.replace(/\*\*/g, '')
                        );
                        setFindingsCopied(true);
                        setTimeout(() => setFindingsCopied(false), 2000);
                      }}
                      className="text-xs text-amber-600 hover:text-amber-800 px-1.5 py-0.5 rounded hover:bg-amber-100 transition-colors"
                      title="Copy findings to clipboard"
                    >
                      {findingsCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-sm text-amber-900 findings-box whitespace-pre-line">
                    {additionalFindings.split('\n\n').map((para, i) => (
                      <p key={i} className="mb-2">
                        {para.split('**').map((segment, j) =>
                          j % 2 === 1 ? (
                            <strong key={j}>{segment}</strong>
                          ) : (
                            <span key={j}>{segment}</span>
                          )
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {task.prompt}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(task.prompt);
                      setPromptCopied(true);
                      setTimeout(() => setPromptCopied(false), 2000);
                    }}
                    className="flex-shrink-0 text-xs text-blue-500 hover:text-blue-700 px-1.5 py-0.5 rounded hover:bg-blue-100 transition-colors"
                    title="Copy prompt to clipboard"
                  >
                    {promptCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <textarea
                value={response}
                onChange={(e) => {
                  const v = e.target.value;
                  setResponse(v);
                  // Per-keystroke localStorage save so a browser crash doesn't
                  // lose the draft. Cleared on submit.
                  if (typeof window !== 'undefined' && participantId) {
                    try {
                      localStorage.setItem(
                        `taskDraft:${participantId}:${task.number}`,
                        v
                      );
                    } catch {
                      // localStorage may be unavailable in private mode; ignore.
                    }
                  }
                }}
                placeholder="Type your response here..."
                className="w-full h-64 px-4 py-3 border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary leading-relaxed"
              />

              <div className="flex items-center justify-end mt-3">
                <button
                  onClick={submitTask}
                  disabled={submitting}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? 'Submitting...'
                    : currentTaskIndex < tasks.length - 1
                    ? 'Submit & Continue'
                    : 'Submit & Go to Assessment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar: arm-determined; never labelled by arm name */}
        <div className="w-96 flex-shrink-0 hidden lg:flex flex-col">
          {arm === 'AI' ? (
            <ChatSidebar participantId={participantId} taskNumber={task.number} />
          ) : (
            <UpToDateSidebar />
          )}
        </div>
      </div>
    </div>
  );
}
