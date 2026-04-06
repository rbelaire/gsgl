"use client";

import { useEffect, useState } from "react";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { resultPanels } from "@/lib/mock-data/site";
import type { FitRecommendationResult } from "@/lib/fitting/types";

const CONFIDENCE_COLORS: Record<string, string> = {
  High: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Low: "text-slate-600 bg-slate-50 border-slate-200",
};

export default function FitResultsPage() {
  const [result, setResult] = useState<FitRecommendationResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("gsgl_fit_result");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        // fall through to mock display
      }
    }
  }, []);

  // Live engine result view
  if (result) {
    const top = (arr: FitRecommendationResult["ball"]) => arr[0];
    const ball = top(result.ball);
    const driver = top(result.driver);
    const iron = top(result.irons);
    const shaft = top(result.shafts);
    const { buildSpecs, confidence } = result;
    const overallPct = Math.round(
      [ball, driver, iron, shaft].filter(Boolean).reduce((s, r) => s + r!.score, 0) /
        [ball, driver, iron, shaft].filter(Boolean).length,
    );

    return (
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeader
          eyebrow="Results"
          title="Recommendation Summary"
          description="Personalized recommendations generated from your profile and launch data."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {[
            { title: "Recommended Ball", rec: ball },
            { title: "Recommended Driver", rec: driver },
            { title: "Recommended Irons", rec: iron },
            { title: "Recommended Shaft", rec: shaft },
          ].map(({ title, rec }) =>
            rec ? (
              <RecommendationCard
                key={title}
                title={title}
                value={rec.name}
                summary={rec.expectedImprovement}
              />
            ) : null,
          )}
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Length adjustment", value: buildSpecs.lengthAdjustment },
            { label: "Lie adjustment", value: buildSpecs.lieAdjustment },
            { label: "Grip size", value: buildSpecs.gripSize },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gsgl-navy/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gsgl-slate">{label}</p>
              <p className="mt-2 text-lg font-semibold text-gsgl-navy">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gsgl-navy">Fit rationale</h2>
            <ul className="mt-4 space-y-2">
              {[ball, driver, iron, shaft].flatMap((r) => r?.reasons ?? []).slice(0, 6).map((reason, i) => (
                <li key={i} className="text-sm leading-6 text-gsgl-gray">• {reason}</li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl border border-gsgl-gold/30 bg-gsgl-sand p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gsgl-navy">Confidence Level</h2>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-4xl font-bold text-gsgl-navy">{overallPct}%</p>
              <span className={`mb-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${CONFIDENCE_COLORS[confidence]}`}>
                {confidence}
              </span>
            </div>
            <p className="mt-3 text-sm text-gsgl-gray">
              {confidence === "High"
                ? "Strong launch data confidence. Recommendations are well-anchored in measurable inputs."
                : confidence === "Medium"
                  ? "Moderate confidence. Adding more launch data will sharpen results."
                  : "Low confidence. Provide launch monitor data for higher-precision recommendations."}
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gsgl-navy">Next Steps</h2>
          <ul className="mt-4 space-y-2 text-sm text-gsgl-gray">
            <li>• Validate driver setup in a 10-shot controlled test block.</li>
            <li>• Confirm iron descent angles with 7-iron and 5-iron sessions.</li>
            <li>• Recheck bag gapping after final shaft decision.</li>
          </ul>
        </section>

        <div className="mt-8 flex gap-3">
          <Button href="/fit/new" variant="secondary">Start New Fit</Button>
        </div>
      </main>
    );
  }

  // Fallback: sample/mock layout
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Results"
        title="Recommendation Summary"
        description="Sample report layout. Complete a fitting session to see your personalized results."
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
          <p className="mt-3 text-sm text-gsgl-gray">Sample values. Run a full fitting session to see live confidence scores.</p>
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

      <div className="mt-8">
        <Button href="/fit/new">Start a Fitting Session</Button>
      </div>
    </main>
  );
}
