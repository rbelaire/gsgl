"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { onAuthStateChanged } from "firebase/auth";
import { Card } from "@/components/Card";
import { Stepper } from "@/components/Stepper";
import { TopNav } from "@/components/TopNav";
import { auth } from "@/lib/firebase/client";

const STEPS = ["Player profile", "Current equipment", "Launch data", "Goals"];

const defaultForm = {
  profile: {
    handicap: 12,
    heightIn: 70,
    wristToFloorIn: 34,
    ageRange: "30to50",
    tempo: "medium",
    missTendency: "right",
    trajectory: "mid",
  },
  equipment: {
    driverModel: "",
    driverLoft: "",
    driverShaft: "",
    ironModel: "",
    ironShaft: "",
    ballModel: "",
  },
  launchData: {
    clubSpeed: undefined as number | undefined,
    ballSpeed: undefined as number | undefined,
    launchAngle: undefined as number | undefined,
    spinRate: undefined as number | undefined,
    carryDistance: undefined as number | undefined,
    attackAngle: undefined as number | undefined,
    consistencyIndex: undefined as number | undefined,
  },
  goals: {
    moreDistance: true,
    lessSpin: false,
    higherLaunch: false,
    tighterDispersion: true,
    softerFeel: false,
  },
};

export default function NewFitPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const lowConfidence = useMemo(
    () => !Object.values(form.launchData).some((v) => v !== undefined && v !== null && v !== ""),
    [form.launchData],
  );

  async function withToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        unsub();
        if (!user) return reject(new Error("User not authenticated"));
        const token = await user.getIdToken();
        resolve(token);
      });
    });
  }

  function parseCsv(file: File) {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const row = results.data[0] as Record<string, string>;
        if (!row) return;
        setForm((prev) => ({
          ...prev,
          launchData: {
            clubSpeed: Number(row.clubSpeed) || undefined,
            ballSpeed: Number(row.ballSpeed) || undefined,
            launchAngle: Number(row.launchAngle) || undefined,
            spinRate: Number(row.spinRate) || undefined,
            carryDistance: Number(row.carryDistance) || undefined,
            attackAngle: Number(row.attackAngle) || undefined,
            consistencyIndex: Number(row.consistencyIndex) || undefined,
          },
        }));
      },
    });
  }

  async function submitFit() {
    setBusy(true);
    setError(null);
    try {
      const token = await withToken();
      const createRes = await fetch("/api/session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!createRes.ok) throw new Error("Failed to create session.");
      const { id } = await createRes.json();

      const recRes = await fetch("/api/session/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, sessionId: id }),
      });
      if (!recRes.ok) throw new Error("Failed to generate recommendations.");

      router.push(`/session/${id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <TopNav />
      <div className="mx-auto max-w-4xl p-4">
        <h1 className="mb-4 text-2xl font-bold">New Fit</h1>
        <Stepper steps={STEPS} currentStep={step} />
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}
        {lowConfidence ? <p className="mb-4 text-sm text-amber-700">Launch data is empty. Results will be marked low confidence.</p> : null}

        {step === 0 ? (
          <Card title="Player profile">
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded border p-2" type="number" value={form.profile.handicap} onChange={(e) => setForm({ ...form, profile: { ...form.profile, handicap: Number(e.target.value) } })} placeholder="Handicap" />
              <input className="rounded border p-2" type="number" value={form.profile.heightIn} onChange={(e) => setForm({ ...form, profile: { ...form.profile, heightIn: Number(e.target.value) } })} placeholder="Height (in)" />
              <input className="rounded border p-2" type="number" value={form.profile.wristToFloorIn} onChange={(e) => setForm({ ...form, profile: { ...form.profile, wristToFloorIn: Number(e.target.value) } })} placeholder="Wrist to floor (in)" />
              <select className="rounded border p-2" value={form.profile.ageRange} onChange={(e) => setForm({ ...form, profile: { ...form.profile, ageRange: e.target.value as typeof form.profile.ageRange } })}><option value="under30">Under 30</option><option value="30to50">30-50</option><option value="over50">Over 50</option></select>
              <select className="rounded border p-2" value={form.profile.tempo} onChange={(e) => setForm({ ...form, profile: { ...form.profile, tempo: e.target.value as typeof form.profile.tempo } })}><option value="smooth">Smooth</option><option value="medium">Medium</option><option value="aggressive">Aggressive</option></select>
              <select className="rounded border p-2" value={form.profile.missTendency} onChange={(e) => setForm({ ...form, profile: { ...form.profile, missTendency: e.target.value as typeof form.profile.missTendency } })}><option value="left">Left</option><option value="right">Right</option><option value="both">Both</option></select>
              <select className="rounded border p-2" value={form.profile.trajectory} onChange={(e) => setForm({ ...form, profile: { ...form.profile, trajectory: e.target.value as typeof form.profile.trajectory } })}><option value="low">Low</option><option value="mid">Mid</option><option value="high">High</option></select>
            </div>
          </Card>
        ) : null}

        {step === 1 ? (
          <Card title="Current equipment">
            <div className="grid gap-3 md:grid-cols-2">
              {Object.keys(form.equipment).map((k) => (
                <input
                  key={k}
                  className="rounded border p-2"
                  placeholder={k}
                  value={form.equipment[k as keyof typeof form.equipment]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      equipment: { ...form.equipment, [k]: e.target.value },
                    })
                  }
                />
              ))}
            </div>
          </Card>
        ) : null}

        {step === 2 ? (
          <Card title="Launch data">
            <p className="mb-3 text-sm text-slate-600">Manual input or CSV upload using headers: clubSpeed, ballSpeed, launchAngle, spinRate, carryDistance, attackAngle, consistencyIndex.</p>
            <input className="mb-3" type="file" accept=".csv" onChange={(e) => e.target.files?.[0] && parseCsv(e.target.files[0])} />
            <div className="grid gap-3 md:grid-cols-2">
              {Object.keys(form.launchData).map((k) => (
                <input
                  key={k}
                  className="rounded border p-2"
                  placeholder={k}
                  type="number"
                  value={form.launchData[k as keyof typeof form.launchData] ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      launchData: { ...form.launchData, [k]: e.target.value === "" ? undefined : Number(e.target.value) },
                    })
                  }
                />
              ))}
            </div>
          </Card>
        ) : null}

        {step === 3 ? (
          <Card title="Goals">
            <div className="grid gap-2">
              {Object.keys(form.goals).map((k) => (
                <label key={k} className="flex items-center gap-2 rounded border p-2">
                  <input
                    type="checkbox"
                    checked={form.goals[k as keyof typeof form.goals]}
                    onChange={(e) => setForm({ ...form, goals: { ...form.goals, [k]: e.target.checked } })}
                  />
                  <span>{k}</span>
                </label>
              ))}
            </div>
          </Card>
        ) : null}

        <div className="mt-5 flex justify-between">
          <button className="rounded border px-4 py-2" disabled={step === 0} onClick={() => setStep(step - 1)} type="button">
            Back
          </button>
          {step < 3 ? (
            <button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={() => setStep(step + 1)} type="button">
              Next
            </button>
          ) : (
            <button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={submitFit} disabled={busy} type="button">
              {busy ? "Running fit..." : "Run recommendation"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
