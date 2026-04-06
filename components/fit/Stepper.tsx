import { cn } from "@/lib/helpers/cn";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="grid gap-3 sm:grid-cols-5">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <li
            key={step}
            className={cn(
              "rounded-lg border px-3 py-3 text-sm",
              isActive && "border-gsgl-gold bg-gsgl-sand text-gsgl-navy",
              isComplete && "border-gsgl-navy/20 bg-white text-gsgl-navy",
              !isActive && !isComplete && "border-gsgl-navy/10 bg-white/50 text-gsgl-gray",
            )}
          >
            <p className="text-xs uppercase tracking-wide">Step {index + 1}</p>
            <p className="mt-1 font-medium">{step}</p>
          </li>
        );
      })}
    </ol>
  );
}
