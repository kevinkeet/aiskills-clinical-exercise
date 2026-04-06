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

export default function ExercisePage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');
  const [group, setGroup] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [taskStartTime, setTaskStartTime] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [charWarning, setCharWarning] = useState('');

  useEffect(() => {
    const pid = sessionStorage.getItem('participantId');
    const grp = sessionStorage.getItem('group');
    const savedTask = sessionStorage.getItem('currentTask');

    if (!pid || !grp) {
      router.push('/');
      return;
    }

    setParticipantId(pid);
    setGroup(grp);

    if (savedTask) {
      const taskIdx = parseInt(savedTask) - 1;
      if (taskIdx >= 0 && taskIdx < tasks.length) {
        setCurrentTaskIndex(taskIdx);
      }
    }

    setTaskStartTime(new Date());
  }, [router]);

  const task = tasks[currentTaskIndex];

  const submitTask = useCallback(async () => {
    if (!task) return;

    if (response.length < task.minChars) {
      setCharWarning(
        `Please write at least ${task.minChars} characters. Current: ${response.length}`
      );
      return;
    }

    setSubmitting(true);
    setCharWarning('');

    const timeSpent = Math.floor(
      (Date.now() - taskStartTime.getTime()) / 1000
    );

    try {
      await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantId,
          taskNumber: task.number,
          response,
          timeSpentSeconds: timeSpent,
          startedAt: taskStartTime.toISOString(),
        }),
      });
    } catch {
      // Continue even if save fails - don't block participant
    }

    if (currentTaskIndex < tasks.length - 1) {
      const nextIndex = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIndex);
      sessionStorage.setItem('currentTask', String(nextIndex + 1));
      setResponse('');
      setTaskStartTime(new Date());
    } else {
      sessionStorage.setItem('currentTask', 'assessment');
      router.push('/assessment');
    }

    setSubmitting(false);
  }, [task, response, taskStartTime, participantId, currentTaskIndex, router]);

  if (!participantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
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
          <div
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              group === 'ai'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {group === 'ai' ? 'AI Group' : 'Control Group'}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Timer startTime={taskStartTime} />
          <div className="w-48">
            <ProgressBar current={currentTaskIndex + 1} total={tasks.length} />
          </div>
        </div>
      </div>

      {/* Group-specific banner */}
      <div
        className={`px-4 py-2 text-xs font-medium ${
          group === 'ai'
            ? 'bg-blue-50 text-blue-700 border-b border-blue-100'
            : 'bg-emerald-50 text-emerald-700 border-b border-emerald-100'
        }`}
      >
        {group === 'ai'
          ? 'You may use the AI assistant on the right to help with Tasks 1\u20136. Do NOT use AI for the Knowledge Assessment.'
          : 'You may use UpToDate on the right to help with Tasks 1\u20136. Do NOT use any AI tools. Do NOT use external resources for the Knowledge Assessment.'}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel: Case + Task */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <CasePanel />

          <div className="flex-1 overflow-y-auto p-5">
            <div className="max-w-3xl">
              <h2 className="text-lg font-bold text-foreground mb-1">
                Task {task.number}: {task.title}
              </h2>

              {task.showAdditionalFindings && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div className="font-semibold text-amber-800 text-sm mb-2">
                    Additional Findings
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

              <p className="text-sm text-foreground mb-4 leading-relaxed">
                {task.prompt}
              </p>

              <textarea
                value={response}
                onChange={(e) => {
                  setResponse(e.target.value);
                  if (charWarning && e.target.value.length >= task.minChars) {
                    setCharWarning('');
                  }
                }}
                placeholder="Type your response here..."
                className="w-full h-64 px-4 py-3 border border-border rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary leading-relaxed"
              />

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">
                    {response.length} characters
                    {response.length < task.minChars && (
                      <span className="text-amber-600">
                        {' '}
                        (min: {task.minChars})
                      </span>
                    )}
                  </span>
                  {charWarning && (
                    <span className="text-xs text-red-600">{charWarning}</span>
                  )}
                </div>

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

        {/* Right sidebar: Chat or UpToDate */}
        <div className="w-96 flex-shrink-0 hidden lg:flex flex-col">
          {group === 'ai' ? (
            <ChatSidebar
              participantId={participantId}
              taskNumber={task.number}
            />
          ) : (
            <UpToDateSidebar />
          )}
        </div>
      </div>
    </div>
  );
}
