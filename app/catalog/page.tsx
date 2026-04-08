"use client";

import { useMemo, useState } from "react";
import { balls, drivers, irons, shafts } from "@/lib/data/seed";
import type { EquipmentOption } from "@/lib/data/seed";
import type { RecommendationCategory } from "@/lib/fitting/types";
import { EquipmentCard } from "@/components/catalog/EquipmentCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/helpers/cn";

const ALL_EQUIPMENT: EquipmentOption[] = [...drivers, ...shafts, ...irons, ...balls];

type FilterValue = "all" | RecommendationCategory;

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: "All Equipment", value: "all" },
  { label: "Drivers", value: "driver" },
  { label: "Shafts", value: "shaft" },
  { label: "Irons", value: "irons" },
  { label: "Balls", value: "ball" },
];

function countFor(value: FilterValue) {
  return value === "all"
    ? ALL_EQUIPMENT.length
    : ALL_EQUIPMENT.filter((e) => e.category === value).length;
}

export default function CatalogPage() {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () =>
      activeFilter === "all"
        ? ALL_EQUIPMENT
        : ALL_EQUIPMENT.filter((e) => e.category === activeFilter),
    [activeFilter],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      {/* Header row */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Equipment catalog"
          title="Know your options before you fit"
          description="Every piece of equipment we fit, explained in plain language. No jargon — just what each option does, who it helps, and when to consider it."
        />
        <Button href="/fit/new" className="shrink-0">
          Start a Fit
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="mt-10 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-gsgl-navy text-white"
                  : "border border-gsgl-navy/20 bg-white text-gsgl-gray hover:bg-gsgl-sand hover:text-gsgl-navy",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  isActive ? "bg-white/20 text-white" : "bg-gsgl-offwhite text-gsgl-slate",
                )}
              >
                {countFor(f.value)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-gsgl-gray">
        Showing{" "}
        <span className="font-semibold text-gsgl-navy">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "option" : "options"}
        {activeFilter !== "all" && (
          <>
            {" "}in{" "}
            <span className="font-semibold text-gsgl-navy capitalize">
              {activeFilter === "irons" ? "Irons" : activeFilter + "s"}
            </span>
          </>
        )}
      </p>

      {/* Equipment grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((option) => (
          <EquipmentCard key={option.id} option={option} />
        ))}
      </div>

      {/* Bottom CTA banner */}
      <section className="mt-16 rounded-xl border border-gsgl-gold/30 bg-gsgl-sand px-8 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gsgl-slate">
          Ready to find your fit?
        </p>
        <h2 className="mt-3 text-2xl font-bold text-gsgl-navy">
          Not sure which option is right for you?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gsgl-gray">
          The fitting engine scores every option against your specific swing speed, launch
          angle, miss tendency, and goals — then tells you exactly which combination matches
          your game.
        </p>
        <div className="mt-6">
          <Button href="/fit/new">Run Your Personalized Fit</Button>
        </div>
      </section>
    </main>
  );
}
