interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">
      {steps.map((step, idx) => {
        const active = idx === currentStep;
        const complete = idx < currentStep;
        return (
          <div
            key={step}
            className={`rounded-lg border p-3 text-sm ${
              complete
                ? "border-emerald-500 bg-emerald-50"
                : active
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
            }`}
          >
            <p className="font-medium">Step {idx + 1}</p>
            <p className="text-slate-600">{step}</p>
          </div>
        );
      })}
    </div>
  );
}
