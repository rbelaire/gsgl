"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { RecommendationCard } from "@/components/results/RecommendationCard";
import { ScoreBreakdownChart } from "@/components/results/ScoreBreakdownChart";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { resultPanels } from "@/lib/mock-data/site";
import type { FitRecommendationResult } from "@/lib/fitting/types";

const scoredRecSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["ball", "driver", "irons", "shaft"]),
  score: z.number(),
  reasons: z.array(z.string()),
  expectedImprovement: z.string(),
  confidence: z.enum(["High", "Medium", "Low"]),
  components: z.object({
    distance: z.number(),
    dispersion: z.number(),
    launchSpin: z.number(),
    feel: z.number(),
    forgiveness: z.number(),
  }),
  swappedForCoherence: z.boolean().optional(),
});

const fitResultSchema = z.object({
  ball: z.array(scoredRecSchema),
  driver: z.array(scoredRecSchema),
  irons: z.array(scoredRecSchema),
  shafts: z.array(scoredRecSchema),
  confidence: z.enum(["High", "Medium", "Low"]),
  dataConfidence: z.enum(["none", "profile_only", "profile_and_launch"]),
  matchStrength: z.enum(["strong", "moderate", "weak"]),
  buildSpecs: z.object({
    lengthAdjustment: z.string(),
    lieAdjustment: z.string(),
    gripSize: z.string(),
  }),
  confidenceSummary: z.string(),
});

const CONFIDENCE_BADGE: Record<string, string> = {
  High: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Low: "text-slate-600 bg-slate-50 border-slate-200",
};

const CONFIDENCE_MSG: Record<string, string> = {
  High: "Strong launch data confidence. Recommendations are well-anchored in measurable inputs.",
  Medium: "Moderate confidence. Adding more launch data will sharpen results.",
  Low: "Low confidence. Provide launch monitor data for higher-precision recommendations.",
};

export default function FitResultsPage() {
  const [result, setResult] = useState<FitRecommendationResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("gsgl_fit_result");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validated = fitResultSchema.parse(parsed) as FitRecommendationResult;
        setResult(validated);
      } catch {
        // Invalid or tampered data — fall through to mock display
      }
    }
  }, []);

  // ── Live engine result view ────────────────────────────────────────────
  if (result) {
    const picks = [
      { title: "Recommended Ball", rec: result.ball[0] },
      { title: "Recommended Driver", rec: result.driver[0] },
      { title: "Recommended Irons", rec: result.irons[0] },
      { title: "Recommended Shaft", rec: result.shafts[0] },
    ].filter((p): p is { title: string; rec: NonNullable<typeof p.rec> } =>
      p.rec !== undefined,
    );

    const { buildSpecs, confidence } = result;
    const overallPct = Math.round(
      picks.reduce((s, p) => s + p.rec.score, 0) / picks.length,
    );

    return (
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20 print:py-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeader
            eyebrow="Results"
            title="Recommendation Summary"
            description="Personalized recommendations generated from your profile and launch data."
          />
          <button
            onClick={() => window.print()}
            className="print:hidden shrink-0 inline-flex items-center gap-2 rounded-md border border-gb-line bg-gb-panel px-4 py-2.5 text-sm font-semibold text-gb-text transition-colors hover:bg-gb-card"
          >
            Print / Export PDF
          </button>
        </div>

        {/* Top picks */}
        <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4 print:grid-cols-2">
          {picks.map(({ title, rec }) => (
            <RecommendationCard
              key={title}
              title={title}
              value={rec.name}
              summary={rec.expectedImprovement}
            />
          ))}
        </div>

        {/* Score breakdown charts */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-gb-text">Score breakdown by dimension</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2">
            {picks.map(({ title, rec }) => (
              <div
                key={title}
                className="rounded-xl border border-gb-line bg-gb-panel p-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gb-muted">
                  {title.replace("Recommended ", "")}
                </p>
                <p className="mt-1 text-sm font-medium text-gb-text">{rec.name}</p>
                <ScoreBreakdownChart components={rec.components} />
              </div>
            ))}
          </div>
        </section>

        {/* Build specs */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Length adjustment", value: buildSpecs.lengthAdjustment },
            { label: "Lie adjustment", value: buildSpecs.lieAdjustment },
            { label: "Grip size", value: buildSpecs.gripSize },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-gb-line bg-gb-panel p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gb-muted">
                {label}
              </p>
              <p className="mt-2 text-lg font-semibold text-gb-text">{value}</p>
            </div>
          ))}
        </section>

        {/* Rationale + confidence */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gb-text">Fit rationale</h2>
            <ul className="mt-4 space-y-2">
              {picks
                .flatMap((p) => p.rec.reasons)
                .slice(0, 6)
                .map((r, i) => (
                  <li key={i} className="text-sm leading-6 text-gb-muted">
                    • {r}
                  </li>
                ))}
            </ul>
          </article>

          <article className="rounded-xl border border-gb-green/20 bg-gb-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gb-text">Confidence Level</h2>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-4xl font-bold text-gb-text">{overallPct}%</p>
              <span
                className={`mb-1 rounded-md border px-2 py-0.5 text-xs font-semibold ${CONFIDENCE_BADGE[confidence]}`}
              >
                {confidence}
              </span>
            </div>
            <p className="mt-3 text-sm text-gb-muted">{CONFIDENCE_MSG[confidence]}</p>
          </article>
        </section>

        {/* Next steps */}
        <section className="mt-8 rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gb-text">Next Steps</h2>
          <ul className="mt-4 space-y-2 text-sm text-gb-muted">
            <li>• Validate driver setup in a 10-shot controlled test block.</li>
            <li>• Confirm iron descent angles with 7-iron and 5-iron sessions.</li>
            <li>• Recheck bag gapping after final shaft decision.</li>
          </ul>
        </section>

        <div className="print:hidden mt-8 flex gap-3">
          <Button href="/fit/new" variant="secondary">
            Start New Fit
          </Button>
          <Button href="/dashboard" variant="ghost">
            Dashboard
          </Button>
        </div>
      </main>
    );
  }

  // ── Fallback: sample/mock layout ──────────────────────────────────────
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20 print:py-3">
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
        <article className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gb-text">Why this was chosen</h2>
          <p className="mt-4 text-sm leading-7 text-gb-muted">
            Launch and dispersion inputs indicate the player benefits from reducing driver spin while preserving iron descent angle. The selected setup prioritizes tighter directional control and predictable carry gaps.
          </p>
        </article>

        <article className="rounded-xl border border-gb-green/20 bg-gb-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gb-text">Confidence Level</h2>
          <p className="mt-3 text-4xl font-bold text-gb-text">84%</p>
          <p className="mt-3 text-sm text-gb-muted">
            Sample values. Run a full fitting session to see live confidence scores.
          </p>
        </article>
      </section>

      <section className="mt-10 rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gb-text">Next Steps</h2>
        <ul className="mt-4 space-y-2 text-sm text-gb-muted">
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
