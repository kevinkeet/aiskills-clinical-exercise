'use client';

import { useEffect, useState } from 'react';
import type { Task } from '@/data/tasks';
import type { Question, MCQQuestion, ScaleQuestion } from '@/data/questions';
import { isMCQ } from '@/data/questions';

/**
 * Inline editor for study tasks (5) and quiz questions (13). Lives inside
 * the admin dashboard.
 *
 * - Lists each item; click "Edit" to expand an inline form.
 * - Saving POSTs to /api/admin/tasks or /api/admin/questions with the
 *   admin password. On success the list refreshes from /api/tasks /
 *   /api/questions so what you see matches what participants will see.
 */
export default function StudyContentEditor({ password }: { password: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function refresh() {
    setLoading(true);
    try {
      const [tRes, qRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/questions'),
      ]);
      const tBody = (await tRes.json()) as { tasks?: Task[]; error?: string };
      const qBody = (await qRes.json()) as { questions?: Question[]; error?: string };
      if (tBody.tasks) setTasks(tBody.tasks);
      if (qBody.questions) setQuestions(qBody.questions);
      if (tBody.error) setErrorMsg(`tasks: ${tBody.error}`);
      else if (qBody.error) setErrorMsg(`questions: ${qBody.error}`);
      else setErrorMsg('');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Failed to load content');
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function saveTask(t: Task) {
    setStatusMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(t),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(body.error ?? `HTTP ${res.status}`);
        return false;
      }
      setStatusMsg(`Task ${t.number} saved.`);
      await refresh();
      setTimeout(() => setStatusMsg(''), 4000);
      return true;
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Save failed');
      return false;
    }
  }

  async function saveQuestion(q: Question) {
    setStatusMsg('');
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(q),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(body.error ?? `HTTP ${res.status}`);
        return false;
      }
      setStatusMsg(`Question ${q.number} saved.`);
      await refresh();
      setTimeout(() => setStatusMsg(''), 4000);
      return true;
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Save failed');
      return false;
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-semibold text-foreground">Study Content</h2>
          <p className="text-xs text-muted">
            Edits go live immediately for participants who load /exercise or
            /assessment after the save completes.
          </p>
        </div>
        <button
          onClick={refresh}
          className="text-sm text-primary hover:underline"
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>

      {statusMsg && (
        <div className="mb-3 text-sm bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded">
          {statusMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-3 text-sm bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded">
          {errorMsg}
        </div>
      )}

      <details open className="mb-4 group">
        <summary className="cursor-pointer text-sm font-semibold text-foreground py-2 select-none">
          Tasks ({tasks.length})
        </summary>
        <div className="mt-2 space-y-2">
          {tasks.map((t) => (
            <TaskRow
              key={t.number}
              task={t}
              editing={editingTask === t.number}
              onEdit={() => {
                setEditingTask(t.number);
                setEditingQuestion(null);
              }}
              onCancel={() => setEditingTask(null)}
              onSave={async (next) => {
                const ok = await saveTask(next);
                if (ok) setEditingTask(null);
              }}
            />
          ))}
        </div>
      </details>

      <details open className="group">
        <summary className="cursor-pointer text-sm font-semibold text-foreground py-2 select-none">
          Quiz Questions ({questions.length})
        </summary>
        <div className="mt-2 space-y-2">
          {questions.map((q) => (
            <QuestionRow
              key={q.number}
              question={q}
              editing={editingQuestion === q.number}
              onEdit={() => {
                setEditingQuestion(q.number);
                setEditingTask(null);
              }}
              onCancel={() => setEditingQuestion(null)}
              onSave={async (next) => {
                const ok = await saveQuestion(next);
                if (ok) setEditingQuestion(null);
              }}
            />
          ))}
        </div>
      </details>
    </div>
  );
}

// ---------------- Task row ----------------

function TaskRow({
  task,
  editing,
  onEdit,
  onCancel,
  onSave,
}: {
  task: Task;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (t: Task) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Task>(task);
  useEffect(() => setDraft(task), [task, editing]);

  if (!editing) {
    return (
      <div className="border border-border rounded-lg p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted mb-0.5">
              Task {task.number}
              {task.showAdditionalFindings && (
                <span className="ml-2 text-[10px] uppercase font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  reveals findings
                </span>
              )}
            </div>
            <div className="font-semibold text-sm text-foreground">{task.title}</div>
            <p className="text-xs text-muted mt-1 line-clamp-2 whitespace-pre-wrap">
              {task.prompt}
            </p>
          </div>
          <button
            onClick={onEdit}
            className="text-xs text-primary hover:underline whitespace-nowrap"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-3 bg-blue-50/30">
      <div className="text-xs text-muted mb-2">Editing Task {task.number}</div>
      <label className="block text-xs font-semibold text-foreground mb-1">Title</label>
      <input
        type="text"
        value={draft.title}
        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        className="w-full px-2 py-1.5 border border-border rounded text-sm mb-3"
      />
      <label className="block text-xs font-semibold text-foreground mb-1">Prompt</label>
      <textarea
        value={draft.prompt}
        onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
        rows={5}
        className="w-full px-2 py-1.5 border border-border rounded text-sm mb-3 leading-relaxed"
      />
      <div className="flex items-center gap-4 mb-3">
        <label className="text-xs flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!draft.showAdditionalFindings}
            onChange={(e) =>
              setDraft({ ...draft, showAdditionalFindings: e.target.checked })
            }
          />
          Reveal new findings on this task
        </label>
        <label className="text-xs flex items-center gap-2">
          Min characters
          <input
            type="number"
            min={0}
            value={draft.minChars}
            onChange={(e) =>
              setDraft({ ...draft, minChars: parseInt(e.target.value || '0', 10) })
            }
            className="w-20 px-2 py-1 border border-border rounded text-xs"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          className="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary-dark"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ---------------- Question row ----------------

function QuestionRow({
  question,
  editing,
  onEdit,
  onCancel,
  onSave,
}: {
  question: Question;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (q: Question) => Promise<void>;
}) {
  const [draft, setDraft] = useState<Question>(question);
  useEffect(() => setDraft(question), [question, editing]);

  if (!editing) {
    return (
      <div className="border border-border rounded-lg p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted mb-0.5">
              Q{question.number}
              <span className="ml-2 text-[10px] uppercase font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                {question.type === 'scale' ? 'scale' : 'mcq'}
              </span>
              {isMCQ(question) && (
                <span className="ml-2 text-[10px] font-mono text-emerald-700">
                  correct = {question.correctAnswer}
                </span>
              )}
            </div>
            <p className="text-sm text-foreground line-clamp-2">{question.text}</p>
          </div>
          <button
            onClick={onEdit}
            className="text-xs text-primary hover:underline whitespace-nowrap"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-3 bg-blue-50/30">
      <div className="text-xs text-muted mb-2">
        Editing Q{question.number} ({draft.type === 'scale' ? 'scale' : 'mcq'})
      </div>
      <label className="block text-xs font-semibold text-foreground mb-1">
        Question text
      </label>
      <textarea
        value={draft.text}
        onChange={(e) => setDraft({ ...draft, text: e.target.value })}
        rows={3}
        className="w-full px-2 py-1.5 border border-border rounded text-sm mb-3 leading-relaxed"
      />

      {isMCQ(draft) ? (
        <MCQEditor draft={draft} setDraft={setDraft} />
      ) : (
        <ScaleEditor draft={draft} setDraft={setDraft} />
      )}

      <div className="flex items-center justify-end gap-2 mt-3">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs text-muted hover:text-foreground"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(draft)}
          className="px-3 py-1.5 text-xs bg-primary text-white rounded hover:bg-primary-dark"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function MCQEditor({
  draft,
  setDraft,
}: {
  draft: MCQQuestion;
  setDraft: (q: Question) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-foreground mb-1">
        Options
      </label>
      {(['A', 'B', 'C', 'D'] as const).map((label) => {
        const opt = draft.options.find((o) => o.label === label);
        const value = opt?.value ?? '';
        return (
          <div key={label} className="flex items-center gap-2">
            <span className="text-xs font-bold w-5 text-foreground">{label}.</span>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const next = draft.options.map((o) =>
                  o.label === label ? { ...o, value: e.target.value } : o
                );
                if (!next.find((o) => o.label === label)) {
                  next.push({ label, value: e.target.value });
                }
                setDraft({ ...draft, options: next });
              }}
              className="flex-1 px-2 py-1 border border-border rounded text-xs"
            />
            <input
              type="radio"
              name={`correct-${draft.number}`}
              checked={draft.correctAnswer === label}
              onChange={() => setDraft({ ...draft, correctAnswer: label })}
              title="Mark as correct answer"
              className="ml-1"
            />
          </div>
        );
      })}
      <p className="text-[11px] text-muted mt-1">
        The radio on the right marks the correct answer.
      </p>
    </div>
  );
}

function ScaleEditor({
  draft,
  setDraft,
}: {
  draft: ScaleQuestion;
  setDraft: (q: Question) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="text-xs flex items-center gap-2">
          Min
          <input
            type="number"
            value={draft.min}
            onChange={(e) =>
              setDraft({ ...draft, min: parseInt(e.target.value || '0', 10) })
            }
            className="w-16 px-2 py-1 border border-border rounded text-xs"
          />
        </label>
        <label className="text-xs flex items-center gap-2">
          Max
          <input
            type="number"
            value={draft.max}
            onChange={(e) =>
              setDraft({ ...draft, max: parseInt(e.target.value || '0', 10) })
            }
            className="w-16 px-2 py-1 border border-border rounded text-xs"
          />
        </label>
      </div>
      <label className="block text-xs font-semibold text-foreground mt-2 mb-1">
        Min label (optional)
      </label>
      <input
        type="text"
        value={draft.minLabel ?? ''}
        onChange={(e) => setDraft({ ...draft, minLabel: e.target.value })}
        className="w-full px-2 py-1 border border-border rounded text-xs"
      />
      <label className="block text-xs font-semibold text-foreground mt-2 mb-1">
        Max label (optional)
      </label>
      <input
        type="text"
        value={draft.maxLabel ?? ''}
        onChange={(e) => setDraft({ ...draft, maxLabel: e.target.value })}
        className="w-full px-2 py-1 border border-border rounded text-xs"
      />
    </div>
  );
}
