'use client';

import { useState } from 'react';

interface Stats {
  totalParticipants: number;
  intakeCompleteCount?: number;
  aiGroupCount: number;
  controlGroupCount: number;
  completedCount: number;
  avgTimeByTask: Record<number, number>;
  recentParticipants: {
    participant_id: string;
    pgy?: number;
    arm?: string;
    intake_complete?: boolean;
    created_at: string;
  }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    const link = document.createElement('a');
    // Use fetch with auth header
    fetch(url, { headers: { 'x-admin-password': password } })
      .then((res) => res.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        link.href = blobUrl;
        link.download = `${type}.csv`;
        link.click();
        URL.revokeObjectURL(blobUrl);
      });
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
          {error && (
            <div className="text-red-600 text-sm mb-3">{error}</div>
          )}
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

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Participants"
            value={stats?.totalParticipants || 0}
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
            label="Completed"
            value={stats?.completedCount || 0}
            color="amber"
          />
        </div>

        {/* Avg time per task */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-foreground mb-3">
            Average Time per Task
          </h2>
          <div className="grid grid-cols-6 gap-3">
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
          <h2 className="font-semibold text-foreground mb-3">Export Data</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { type: 'all', label: 'Participants' },
              { type: 'tasks', label: 'Task Responses' },
              { type: 'assessment', label: 'Assessment Responses' },
              { type: 'chat', label: 'Chat Logs' },
            ].map(({ type, label }) => (
              <button
                key={type}
                onClick={() => downloadCSV(type)}
                className="px-4 py-2 bg-slate-100 text-foreground rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Download {label} CSV
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="pb-2 font-medium">Participant ID</th>
                  <th className="pb-2 font-medium">PGY</th>
                  <th className="pb-2 font-medium">Arm</th>
                  <th className="pb-2 font-medium">Intake</th>
                  <th className="pb-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentParticipants.map((p) => (
                  <tr
                    key={p.participant_id}
                    className="border-b border-border/50"
                  >
                    <td className="py-2 font-mono text-xs">
                      {p.participant_id}
                    </td>
                    <td className="py-2 text-xs">{p.pgy ?? '—'}</td>
                    <td className="py-2">
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
                    <td className="py-2 text-xs">
                      {p.intake_complete ? '✓' : '—'}
                    </td>
                    <td className="py-2 text-xs text-muted">
                      {new Date(p.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted">No participants yet.</p>
          )}
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
