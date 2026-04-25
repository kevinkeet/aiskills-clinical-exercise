'use client';

import { useState } from 'react';

interface Participant {
  participant_id: string;
  pgy?: number;
  arm?: string;
  email?: string | null;
  consent_at?: string | null;
  intake_complete?: boolean;
  intake_completed_at?: string | null;
  session_started_at?: string | null;
  session_completed_at?: string | null;
  current_step?: string | null;
  created_at: string;
}

interface Stats {
  totalParticipants: number;
  intakeCompleteCount?: number;
  aiGroupCount: number;
  controlGroupCount: number;
  completedCount: number;
  avgTimeByTask: Record<number, number>;
  recentParticipants: Participant[];
}

const EXPORT_TYPES: { type: string; label: string }[] = [
  { type: 'all', label: 'Participants' },
  { type: 'intake', label: 'Intake Responses' },
  { type: 'tasks', label: 'Task Responses' },
  { type: 'assessment', label: 'Assessment Responses' },
  { type: 'chat', label: 'Chat Logs' },
  { type: 'mailmerge', label: 'Mail-merge CSV' },
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState('');

  async function authenticate() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': password },
      });
      if (!res.ok) {
        setError('Invalid password');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setStats(data);
      setAuthenticated(true);
    } catch {
      setError('Connection error');
    }
    setLoading(false);
  }

  async function refreshStats() {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch {
      // Silently fail
    }
  }

  function downloadCSV(type: string) {
    const url = `/api/admin/export?type=${type}`;
    fetch(url, { headers: { 'x-admin-password': password } })
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${type}.csv`;
        link.click();
        URL.revokeObjectURL(blobUrl);
      });
  }

  async function resetParticipant(pid: string) {
    const confirmed = window.confirm(
      `Reset ${pid}? This wipes all responses (intake, tasks, assessment, chat) ` +
        `and lets the participant start over with the same arm assignment. This cannot be undone.`
    );
    if (!confirmed) return;
    setResettingId(pid);
    setResetMsg('');
    try {
      const res = await fetch('/api/admin/reset-participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ participantId: pid }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResetMsg(`Reset failed: ${body.error ?? `HTTP ${res.status}`}`);
      } else {
        setResetMsg(`Reset ${pid}.`);
        await refreshStats();
      }
    } catch (e) {
      setResetMsg(`Reset failed: ${e instanceof Error ? e.message : 'unknown'}`);
    }
    setResettingId(null);
    setTimeout(() => setResetMsg(''), 5000);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-card rounded-xl shadow-lg border border-border p-6">
          <h1 className="text-xl font-bold text-foreground mb-4 text-center">
            Admin Dashboard
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && authenticate()}
            placeholder="Enter admin password"
            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3"
          />
          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
          <button
            onClick={authenticate}
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <h1 className="font-bold text-foreground">Admin Dashboard</h1>
        <button
          onClick={refreshStats}
          className="text-sm text-primary hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {resetMsg && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-2 rounded-lg">
            {resetMsg}
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Seeded" value={stats?.totalParticipants || 0} />
          <StatCard
            label="Intake Complete"
            value={stats?.intakeCompleteCount || 0}
            color="blue"
          />
          <StatCard
            label="AI Group"
            value={stats?.aiGroupCount || 0}
            color="blue"
          />
          <StatCard
            label="Control Group"
            value={stats?.controlGroupCount || 0}
            color="emerald"
          />
          <StatCard
            label="Fully Completed"
            value={stats?.completedCount || 0}
            color="amber"
          />
        </div>

        {/* Avg time per task */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-3">
            Average Time per Task
          </h2>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((t) => {
              const secs = stats?.avgTimeByTask?.[t] || 0;
              const mins = Math.floor(secs / 60);
              const s = secs % 60;
              return (
                <div
                  key={t}
                  className="bg-slate-50 rounded-lg p-3 text-center"
                >
                  <div className="text-xs text-muted mb-1">Task {t}</div>
                  <div className="font-mono font-semibold text-foreground">
                    {mins}:{s.toString().padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export buttons */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-1">Export Data</h2>
          <p className="text-xs text-muted mb-3">
            Mail-merge CSV is the coordinator&apos;s starting point for sending
            P-NNN values to residents. Intake CSV flattens demographics +
            self-rated familiarity for analysis.
          </p>
          <div className="flex flex-wrap gap-2">
            {EXPORT_TYPES.map(({ type, label }) => (
              <button
                key={type}
                onClick={() => downloadCSV(type)}
                className="px-3 py-2 bg-slate-100 text-foreground rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Download {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent participants */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-3">
            Recent Participants
          </h2>
          {stats?.recentParticipants && stats.recentParticipants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="pb-2 font-medium pr-3">ID</th>
                    <th className="pb-2 font-medium pr-3">PGY</th>
                    <th className="pb-2 font-medium pr-3">Arm</th>
                    <th className="pb-2 font-medium pr-3">Step</th>
                    <th className="pb-2 font-medium pr-3">Intake</th>
                    <th className="pb-2 font-medium pr-3">Done</th>
                    <th className="pb-2 font-medium pr-3">Created</th>
                    <th className="pb-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentParticipants.map((p) => (
                    <tr
                      key={p.participant_id}
                      className="border-b border-border/50"
                    >
                      <td className="py-2 pr-3 font-mono text-xs">
                        {p.participant_id}
                      </td>
                      <td className="py-2 pr-3 text-xs">{p.pgy ?? '—'}</td>
                      <td className="py-2 pr-3">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            p.arm === 'AI'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.arm ?? '—'}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-xs text-muted">
                        {p.current_step ?? 'consent'}
                      </td>
                      <td className="py-2 pr-3 text-xs">
                        {p.intake_complete ? '✓' : '—'}
                      </td>
                      <td className="py-2 pr-3 text-xs">
                        {p.session_completed_at ? '✓' : '—'}
                      </td>
                      <td className="py-2 pr-3 text-xs text-muted">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="py-2">
                        <button
                          onClick={() => resetParticipant(p.participant_id)}
                          disabled={resettingId === p.participant_id}
                          className="text-xs text-red-600 hover:text-red-800 hover:underline disabled:opacity-40"
                        >
                          {resettingId === p.participant_id ? 'Resetting…' : 'Reset'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted">No participants yet.</p>
          )}
          <p className="text-xs text-muted mt-3">
            Showing the 10 most recently created. Use the Mail-merge CSV
            export to see all participants.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    amber: 'bg-amber-50 border-amber-200',
  };
  return (
    <div
      className={`rounded-xl border p-4 ${
        color ? colorClasses[color] : 'bg-card border-border'
      }`}
    >
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}
