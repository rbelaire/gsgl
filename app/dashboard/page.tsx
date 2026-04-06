import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { dashboardStats, recentSessions, savedRecommendations } from "@/lib/mock-data/site";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="Dashboard"
          title="Welcome back"
          description="Use your dashboard to launch a fitting workflow, revisit past sessions, and track recommendation updates."
        />
        <Button href="/fit/new">New Fitting Session</Button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Recent sessions</h2>
          <div className="mt-5 space-y-3">
            {recentSessions.map((session) => (
              <article key={session.id} className="rounded-lg border border-gsgl-navy/10 bg-gsgl-offwhite p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gsgl-navy">{session.id}</p>
                  <span className="text-xs uppercase tracking-wide text-gsgl-slate">{session.confidence} confidence</span>
                </div>
                <p className="mt-2 text-sm text-gsgl-gray">{session.focus}</p>
                <p className="mt-1 text-xs text-gsgl-gray">{session.date}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Saved recommendations</h2>
          <div className="mt-5 space-y-3">
            {savedRecommendations.map((item) => (
              <article key={item.title} className="rounded-lg border border-gsgl-navy/10 bg-gsgl-offwhite p-4">
                <p className="font-semibold text-gsgl-navy">{item.title}</p>
                <p className="mt-2 text-sm text-gsgl-gray">{item.summary}</p>
                <p className="mt-1 text-xs text-gsgl-gray">{item.updatedAt}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-10">
        <EmptyStatePanel
          title="No shared reports yet"
          description="Once you export fit summaries for coaches or players, they will appear here for quick access."
        />
      </div>
    </main>
  );
}
