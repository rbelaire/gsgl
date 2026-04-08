"use client";

import { useEffect, useMemo, useState } from "react";
import { balls, drivers, irons, shafts } from "@/lib/data/seed";
import type { EquipmentOption } from "@/lib/data/seed";
import type { RecommendationCategory } from "@/lib/fitting/types";
import { fetchEquipmentCatalog } from "@/lib/firebase/equipment";
import { EquipmentCard } from "@/components/catalog/EquipmentCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/helpers/cn";

const SEED_EQUIPMENT: EquipmentOption[] = [...drivers, ...shafts, ...irons, ...balls];

type CategoryFilter = "all" | RecommendationCategory;
type SortKey = "name-az" | "name-za" | "category";

const CATEGORY_TABS: { label: string; value: CategoryFilter }[] = [
  { label: "All", value: "all" },
  { label: "Drivers", value: "driver" },
  { label: "Shafts", value: "shaft" },
  { label: "Irons", value: "irons" },
  { label: "Balls", value: "ball" },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Name A→Z", value: "name-az" },
  { label: "Name Z→A", value: "name-za" },
  { label: "Category", value: "category" },
];

const CATEGORY_ORDER: Record<string, number> = {
  driver: 0, shaft: 1, irons: 2, ball: 3,
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
        active
          ? "border-gb-green bg-gb-green text-white"
          : "border-gb-line bg-gb-panel text-gb-muted hover:border-gb-green/50 hover:text-gb-text",
      )}
    >
      {label}
    </button>
  );
}

export default function CatalogPage() {
  const [allEquipment, setAllEquipment] = useState<EquipmentOption[]>(SEED_EQUIPMENT);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [spinFilter, setSpinFilter] = useState<string>("all");
  const [launchFilter, setLaunchFilter] = useState<string>("all");
  const [feelFilter, setFeelFilter] = useState<string>("all");
  const [forgivenessFilter, setForgivenessFilter] = useState<string>("all");
  const [weightFilter, setWeightFilter] = useState<string>("all");
  const [flexFilter, setFlexFilter] = useState<string>("all");

  // Sort
  const [sort, setSort] = useState<SortKey>("name-az");

  useEffect(() => {
    fetchEquipmentCatalog().then((catalog) => {
      const flat = [...catalog.drivers, ...catalog.shafts, ...catalog.irons, ...catalog.balls];
      if (flat.length > 0) setAllEquipment(flat);
      setLoading(false);
    });
  }, []);

  // Reset secondary filters when category changes
  function setCategory_(v: CategoryFilter) {
    setCategory(v);
    setSpinFilter("all");
    setLaunchFilter("all");
    setFeelFilter("all");
    setForgivenessFilter("all");
    setWeightFilter("all");
    setFlexFilter("all");
  }

  const filtered = useMemo(() => {
    let result = allEquipment;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.traits.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (category !== "all") result = result.filter((e) => e.category === category);
    if (spinFilter !== "all") result = result.filter((e) => e.spinProfile === spinFilter);
    if (launchFilter !== "all") result = result.filter((e) => e.launchProfile === launchFilter);
    if (feelFilter !== "all") result = result.filter((e) => e.feel === feelFilter);
    if (forgivenessFilter !== "all") result = result.filter((e) => e.forgivenessLevel === forgivenessFilter);
    if (weightFilter !== "all") result = result.filter((e) => e.weightClass === weightFilter);
    if (flexFilter !== "all") result = result.filter((e) => e.flexProfile === flexFilter);

    return [...result].sort((a, b) => {
      if (sort === "name-az") return a.name.localeCompare(b.name);
      if (sort === "name-za") return b.name.localeCompare(a.name);
      return (CATEGORY_ORDER[a.category] ?? 9) - (CATEGORY_ORDER[b.category] ?? 9);
    });
  }, [allEquipment, search, category, spinFilter, launchFilter, feelFilter, forgivenessFilter, weightFilter, flexFilter, sort]);

  function clearAll() {
    setSearch("");
    setCategory("all");
    setSpinFilter("all");
    setLaunchFilter("all");
    setFeelFilter("all");
    setForgivenessFilter("all");
    setWeightFilter("all");
    setFlexFilter("all");
  }

  const hasActiveFilters =
    search ||
    category !== "all" ||
    spinFilter !== "all" ||
    launchFilter !== "all" ||
    feelFilter !== "all" ||
    forgivenessFilter !== "all" ||
    weightFilter !== "all" ||
    flexFilter !== "all";

  // Show secondary filters only when relevant to the active category
  const showSpin = category === "all" || ["ball", "driver", "irons"].includes(category);
  const showLaunch = category === "all" || ["ball", "driver", "irons", "shaft"].includes(category);
  const showFeel = category === "all" || category === "ball";
  const showForgiveness = category === "all" || ["driver", "irons"].includes(category);
  const showWeight = category === "all" || category === "shaft";
  const showFlex = category === "all" || category === "shaft";

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gb-muted">
            Equipment catalog
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Know your options</h1>
          <p className="mt-2 max-w-xl text-sm text-gb-muted">
            Every piece of equipment we fit — explained plainly. Filter by what matters to your game.
          </p>
        </div>
        <Button href="/fit/new" className="shrink-0">
          Start a Fit
        </Button>
      </div>

      {/* Search + Sort row */}
      <div className="mt-10 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search equipment…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 flex-1 rounded-md border border-gb-line bg-gb-panel px-3 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40 min-w-[180px]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="h-9 rounded-md border border-gb-line bg-gb-panel px-3 text-sm text-gb-text focus:outline-none focus:ring-2 focus:ring-gb-green/40"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CATEGORY_TABS.map((f) => (
          <button
            key={f.value}
            onClick={() => setCategory_(f.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              category === f.value
                ? "bg-gb-green text-white"
                : "border border-gb-line text-gb-muted hover:border-gb-green/50 hover:text-gb-text",
            )}
          >
            {f.label}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs",
                category === f.value ? "bg-white/20" : "bg-gb-panel",
              )}
            >
              {f.value === "all"
                ? allEquipment.length
                : allEquipment.filter((e) => e.category === f.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Secondary filters */}
      <div className="mt-5 space-y-3">
        {showSpin && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gb-muted w-20 shrink-0">Spin</span>
            {["all", "low", "mid", "high"].map((v) => (
              <Chip key={v} label={v === "all" ? "Any" : v.charAt(0).toUpperCase() + v.slice(1)} active={spinFilter === v} onClick={() => setSpinFilter(v)} />
            ))}
          </div>
        )}
        {showLaunch && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gb-muted w-20 shrink-0">Launch</span>
            {["all", "low", "mid", "high"].map((v) => (
              <Chip key={v} label={v === "all" ? "Any" : v.charAt(0).toUpperCase() + v.slice(1)} active={launchFilter === v} onClick={() => setLaunchFilter(v)} />
            ))}
          </div>
        )}
        {showFeel && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gb-muted w-20 shrink-0">Feel</span>
            {["all", "firm", "balanced", "soft"].map((v) => (
              <Chip key={v} label={v === "all" ? "Any" : v.charAt(0).toUpperCase() + v.slice(1)} active={feelFilter === v} onClick={() => setFeelFilter(v)} />
            ))}
          </div>
        )}
        {showForgiveness && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gb-muted w-20 shrink-0">Forgiveness</span>
            {["all", "high", "mid", "low"].map((v) => (
              <Chip key={v} label={v === "all" ? "Any" : v.charAt(0).toUpperCase() + v.slice(1)} active={forgivenessFilter === v} onClick={() => setForgivenessFilter(v)} />
            ))}
          </div>
        )}
        {showWeight && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gb-muted w-20 shrink-0">Weight</span>
            {["all", "light", "mid", "heavy"].map((v) => (
              <Chip key={v} label={v === "all" ? "Any" : v.charAt(0).toUpperCase() + v.slice(1)} active={weightFilter === v} onClick={() => setWeightFilter(v)} />
            ))}
          </div>
        )}
        {showFlex && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-gb-muted w-20 shrink-0">Flex</span>
            {[
              { v: "all", label: "Any" },
              { v: "regular", label: "Regular" },
              { v: "stiff", label: "Stiff" },
              { v: "xstiff", label: "X-Stiff" },
            ].map(({ v, label }) => (
              <Chip key={v} label={label} active={flexFilter === v} onClick={() => setFlexFilter(v)} />
            ))}
          </div>
        )}
      </div>

      {/* Results bar */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-gb-muted">
          {loading ? (
            <span>Loading catalog…</span>
          ) : (
            <>
              <span className="font-semibold text-gb-text">{filtered.length}</span>{" "}
              {filtered.length === 1 ? "option" : "options"}
            </>
          )}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-gb-muted hover:text-gb-cta"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 && !loading ? (
        <div className="mt-10 rounded-xl border border-gb-line bg-gb-panel p-12 text-center">
          <p className="text-gb-muted">No equipment matches those filters.</p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-3 text-sm font-semibold text-gb-green hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((option) => (
            <EquipmentCard key={option.id} option={option} />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <section className="mt-16 rounded-xl border border-gb-green/20 bg-gb-green-soft px-8 py-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gb-muted">
          Ready to find your fit?
        </p>
        <h2 className="mt-3 text-2xl font-bold">Not sure which option is right for you?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gb-muted">
          The fitting engine scores every option against your swing speed, launch angle, miss
          tendency, and goals — then tells you exactly which combination matches your game.
        </p>
        <div className="mt-6">
          <Button href="/fit/new">Run Your Personalized Fit</Button>
        </div>
      </section>
    </main>
  );
}
