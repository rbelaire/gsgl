"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { loadSessions, sessionStats } from "@/lib/session-history";
import type { UserStats } from "@/lib/training/types";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-gb-line bg-gb-panel p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gb-muted">{label}</p>
      <p className="mt-2 text-4xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-sm text-gb-muted">{sub}</p>}
    </div>
  );
}

function StatsContent() {
  const { user } = useAuth();
  const [trainingStats, setTrainingStats] = useState<UserStats | null>(null);
  const [fitStats, setFitStats] = useState<{ total: number; avgConfidence: number; lastDate: string | null } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sessions = loadSessions();
    setFitStats(sessionStats(sessions));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = await user.getIdToken();
      const res = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTrainingStats(data.stats);
      }
    })();
  }, [user]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Performance Stats</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gb-muted">
        Track your fitting sessions, training progress, and practice streaks all in one view.
      </p>

      {/* ── Fitting stats ─────────────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gb-muted">
          Club Fitting
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Fit sessions"
            value={hydrated ? String(fitStats?.total ?? 0) : "—"}
            sub={fitStats?.lastDate ? `Last: ${fitStats.lastDate}` : "No sessions yet"}
          />
          <StatCard
            label="Avg confidence"
            value={hydrated && (fitStats?.total ?? 0) > 0 ? `${fitStats!.avgConfidence}%` : "—"}
            sub="Based on launch data quality"
          />
          <div className="flex items-center justify-center rounded-xl border border-gb-line bg-gb-panel p-6">
            <Button href="/fit/new">Start a New Fit</Button>
          </div>
        </div>
      </section>

      {/* ── Training stats ────────────────────────────────────────────── */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-gb-muted">
          Training & Practice
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Routines saved"
            value={trainingStats ? String(trainingStats.routinesSaved) : "—"}
          />
          <StatCard
            label="Sessions done"
            value={trainingStats ? String(trainingStats.sessionsCompleted) : "—"}
            sub="Across all routines"
          />
          <StatCard
            label="Current streak"
            value={trainingStats ? `${trainingStats.currentStreak}d` : "—"}
          />
          <StatCard
            label="Longest streak"
            value={trainingStats ? `${trainingStats.longestStreak}d` : "—"}
          />
        </div>
      </section>

      {/* ── Weakness coverage ─────────────────────────────────────────── */}
      {trainingStats && Object.keys(trainingStats.weaknessCoverage).length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gb-muted">
            Weakness Coverage
          </h2>
          <div className="mt-4 rounded-xl border border-gb-line bg-gb-panel p-6">
            <div className="space-y-4">
              {Object.entries(trainingStats.weaknessCoverage)
                .sort(([, a], [, b]) => b - a)
                .map(([weakness, count]) => {
                  const max = Math.max(...Object.values(trainingStats.weaknessCoverage));
                  const pct = Math.round((count / max) * 100);
                  return (
                    <div key={weakness}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gb-text">{weakness}</span>
                        <span className="text-gb-muted">{count} routine{count > 1 ? "s" : ""}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gb-line">
                        <div
                          className="h-2 rounded-full bg-gb-green transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/training">Build a Routine</Button>
        <Button href="/drills" variant="secondary">Browse Drills</Button>
        <Button href="/dashboard" variant="ghost">Dashboard</Button>
      </div>
    </main>
  );
}

export default function StatsPage() {
  return (
    <AuthGuard>
      <StatsContent />
    </AuthGuard>
  );
}
