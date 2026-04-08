"use client";

import { useState } from "react";
import { DRILL_LIBRARY, WEAKNESS_OPTIONS } from "@/lib/training/drills";
import type { DrillType, Drill } from "@/lib/training/types";

const TYPE_OPTIONS: { value: DrillType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "warmup", label: "Warmup" },
  { value: "technical", label: "Technical" },
  { value: "pressure", label: "Pressure" },
  { value: "transfer", label: "Transfer" },
];

const CHIP = (active: boolean) =>
  `cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "border-gb-green bg-gb-green-soft text-gb-green"
      : "border-gb-line bg-gb-panel text-gb-muted hover:border-gb-green/40 hover:text-gb-text"
  }`;

function DrillCard({ drill }: { drill: Drill }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gb-line bg-gb-panel">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{drill.name}</span>
            <span className={`badge-${drill.type} rounded-md px-2 py-0.5 text-xs font-medium`}>
              {drill.type}
            </span>
          </div>
          <p className="mt-1 text-xs text-gb-muted">{drill.weaknesses.join(" · ")}</p>
        </div>
        <span className="mt-1 shrink-0 text-gb-muted">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="border-t border-gb-line px-5 pb-5 pt-4">
          <p className="text-sm leading-6 text-gb-muted">{drill.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {drill.levels.map((l) => (
              <span
                key={l}
                className="rounded-md border border-gb-line px-2 py-0.5 text-xs text-gb-muted"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DrillsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DrillType | "all">("all");
  const [weakness, setWeakness] = useState<string>("all");

  const filtered = DRILL_LIBRARY.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "all" || d.type === type;
    const matchWeakness = weakness === "all" || d.weaknesses.includes(weakness);
    return matchSearch && matchType && matchWeakness;
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Drill Library</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gb-muted">
        {DRILL_LIBRARY.length} structured drills organized by weakness, type, and skill level.
      </p>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="mt-8 space-y-4">
        <input
          type="text"
          placeholder="Search drills…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-md border border-gb-line bg-gb-input px-4 py-2.5 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40"
        />

        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={CHIP(type === t.value)}
              onClick={() => setType(t.value as DrillType | "all")}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className={CHIP(weakness === "all")} onClick={() => setWeakness("all")}>
            All weaknesses
          </button>
          {WEAKNESS_OPTIONS.map((w) => (
            <button
              key={w}
              type="button"
              className={CHIP(weakness === w)}
              onClick={() => setWeakness(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ────────────────────────────────────────────────── */}
      <p className="mt-6 text-xs text-gb-muted">
        Showing {filtered.length} of {DRILL_LIBRARY.length} drills
      </p>

      {/* ── Drill list ───────────────────────────────────────────────────── */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-gb-muted">No drills match your filters.</p>
        ) : (
          filtered.map((d) => <DrillCard key={d.id} drill={d} />)
        )}
      </div>
    </main>
  );
}
