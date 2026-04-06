"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { loadSessions, sessionStats } from "@/lib/session-history";
import type { StoredSession } from "@/lib/session-history";

const CONFIDENCE_BADGE: Record<string, string> = {
  High: "text-emerald-700 bg-emerald-50",
  Medium: "text-amber-700 bg-amber-50",
  Low: "text-slate-600 bg-slate-50",
};

function DashboardContent() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSessions(loadSessions());
    setHydrated(true);
  }, []);

  const stats = sessionStats(sessions);

  const statCards = [
    {
      label: "Sessions completed",
      value: hydrated ? String(stats.total) : "—",
      trend: stats.lastDate ? `Last: ${stats.lastDate}` : "No sessions yet",
    },
    {
      label: "Average confidence",
      value: hydrated && stats.total > 0 ? `${stats.avgConfidence}%` : "—",
      trend: "Based on completed launch data",
    },
    {
      label: "Saved locally",
      value: hydrated ? String(sessions.length) : "—",
      trend: "Stored in browser",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Dashboard"
          title="Welcome back"
          description="Launch a fitting workflow, revisit past sessions, and track recommendation updates."
        />
        <Button href="/fit/new">New Fitting Session</Button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gsgl-navy">Recent sessions</h2>
        {hydrated && sessions.length === 0 ? (
          <p className="mt-5 text-sm text-gsgl-gray">
            No sessions yet.{" "}
            <a href="/fit/new" className="font-medium text-gsgl-navy underline underline-offset-2">
              Start your first fit
            </a>{" "}
            to see results here.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {sessions.slice(0, 8).map((session) => (
              <article
                key={session.id}
                className="rounded-lg border border-gsgl-navy/10 bg-gsgl-offwhite p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-gsgl-navy">{session.id}</p>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-semibold ${CONFIDENCE_BADGE[session.confidence]}`}
                  >
                    {session.confidence}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gsgl-gray">{session.focus}</p>
                <p className="mt-1 text-xs text-gsgl-gray">{session.date}</p>
              </article>
            ))}
          </div>
        )}
      </section>
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
