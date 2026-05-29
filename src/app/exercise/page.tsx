'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Task } from '@/data/tasks';
import { additionalFindings, getCaseAsText } from '@/data/case';
import CasePanel from '@/components/CasePanel';
import ChatSidebar from '@/components/ChatSidebar';
import UpToDateSidebar from '@/components/UpToDateSidebar';
import ProgressBar from '@/components/ProgressBar';
import Timer from '@/components/Timer';
import PilotFeedbackBox from '@/components/PilotFeedbackBox';

type Arm = 'AI' | 'CONTROL';

function isPilot(pid: string): boolean {
  return /^PILOT\d+$/i.test(pid);
}

// Resource-sidebar width bounds (px). Module-scope so they're stable across
// renders and never appear as effect/callback dependencies.
const SIDEBAR_MIN = 320;
const SIDEBAR_MAX = 760;

export default function ExercisePage() {
  const router = useRouter();
  const [participantId, setParticipantId] = useState('');
  const [arm, setArm] = useState<Arm | ''>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [taskStartTime, setTaskStartTime] = useState<Date>(new Date());
  const [exerciseStartTime] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskFeedback, setTaskFeedback] = useState<Record<number, string>>({});
  // Resizable resource sidebar (chat / UpToDate). Persisted per browser.
  const [sidebarWidth, setSidebarWidth] = useState(384); // 24rem default
  const sidebarWidthRef = useRef(384);

  const startSidebarResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = sidebarWidthRef.current;
      function onMove(ev: MouseEvent) {
        // Dragging the handle left (decreasing clientX) widens the sidebar.
        const next = Math.min(
          Math.max(startWidth + (startX - ev.clientX), SIDEBAR_MIN),
          SIDEBAR_MAX
        );
        sidebarWidthRef.current = next;
        setSidebarWidth(next);
      }
      function onUp() {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        try {
          localStorage.setItem(
            'resourceSidebarWidth',
            String(sidebarWidthRef.current)
          );
        } catch {
          // ignore
        }
      }
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    },
    []
  );

  // Resolve arm + load the (DB-backed) task list. Both must succeed before render.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/session/me').then((r) => (r.ok ? r.json() : null)),
      fetch('/api/tasks').then((r) => (r.ok ? r.json() : { tasks: [] })),
      fetch('/api/pilot-feedback').then((r) => (r.ok ? r.json() : { feedback: [] })),
    ])
      .then(([sessionData, tasksData, feedbackData]) => {
        if (cancelled) return;
        // Restore a previously chosen sidebar width (per browser).
        try {
          const savedWidth = localStorage.getItem('resourceSidebarWidth');
          if (savedWidth) {
            const n = parseInt(savedWidth, 10);
            if (!Number.isNaN(n)) {
              const clamped = Math.min(Math.max(n, SIDEBAR_MIN), SIDEBAR_MAX);
              setSidebarWidth(clamped);
              sidebarWidthRef.current = clamped;
            }
          }
        } catch {
          // localStorage unavailable; keep default width.
        }
        if (!sessionData?.authenticated || !sessionData.intakeComplete) {
          router.push('/intake');
          return;
        }
        const loadedTasks: Task[] = tasksData.tasks ?? [];
        if (loadedTasks.length === 0) {
          // Hard error: tasks didn't load. Send to /intake rather than break.
          router.push('/intake');
          return;
        }
        setTasks(loadedTasks);
        setParticipantId(sessionData.participantId);
        setArm(sessionData.arm);
        // Pre-populate feedback map for pilots so they can navigate back
        // and forth between tasks without losing what they typed.
        const fb: Record<number, string> = {};
        for (const entry of feedbackData.feedback ?? []) {
          if (entry.itemType === 'task') fb[entry.itemNumber] = entry.feedback;
        }
        setTaskFeedback(fb);
        const savedTask = sessionStorage.getItem('currentTask');
        let resumeIdx = 0;
        if (savedTask) {
          const taskIdx = parseInt(savedTask, 10) - 1;
          if (taskIdx >= 0 && taskIdx < loadedTasks.length) {
            setCurrentTaskIndex(taskIdx);
            resumeIdx = taskIdx;
          }
        }
        // Restore any draft from localStorage (per participant + task)
        const draftKey = `taskDraft:${sessionData.participantId}:${loadedTasks[resumeIdx].number}`;
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

  // The new workup/exam findings are revealed at the task flagged
  // `showAdditionalFindings` (Task 4) and must REMAIN visible for every task
  // after it — the participant needs them to write the after-visit summary
  // (Task 5). So treat the reveal as sticky: show the findings if the current
  // task, or any earlier task, triggered them.
  const findingsRevealed = tasks
    .slice(0, currentTaskIndex + 1)
    .some((t) => t.showAdditionalFindings);

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

  if (loading || !participantId || !task) {
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
      <div className="px-4 py-2 text-xs bg-blue-50 text-blue-900 border-b border-blue-100 leading-relaxed">
        <span className="font-semibold">
          You are encouraged to use the resource panel on the right to work
          through Tasks 1&ndash;5
        </span>{' '}
        — just as you would when caring for a real patient. Looking things up
        here is expected and is not cheating. (You may <span className="font-semibold">not</span> use any
        resources during the Knowledge Assessment that follows the case.)
      </div>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel: Case + Task */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <CasePanel
            defaultOpen={currentTaskIndex === 0}
            additionalFindings={findingsRevealed ? additionalFindings : undefined}
          />

          <div className="flex-1 overflow-y-auto p-5">
            <div className="max-w-3xl">
              <h2 className="text-lg font-bold text-foreground mb-3">
                Task {task.number}: {task.title}
              </h2>

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

              {isPilot(participantId) && (
                <div className="mt-3">
                  <PilotFeedbackBox
                    itemType="task"
                    itemNumber={task.number}
                    initialValue={taskFeedback[task.number] ?? ''}
                    onSavedChange={(v) =>
                      setTaskFeedback((prev) => ({
                        ...prev,
                        [task.number]: v,
                      }))
                    }
                  />
                </div>
              )}

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

        {/* Drag handle to resize the resource sidebar (lg+ only). */}
        <div
          onMouseDown={startSidebarResize}
          role="separator"
          aria-orientation="vertical"
          title="Drag to resize"
          className="hidden lg:block w-1.5 flex-shrink-0 cursor-col-resize bg-border hover:bg-primary/50 active:bg-primary/60 transition-colors"
        />

        {/* Right sidebar: arm-determined; never labelled by arm name */}
        <div
          className="flex-shrink-0 hidden lg:flex flex-col"
          style={{ width: sidebarWidth }}
        >
          {arm === 'AI' ? (
            <ChatSidebar
              participantId={participantId}
              taskNumber={task.number}
              caseContext={getCaseAsText(findingsRevealed)}
              taskPrompt={task.prompt}
            />
          ) : (
            <UpToDateSidebar />
          )}
        </div>
      </div>
    </div>
  );
}
