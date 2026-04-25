import { Button } from "@/components/ui/Button";

export default function NewSwingReportPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <section className="rounded-xl border border-gb-line bg-gb-panel p-7 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gb-green">Swing Review</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Create a new swing report</h1>
        <p className="mt-4 text-sm leading-7 text-gb-muted">
          This setup flow is ready for video upload, checkpoint capture, and coach notes. Use this page as the
          starting point for new Swing Review reports.
        </p>

        <div className="mt-8 grid gap-4 rounded-lg border border-dashed border-gb-line bg-gb-bg/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gb-muted">Placeholder state</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-gb-muted">
            <li>Upload one or more swing videos.</li>
            <li>Set position markers for key swing moments.</li>
            <li>Add coach lines and written feedback.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/swing-review">Back to Swing Review</Button>
          <Button href="/dashboard" variant="secondary">
            Go to Dashboard
          </Button>
        </div>
      </section>
    </main>
  );
}
