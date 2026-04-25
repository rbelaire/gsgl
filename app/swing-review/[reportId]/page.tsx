import { Button } from "@/components/ui/Button";

interface SwingReportPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function SwingReportPage({ params }: SwingReportPageProps) {
  const { reportId } = await params;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
      <section className="rounded-xl border border-gb-line bg-gb-panel p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gb-green">Swing Review Report</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Report {reportId}</h1>
        <p className="mt-4 text-sm leading-7 text-gb-muted">
          This report detail page is prepared for video timeline playback, key position snapshots, coach lines,
          and written observations.
        </p>

        <div className="mt-8 rounded-lg border border-dashed border-gb-line bg-gb-bg/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gb-muted">Placeholder layout</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-gb-line bg-gb-panel p-4 text-sm text-gb-muted">
              Video review area
            </div>
            <div className="rounded-md border border-gb-line bg-gb-panel p-4 text-sm text-gb-muted">
              Checkpoints and notes
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={`/swing-review/${reportId}/share`}>Open Share View</Button>
          <Button href="/swing-review" variant="secondary">
            Back to Swing Review
          </Button>
        </div>
      </section>
    </main>
  );
}
