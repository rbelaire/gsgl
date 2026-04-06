import { SectionHeader } from "@/components/ui/SectionHeader";
import { fitExperienceSteps } from "@/lib/mock-data/site";

export default function FitExperiencePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Fit experience"
        title="Preview the fitting workflow before your first session"
        description="This product view shows how player information moves through the process to produce recommendation-ready outputs."
      />

      <div className="mt-10 space-y-4">
        {fitExperienceSteps.map((step, index) => (
          <article key={step.title} className="grid gap-4 rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm md:grid-cols-[120px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-gsgl-slate">Stage {index + 1}</p>
              <p className="mt-2 text-lg font-semibold text-gsgl-navy">{step.title}</p>
            </div>
            <p className="text-sm leading-7 text-gsgl-gray">{step.detail}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
