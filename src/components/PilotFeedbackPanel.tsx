'use client';

import { useEffect, useState } from 'react';

interface FeedbackEntry {
  participant_id: string;
  arm: string;
  item_type: 'task' | 'question';
  item_number: number;
  item_label: string;
  feedback: string;
  updated_at: string;
}

/** Admin-only panel showing all pilot feedback grouped by item. */
export default function PilotFeedbackPanel({ password }: { password: string }) {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/pilot-feedback', {
        headers: { 'x-admin-password': password },
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setError(b.error ?? `HTTP ${res.status}`);
        setLoading(false);
        return;
      }
      const body = (await res.json()) as { feedback?: FeedbackEntry[] };
      setEntries(body.feedback ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Load failed');
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Group by item (task/question + number)
  type Group = {
    item_type: 'task' | 'question';
    item_number: number;
    item_label: string;
    entries: FeedbackEntry[];
  };
  const groupsByKey: Record<string, Group> = {};
  for (const e of entries) {
    const key = `${e.item_type}-${e.item_number}`;
    if (!groupsByKey[key]) {
      groupsByKey[key] = {
        item_type: e.item_type,
        item_number: e.item_number,
        item_label: e.item_label,
        entries: [],
      };
    }
    groupsByKey[key].entries.push(e);
  }
  const groups = Object.values(groupsByKey).sort((a, b) => {
    if (a.item_type !== b.item_type) return a.item_type === 'task' ? -1 : 1;
    return a.item_number - b.item_number;
  });

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-semibold text-foreground">Pilot Feedback</h2>
          <p className="text-xs text-muted">
            Free-text comments left by participants whose IDs begin with
            PILOT. Real recruits do not see the feedback box.
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

      {error && (
        <div className="mb-3 text-sm bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded">
          {error}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="text-sm text-muted">No feedback yet.</p>
      ) : (
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={`${g.item_type}-${g.item_number}`} className="border border-border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                    g.item_type === 'task'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {g.item_type === 'task' ? `Task ${g.item_number}` : `Q${g.item_number}`}
                </span>
                <span className="text-xs text-muted truncate">{g.item_label}</span>
              </div>
              <ul className="space-y-2">
                {g.entries.map((e, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-mono text-xs text-muted mr-2">
                      {e.participant_id}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded mr-2 ${
                        e.arm === 'AI'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {e.arm}
                    </span>
                    <span className="whitespace-pre-wrap break-words text-foreground">
                      {e.feedback}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
