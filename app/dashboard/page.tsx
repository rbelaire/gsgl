"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { loadSessions } from "@/lib/session-history";
import type { StoredSession } from "@/lib/session-history";
import type { Routine } from "@/lib/training/types";

const CONF_STYLE: Record<string, string> = {
  High: "text-gb-green bg-gb-green-soft",
  Medium: "text-amber-400 bg-amber-400/10",
  Low: "text-gb-muted bg-gb-line",
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-gb-line bg-gb-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-gb-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-gb-muted">{sub}</p>}
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [fitSessions, setFitSessions] = useState<StoredSession[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFitSessions(loadSessions());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const token = await user.getIdToken();
      const res = await fetch("/api/routines", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setRoutines(data.routines ?? []);
      }
    })();
  }, [user]);

  const totalSessionsDone = routines.reduce((sum, r) => {
    return sum + Object.values(r.completions ?? {}).filter(Boolean).length;
  }, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gb-muted">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back.</h1>
        </div>
        <div className="flex gap-3">
          <Button href="/fit/new">New Fitting</Button>
          <Button href="/training" variant="secondary">Build Routine</Button>
        </div>
      </div>

      {/* ── Quick stats ────────────────────────────────────────────────── */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Fit sessions"
          value={hydrated ? String(fitSessions.length) : "—"}
          sub="Stored locally"
        />
        <StatCard
          label="Avg fit confidence"
          value={
            hydrated && fitSessions.length > 0
              ? `${Math.round(fitSessions.reduce((s, f) => s + (f.confidence === "High" ? 90 : f.confidence === "Medium" ? 70 : 50), 0) / fitSessions.length)}%`
              : "—"
          }
          sub="Based on launch data"
        />
        <StatCard
          label="Training routines"
          value={String(routines.length)}
          sub="Saved in Firebase"
        />
        <StatCard
          label="Sessions completed"
          value={String(totalSessionsDone)}
          sub="Across all routines"
        />
      </div>

      {/* ── Active routines ────────────────────────────────────────────── */}
      {routines.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Routines</h2>
            <Button href="/training" variant="ghost">Manage →</Button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {routines.slice(0, 4).map((r) => {
              const total = r.weeks.reduce((s, w) => s + w.sessions.length, 0);
              const done = Object.values(r.completions ?? {}).filter(Boolean).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={r.id} className="rounded-xl border border-gb-line bg-gb-panel p-5">
                  <p className="font-semibold">{r.title}</p>
                  <p className="mt-1 text-xs text-gb-muted">{r.meta}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 overflow-hidden rounded-full bg-gb-line h-2">
                      <div
                        className="h-2 rounded-full bg-gb-green transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gb-muted">{done}/{total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Recent fit sessions ────────────────────────────────────────── */}
      <section className="mt-12 rounded-xl border border-gb-line bg-gb-panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Fit Sessions</h2>
          <Button href="/fit/new" variant="ghost">New fit →</Button>
        </div>
        {hydrated && fitSessions.length === 0 ? (
          <p className="mt-5 text-sm text-gb-muted">
            No sessions yet.{" "}
            <a href="/fit/new" className="font-medium text-gb-green underline underline-offset-2">
              Start your first fit
            </a>{" "}
            to see results here.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {fitSessions.slice(0, 6).map((session) => (
              <article
                key={session.id}
                className="rounded-lg border border-gb-line bg-gb-bg p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm">{session.id}</p>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${CONF_STYLE[session.confidence]}`}
                  >
                    {session.confidence}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gb-muted">{session.focus}</p>
                <p className="mt-1 text-xs text-gb-muted">{session.date}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/stats">View all stats</Button>
        <Button href="/drills" variant="secondary">Browse drills</Button>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
