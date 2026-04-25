import { Button } from "@/components/ui/Button";

interface SwingReportSharePageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function SwingReportSharePage({
  params,
}: SwingReportSharePageProps) {
  const { reportId } = await params;

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <section className="rounded-xl border border-gb-line bg-gb-panel p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gb-green">Shared Swing Review</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Shared report {reportId}</h1>
        <p className="mt-4 text-sm leading-7 text-gb-muted">
          This clean share page is intended for player-friendly viewing with focused report media and feedback.
        </p>

        <div className="mt-8 rounded-lg border border-dashed border-gb-line bg-gb-bg/70 p-5 text-sm text-gb-muted">
          Public report summary, selected positions, and coach notes will appear here.
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`/swing-review/${reportId}`}>View Full Report</Button>
          <Button href="/swing-review" variant="secondary">
            Swing Review Home
          </Button>
        </div>
      </section>
    </main>
  );
}
