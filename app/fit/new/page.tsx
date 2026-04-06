"use client";

import { useState } from "react";
import { Stepper } from "@/components/fit/Stepper";
import { FormSectionWrapper } from "@/components/fit/FormSectionWrapper";
import { Button } from "@/components/ui/Button";

const steps = ["Player Profile", "Current Equipment", "Launch Data", "Goals", "Review"];

export default function NewFitPage() {
  const [step, setStep] = useState(0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight text-gsgl-navy">New Fitting Workflow</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-gsgl-gray">
        This step-by-step shell is ready for future recommendation logic and Firebase-backed persistence.
      </p>

      <div className="mt-8">
        <Stepper steps={steps} currentStep={step} />
      </div>

      <div className="mt-8">
        {step === 0 && (
          <FormSectionWrapper title="Player Profile" description="Capture baseline inputs and tendencies.">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Handicap" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Typical tempo" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Common miss tendency" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Preferred trajectory" />
            </div>
          </FormSectionWrapper>
        )}

        {step === 1 && (
          <FormSectionWrapper title="Current Equipment" description="Document current bag setup before recommendation generation.">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Current driver model" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Current ball model" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Iron model and shaft" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Gap concerns" />
            </div>
          </FormSectionWrapper>
        )}

        {step === 2 && (
          <FormSectionWrapper title="Launch Data" description="Add monitor metrics used in fit scoring and confidence calculations.">
            <div className="grid gap-4 md:grid-cols-3">
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Club speed" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Ball speed" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Spin rate" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Launch angle" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Carry distance" />
              <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Dispersion window" />
            </div>
          </FormSectionWrapper>
        )}

        {step === 3 && (
          <FormSectionWrapper title="Goals" description="Choose the outcomes that should carry the most weight.">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Tighter dispersion",
                "Lower driver spin",
                "More carry distance",
                "Higher stopping power",
              ].map((goal) => (
                <label key={goal} className="flex items-center gap-3 rounded-md border border-gsgl-navy/15 bg-gsgl-offwhite px-4 py-3 text-sm text-gsgl-navy">
                  <input type="checkbox" />
                  {goal}
                </label>
              ))}
            </div>
          </FormSectionWrapper>
        )}

        {step === 4 && (
          <FormSectionWrapper title="Review" description="Confirm inputs before generating recommendations.">
            <div className="rounded-lg border border-gsgl-gold/30 bg-gsgl-sand p-5">
              <p className="text-sm leading-7 text-gsgl-gray">
                Review step placeholder. Connect this state to session persistence and recommendation generation when the fitting engine is integrated.
              </p>
            </div>
          </FormSectionWrapper>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setStep((prev) => Math.max(prev - 1, 0))}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}>Next Step</Button>
        ) : (
          <Button href="/fit/results">View Sample Results</Button>
        )}
      </div>
    </main>
  );
}
