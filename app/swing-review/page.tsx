import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";

const swingReviewSteps = [
  {
    title: "Upload swing video",
    description:
      "Start a report with face-on or down-the-line video from your session and keep everything organized in one place.",
  },
  {
    title: "Capture key positions",
    description:
      "Save checkpoints like address, top of backswing, impact, and finish so your feedback stays specific and repeatable.",
  },
  {
    title: "Draw coach lines",
    description:
      "Add simple reference lines and notes to highlight setup, plane, and movement patterns for each swing.",
  },
  {
    title: "Share a clean report",
    description:
      "Send a polished swing report link to players or coaches so everyone can review the same details quickly.",
  },
];

export default function SwingReviewPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <section className="rounded-2xl border border-gb-line bg-gb-panel p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gb-green">Swing Review</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Build coach-style swing reports from every practice session
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-gb-muted sm:text-base">
          Create structured swing feedback reports with video checkpoints, annotation lines, and share-ready
          notes. Keep your player communication clear and consistent from lesson to lesson.
        </p>
        <div className="mt-8">
          <Button href="/swing-review/new">Create New Report</Button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {swingReviewSteps.map((step) => (
            <FeatureCard key={step.title} title={step.title} description={step.description} />
          ))}
        </div>
      </section>
    </main>
  );
}
