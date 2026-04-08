"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { WEAKNESS_OPTIONS, HANDICAP_OPTIONS, getDrillById } from "@/lib/training/drills";
import type { Routine, TrainingProfile } from "@/lib/training/types";

const INPUT = "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40";
const CHIP = (active: boolean) =>
  `cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
    active
      ? "border-gb-green bg-gb-green-soft text-gb-green"
      : "border-gb-line bg-gb-panel text-gb-muted hover:border-gb-green/40 hover:text-gb-text"
  }`;

function TrainingContent() {
  const { user } = useAuth();

  // Profile form state
  const [name, setName] = useState("");
  const [handicap, setHandicap] = useState<string>("");
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [hoursPerSession, setHoursPerSession] = useState(1.5);
  const [notes, setNotes] = useState("");

  // Routine state
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<Routine | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [loadingRoutines, setLoadingRoutines] = useState(true);
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);

  const authHeader = useCallback(async (): Promise<Record<string, string>> => {
    if (!user) return {};
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const headers = await authHeader();
      const res = await fetch("/api/routines", { headers });
      if (res.ok) {
        const data = await res.json();
        setSavedRoutines(data.routines ?? []);
        if (data.routines?.length > 0) setActiveRoutine(data.routines[0]);
      }
      setLoadingRoutines(false);
    })();
  }, [user, authHeader]);

  function toggleWeakness(w: string) {
    setWeaknesses((prev) =>
      prev.includes(w) ? prev.filter((x) => x !== w) : prev.length < 2 ? [...prev, w] : prev,
    );
  }

  async function handleGenerate() {
    if (!handicap || weaknesses.length === 0) return;
    setGenerating(true);
    try {
      const profile: TrainingProfile = {
        name: name || "Player",
        handicap,
        weakness: weaknesses[0],
        weaknesses,
        daysPerWeek,
        hoursPerSession,
        notes,
      };
      const res = await fetch("/api/routines/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setGenerated(data.routine);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!generated || !user) return;
    setSaving(true);
    try {
      const headers = { ...(await authHeader()), "Content-Type": "application/json" };
      const res = await fetch("/api/routines", {
        method: "POST",
        headers,
        body: JSON.stringify({ routine: generated }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedRoutines((prev) => [data.routine, ...prev]);
        setActiveRoutine(data.routine);
        setGenerated(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleComplete(routineId: string, key: string) {
    const headers = { ...(await authHeader()), "Content-Type": "application/json" };
    await fetch(`/api/routines/${routineId}/complete`, {
      method: "POST",
      headers,
      body: JSON.stringify({ key }),
    });
    // Optimistic UI update
    setSavedRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, completions: { ...r.completions, [key]: !r.completions[key] } }
          : r,
      ),
    );
    if (activeRoutine?.id === routineId) {
      setActiveRoutine((r) =>
        r
          ? { ...r, completions: { ...r.completions, [key]: !r.completions[key] } }
          : r,
      );
    }
  }

  async function handleDelete(routineId: string) {
    const headers = await authHeader();
    await fetch(`/api/routines/${routineId}`, { method: "DELETE", headers });
    setSavedRoutines((prev) => prev.filter((r) => r.id !== routineId));
    if (activeRoutine?.id === routineId) {
      setActiveRoutine(savedRoutines.find((r) => r.id !== routineId) ?? null);
    }
  }

  const displayRoutine = generated ?? activeRoutine;

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Training Routines</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gb-muted">
        Generate a personalized 4-week practice plan targeting your weaknesses. Save it to track
        progress session by session.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* ── Profile / generate form ───────────────────────────────────── */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-gb-line bg-gb-panel p-6">
            <h2 className="text-base font-semibold">Your Profile</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gb-muted">Name</label>
                <input className={INPUT} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-muted">Skill level</label>
                <div className="flex flex-wrap gap-2">
                  {HANDICAP_OPTIONS.map((h) => (
                    <button key={h} type="button" className={CHIP(handicap === h)} onClick={() => setHandicap(h)}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-muted">
                  Weaknesses <span className="text-gb-muted/60">(pick up to 2)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {WEAKNESS_OPTIONS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      className={CHIP(weaknesses.includes(w))}
                      onClick={() => toggleWeakness(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-muted">
                  Days/week: <span className="text-gb-text">{daysPerWeek}</span>
                </label>
                <input
                  type="range" min={1} max={7} value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                  className="w-full accent-gb-green"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-muted">
                  Session length: <span className="text-gb-text">{hoursPerSession}hr</span>
                </label>
                <input
                  type="range" min={0.5} max={4} step={0.5} value={hoursPerSession}
                  onChange={(e) => setHoursPerSession(Number(e.target.value))}
                  className="w-full accent-gb-green"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gb-muted">Notes</label>
                <textarea
                  className={`${INPUT} resize-none`}
                  rows={2}
                  placeholder="e.g. Range only on weekdays"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              onClick={handleGenerate}
              disabled={generating || !handicap || weaknesses.length === 0}
            >
              {generating ? "Generating…" : "Generate 4-Week Routine"}
            </Button>
          </div>

          {/* Saved routines list */}
          {!loadingRoutines && savedRoutines.length > 0 && (
            <div className="rounded-xl border border-gb-line bg-gb-panel p-4">
              <h3 className="text-sm font-semibold text-gb-muted uppercase tracking-widest">
                Saved Routines
              </h3>
              <ul className="mt-3 space-y-2">
                {savedRoutines.map((r) => (
                  <li key={r.id} className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => { setActiveRoutine(r); setGenerated(null); }}
                      className={`flex-1 truncate rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        activeRoutine?.id === r.id && !generated
                          ? "bg-gb-green-soft text-gb-green"
                          : "text-gb-muted hover:text-gb-text"
                      }`}
                    >
                      {r.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => r.id && handleDelete(r.id)}
                      className="text-xs text-gb-muted hover:text-gb-cta"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* ── Routine display ───────────────────────────────────────────── */}
        <div>
          {!displayRoutine ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-gb-line text-gb-muted">
              {loadingRoutines ? "Loading…" : "Generate a routine to see it here."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{displayRoutine.title}</h2>
                  <p className="mt-1 text-sm text-gb-muted">{displayRoutine.meta}</p>
                </div>
                {generated && (
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving…" : "Save Routine"}
                  </Button>
                )}
              </div>

              {displayRoutine.weeks.map((week, wIdx) => (
                <details key={wIdx} className="rounded-xl border border-gb-line bg-gb-panel" open={wIdx === 0}>
                  <summary className="cursor-pointer select-none rounded-xl px-6 py-4 font-semibold hover:bg-gb-card">
                    {week.headline}
                  </summary>
                  <div className="space-y-3 px-6 pb-6 pt-2">
                    {week.sessions.map((session, sIdx) => {
                      const key = `${wIdx}-${sIdx}`;
                      const completed = displayRoutine.completions?.[key];
                      return (
                        <div
                          key={sIdx}
                          className={`rounded-lg border p-4 transition-colors ${
                            completed ? "border-gb-green/30 bg-gb-green-soft" : "border-gb-line bg-gb-bg"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <h4 className="font-semibold">{session.title}</h4>
                            {activeRoutine?.id && (
                              <button
                                type="button"
                                onClick={() => handleToggleComplete(activeRoutine.id!, key)}
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                                  completed
                                    ? "bg-gb-green text-white"
                                    : "border border-gb-line text-gb-muted hover:border-gb-green/40"
                                }`}
                              >
                                {completed ? "Done" : "Mark done"}
                              </button>
                            )}
                          </div>
                          <ul className="mt-2 space-y-1">
                            {session.bullets.map((b, i) => (
                              <li key={i} className="text-sm text-gb-muted">• {b}</li>
                            ))}
                          </ul>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {session.drillIds.map((id) => {
                              const drill = getDrillById(id);
                              if (!drill) return null;
                              return (
                                <span
                                  key={id}
                                  className={`badge-${drill.type} rounded-md px-2 py-0.5 text-xs font-medium`}
                                >
                                  {drill.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </details>
              ))}

              <div className="pt-2">
                <Button href="/drills" variant="secondary">
                  Browse full drill library →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function TrainingPage() {
  return (
    <AuthGuard>
      <TrainingContent />
    </AuthGuard>
  );
}
