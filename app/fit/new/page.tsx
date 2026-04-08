"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/fit/Stepper";
import { FormSectionWrapper } from "@/components/fit/FormSectionWrapper";
import { Button } from "@/components/ui/Button";
import { runFittingEngine } from "@/lib/fitting/engine";
import { fetchEquipmentCatalog } from "@/lib/firebase/equipment";
import { saveSession } from "@/lib/session-history";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  profileSchema,
  equipmentSchema,
  launchDataSchema,
  goalsSchema,
} from "@/lib/session-schema";

const steps = ["Player Profile", "Current Equipment", "Launch Data", "Goals", "Review"];

const INPUT_CLS = "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40";
const SELECT_CLS = "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2 text-sm text-gb-text focus:outline-none focus:ring-2 focus:ring-gb-green/40";
const ERROR_CLS = "mt-1 text-xs text-red-400";

type FieldErrors = Record<string, string>;

function parseErrors(err: unknown): FieldErrors {
  if (err && typeof err === "object" && "errors" in err) {
    const issues = (err as { errors: { path: (string | number)[]; message: string }[] }).errors;
    return Object.fromEntries(issues.map((i) => [i.path.join("."), i.message]));
  }
  return {};
}

function NewFitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Step 0 – Player Profile
  const [handicap, setHandicap] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [wristToFloorIn, setWristToFloorIn] = useState("");
  const [ageRange, setAgeRange] = useState<"under30" | "30to50" | "over50">("30to50");
  const [tempo, setTempo] = useState<"smooth" | "medium" | "aggressive">("medium");
  const [missTendency, setMissTendency] = useState<"left" | "right" | "both">("both");
  const [trajectory, setTrajectory] = useState<"low" | "mid" | "high">("mid");

  // Step 1 – Current Equipment
  const [driverModel, setDriverModel] = useState("");
  const [driverLoft, setDriverLoft] = useState("");
  const [driverShaft, setDriverShaft] = useState("");
  const [ironModel, setIronModel] = useState("");
  const [ironShaft, setIronShaft] = useState("");
  const [ballModel, setBallModel] = useState("");

  // Step 2 – Launch Data
  const [clubSpeed, setClubSpeed] = useState("");
  const [ballSpeed, setBallSpeed] = useState("");
  const [spinRate, setSpinRate] = useState("");
  const [launchAngle, setLaunchAngle] = useState("");
  const [carryDistance, setCarryDistance] = useState("");
  const [attackAngle, setAttackAngle] = useState("");
  const [consistencyIndex, setConsistencyIndex] = useState("");

  // Step 3 – Goals
  const [moreDistance, setMoreDistance] = useState(false);
  const [lessSpin, setLessSpin] = useState(false);
  const [higherLaunch, setHigherLaunch] = useState(false);
  const [tighterDispersion, setTighterDispersion] = useState(false);
  const [softerFeel, setSofterFeel] = useState(false);

  function validateCurrentStep(): boolean {
    try {
      if (step === 0) {
        profileSchema.parse({ handicap, heightIn, wristToFloorIn, ageRange, tempo, missTendency, trajectory });
      } else if (step === 1) {
        equipmentSchema.parse({ driverModel, driverLoft, driverShaft, ironModel, ironShaft, ballModel });
      } else if (step === 2) {
        launchDataSchema.parse({ clubSpeed: clubSpeed || undefined, ballSpeed: ballSpeed || undefined, spinRate: spinRate || undefined, launchAngle: launchAngle || undefined, carryDistance: carryDistance || undefined, attackAngle: attackAngle || undefined, consistencyIndex: consistencyIndex || undefined });
      } else if (step === 3) {
        goalsSchema.parse({ moreDistance, lessSpin, higherLaunch, tighterDispersion, softerFeel });
      }
      setErrors({});
      return true;
    } catch (err) {
      setErrors(parseErrors(err));
      return false;
    }
  }

  function handleNext() {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }

  function handleBack() {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit() {
    const input = {
      profile: { handicap: Number(handicap), heightIn: Number(heightIn), wristToFloorIn: Number(wristToFloorIn), ageRange, tempo, missTendency, trajectory },
      equipment: { driverModel, driverLoft, driverShaft, ironModel, ironShaft, ballModel },
      launchData: {
        clubSpeed: clubSpeed ? Number(clubSpeed) : undefined,
        ballSpeed: ballSpeed ? Number(ballSpeed) : undefined,
        spinRate: spinRate ? Number(spinRate) : undefined,
        launchAngle: launchAngle ? Number(launchAngle) : undefined,
        carryDistance: carryDistance ? Number(carryDistance) : undefined,
        attackAngle: attackAngle ? Number(attackAngle) : undefined,
        consistencyIndex: consistencyIndex ? Number(consistencyIndex) : undefined,
      },
      goals: { moreDistance, lessSpin, higherLaunch, tighterDispersion, softerFeel },
    };

    const catalog = await fetchEquipmentCatalog();
    const result = runFittingEngine(input, catalog);
    sessionStorage.setItem("gsgl_fit_result", JSON.stringify(result));

    const goalLabels = [
      moreDistance && "More distance",
      lessSpin && "Less spin",
      higherLaunch && "Higher launch",
      tighterDispersion && "Tighter dispersion",
      softerFeel && "Softer feel",
    ].filter(Boolean) as string[];
    saveSession(result, goalLabels);

    router.push("/fit/results");
  }

  const e = (key: string) => errors[key] ? <p className={ERROR_CLS}>{errors[key]}</p> : null;

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-gb-text">New Fitting Workflow</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gb-muted">
        Complete each section to generate a personalized equipment recommendation.
      </p>

      <div className="mt-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <div className="mt-8">
        {step === 0 && (
          <FormSectionWrapper title="Player Profile" description="Capture baseline inputs and tendencies.">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="handicap">Handicap (0–54)</label>
                <input id="handicap" name="handicap" type="number" min={0} max={54} className={INPUT_CLS} placeholder="e.g. 12" value={handicap} onChange={(ev) => setHandicap(ev.target.value)} />
                {e("handicap")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="heightIn">Height (inches)</label>
                <input id="heightIn" name="heightIn" type="number" min={48} max={84} className={INPUT_CLS} placeholder="e.g. 70" value={heightIn} onChange={(ev) => setHeightIn(ev.target.value)} />
                {e("heightIn")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="wristToFloorIn">Wrist-to-floor (inches)</label>
                <input id="wristToFloorIn" name="wristToFloorIn" type="number" min={20} max={45} className={INPUT_CLS} placeholder="e.g. 33" value={wristToFloorIn} onChange={(ev) => setWristToFloorIn(ev.target.value)} />
                {e("wristToFloorIn")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="ageRange">Age range</label>
                <select id="ageRange" name="ageRange" className={SELECT_CLS} value={ageRange} onChange={(ev) => setAgeRange(ev.target.value as typeof ageRange)}>
                  <option value="under30">Under 30</option>
                  <option value="30to50">30–50</option>
                  <option value="over50">Over 50</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="tempo">Swing tempo</label>
                <select id="tempo" name="tempo" className={SELECT_CLS} value={tempo} onChange={(ev) => setTempo(ev.target.value as typeof tempo)}>
                  <option value="smooth">Smooth</option>
                  <option value="medium">Medium</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="missTendency">Common miss</label>
                <select id="missTendency" name="missTendency" className={SELECT_CLS} value={missTendency} onChange={(ev) => setMissTendency(ev.target.value as typeof missTendency)}>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="both">Both / Inconsistent</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="trajectory">Preferred trajectory</label>
                <select id="trajectory" name="trajectory" className={SELECT_CLS} value={trajectory} onChange={(ev) => setTrajectory(ev.target.value as typeof trajectory)}>
                  <option value="low">Low</option>
                  <option value="mid">Mid</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </FormSectionWrapper>
        )}

        {step === 1 && (
          <FormSectionWrapper title="Current Equipment" description="Document your current bag setup.">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="driverModel">Driver model</label>
                <input id="driverModel" name="driverModel" className={INPUT_CLS} placeholder="e.g. Titleist TSR3" value={driverModel} onChange={(ev) => setDriverModel(ev.target.value)} />
                {e("driverModel")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="driverLoft">Driver loft</label>
                <input id="driverLoft" name="driverLoft" className={INPUT_CLS} placeholder="e.g. 10.5°" value={driverLoft} onChange={(ev) => setDriverLoft(ev.target.value)} />
                {e("driverLoft")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="driverShaft">Driver shaft</label>
                <input id="driverShaft" name="driverShaft" className={INPUT_CLS} placeholder="e.g. Aldila Ascent 60S" value={driverShaft} onChange={(ev) => setDriverShaft(ev.target.value)} />
                {e("driverShaft")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="ballModel">Ball model</label>
                <input id="ballModel" name="ballModel" className={INPUT_CLS} placeholder="e.g. Titleist Pro V1" value={ballModel} onChange={(ev) => setBallModel(ev.target.value)} />
                {e("ballModel")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="ironModel">Iron model</label>
                <input id="ironModel" name="ironModel" className={INPUT_CLS} placeholder="e.g. Mizuno JPX 923 Forged" value={ironModel} onChange={(ev) => setIronModel(ev.target.value)} />
                {e("ironModel")}
              </div>
              <div>
                <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="ironShaft">Iron shaft</label>
                <input id="ironShaft" name="ironShaft" className={INPUT_CLS} placeholder="e.g. Dynamic Gold 105 S300" value={ironShaft} onChange={(ev) => setIronShaft(ev.target.value)} />
                {e("ironShaft")}
              </div>
            </div>
          </FormSectionWrapper>
        )}

        {step === 2 && (
          <FormSectionWrapper title="Launch Data" description="Add monitor metrics used in scoring and confidence calculations. All fields optional.">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { id: "clubSpeed", label: "Club speed (mph)", val: clubSpeed, set: setClubSpeed },
                { id: "ballSpeed", label: "Ball speed (mph)", val: ballSpeed, set: setBallSpeed },
                { id: "spinRate", label: "Spin rate (rpm)", val: spinRate, set: setSpinRate },
                { id: "launchAngle", label: "Launch angle (°)", val: launchAngle, set: setLaunchAngle },
                { id: "carryDistance", label: "Carry distance (yds)", val: carryDistance, set: setCarryDistance },
                { id: "attackAngle", label: "Attack angle (°)", val: attackAngle, set: setAttackAngle },
                { id: "consistencyIndex", label: "Consistency index", val: consistencyIndex, set: setConsistencyIndex },
              ].map(({ id, label, val, set }) => (
                <div key={id}>
                  <label className="block text-xs font-medium text-gb-text mb-1" htmlFor={id}>{label}</label>
                  <input id={id} name={id} type="number" className={INPUT_CLS} value={val} onChange={(ev) => set(ev.target.value)} />
                  {e(id)}
                </div>
              ))}
            </div>
          </FormSectionWrapper>
        )}

        {step === 3 && (
          <FormSectionWrapper title="Goals" description="Choose the outcomes that should carry the most weight.">
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { id: "moreDistance", label: "More carry distance", val: moreDistance, set: setMoreDistance },
                { id: "lessSpin", label: "Lower driver spin", val: lessSpin, set: setLessSpin },
                { id: "higherLaunch", label: "Higher launch angle", val: higherLaunch, set: setHigherLaunch },
                { id: "tighterDispersion", label: "Tighter dispersion", val: tighterDispersion, set: setTighterDispersion },
                { id: "softerFeel", label: "Softer feel", val: softerFeel, set: setSofterFeel },
              ] as { id: string; label: string; val: boolean; set: (v: boolean) => void }[]).map(({ id, label, val, set }) => (
                <label key={id} htmlFor={id} className="flex items-center gap-3 rounded-md border border-gb-line bg-gb-bg px-4 py-3 text-sm text-gb-text cursor-pointer">
                  <input id={id} type="checkbox" checked={val} onChange={(ev) => set(ev.target.checked)} className="accent-gsgl-gold" />
                  {label}
                </label>
              ))}
            </div>
          </FormSectionWrapper>
        )}

        {step === 4 && (
          <FormSectionWrapper title="Review" description="Confirm inputs before generating recommendations.">
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div className="rounded-lg border border-gb-line bg-gb-panel p-4">
                <dt className="font-semibold text-gb-text mb-1">Player Profile</dt>
                <dd className="text-gb-muted space-y-0.5">
                  <p>Handicap: {handicap || "—"}</p>
                  <p>Height: {heightIn ? `${heightIn}"` : "—"} · Wrist-to-floor: {wristToFloorIn ? `${wristToFloorIn}"` : "—"}</p>
                  <p>Age: {ageRange} · Tempo: {tempo} · Miss: {missTendency} · Traj: {trajectory}</p>
                </dd>
              </div>
              <div className="rounded-lg border border-gb-line bg-gb-panel p-4">
                <dt className="font-semibold text-gb-text mb-1">Current Equipment</dt>
                <dd className="text-gb-muted space-y-0.5">
                  <p>Driver: {driverModel || "—"} {driverLoft} / {driverShaft || "—"}</p>
                  <p>Irons: {ironModel || "—"} / {ironShaft || "—"}</p>
                  <p>Ball: {ballModel || "—"}</p>
                </dd>
              </div>
              <div className="rounded-lg border border-gb-line bg-gb-panel p-4">
                <dt className="font-semibold text-gb-text mb-1">Launch Data</dt>
                <dd className="text-gb-muted space-y-0.5">
                  <p>Club spd: {clubSpeed || "—"} · Ball spd: {ballSpeed || "—"}</p>
                  <p>Spin: {spinRate || "—"} · Launch: {launchAngle || "—"}°</p>
                  <p>Carry: {carryDistance || "—"} · AoA: {attackAngle || "—"}</p>
                </dd>
              </div>
              <div className="rounded-lg border border-gb-line bg-gb-panel p-4">
                <dt className="font-semibold text-gb-text mb-1">Goals</dt>
                <dd className="text-gb-muted">
                  {[moreDistance && "More distance", lessSpin && "Less spin", higherLaunch && "Higher launch", tighterDispersion && "Tighter dispersion", softerFeel && "Softer feel"].filter(Boolean).join(", ") || "None selected"}
                </dd>
              </div>
            </dl>
          </FormSectionWrapper>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="secondary" onClick={handleBack} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={handleNext}>Next Step</Button>
        ) : (
          <Button onClick={handleSubmit}>Generate Recommendations</Button>
        )}
      </div>
    </main>
  );
}

export default function NewFitPageGuarded() {
  return (
    <AuthGuard>
      <NewFitPage />
    </AuthGuard>
  );
}
