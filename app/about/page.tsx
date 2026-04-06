import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="About"
        title="A modern fitting concept for serious equipment decisions"
        description="Gulf South Golf Lab was built to combine player tendencies, launch data, and practical testing guidance into one clear fitting workflow."
      />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Who we are</h2>
          <p className="mt-4 text-sm leading-7 text-gsgl-gray">
            Gulf South Golf Lab is a data-driven fitting platform focused on helping players and coaches make more reliable equipment choices without overcomplicating the process.
          </p>
        </article>
        <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Our philosophy</h2>
          <p className="mt-4 text-sm leading-7 text-gsgl-gray">
            Good fitting sits at the intersection of launch metrics, player tendencies, and real-world playability. We prioritize repeatable decisions over one-off recommendations.
          </p>
        </article>
        <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Why fitting matters</h2>
          <p className="mt-4 text-sm leading-7 text-gsgl-gray">
            Ball, head, shaft, and build choices directly affect launch windows, dispersion patterns, and scoring opportunities. Structured fitting improves confidence and consistency.
          </p>
        </article>
        <article className="rounded-xl border border-gsgl-gold/30 bg-gsgl-sand p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Studio vision</h2>
          <p className="mt-4 text-sm leading-7 text-gsgl-gray">
            The platform foundation is built to support future in-person studio fittings across the Gulf South region with integrated digital records and follow-up optimization workflows.
          </p>
        </article>
      </div>
    </main>
  );
}
