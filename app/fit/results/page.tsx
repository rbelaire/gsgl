import { RecommendationCard } from "@/components/results/RecommendationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { resultPanels } from "@/lib/mock-data/site";

export default function FitResultsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Results"
        title="Recommendation Summary"
        description="Sample report layout for future fitting outputs with confidence context and actionable next steps."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {resultPanels.map((panel) => (
          <RecommendationCard key={panel.title} {...panel} />
        ))}
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Why this was chosen</h2>
          <p className="mt-4 text-sm leading-7 text-gsgl-gray">
            Launch and dispersion inputs indicate the player benefits from reducing driver spin while preserving iron descent angle. The selected setup prioritizes tighter directional control and predictable carry gaps.
          </p>
          <p className="mt-4 text-sm leading-7 text-gsgl-gray">
            Confidence weighting is strongest in driver and ball categories due to complete speed, spin, and strike pattern data.
          </p>
        </article>

        <article className="rounded-xl border border-gsgl-gold/30 bg-gsgl-sand p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Confidence Level</h2>
          <p className="mt-3 text-4xl font-bold text-gsgl-navy">84%</p>
          <p className="mt-3 text-sm text-gsgl-gray">High confidence for ball and driver recommendations. Medium confidence for final iron shaft weight pending additional strike location data.</p>
        </article>
      </section>

      <section className="mt-10 rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gsgl-navy">Next Steps</h2>
        <ul className="mt-4 space-y-2 text-sm text-gsgl-gray">
          <li>• Validate driver setup in a 10-shot controlled test block.</li>
          <li>• Confirm iron descent angles with 7-iron and 5-iron sessions.</li>
          <li>• Recheck bag gapping after final shaft decision.</li>
        </ul>
      </section>
    </main>
  );
}
