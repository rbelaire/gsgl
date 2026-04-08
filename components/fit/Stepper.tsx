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
              isActive && "border-gsgl-gold bg-gb-card text-gb-text",
              isComplete && "border-gb-line bg-gb-panel text-gb-text",
              !isActive && !isComplete && "border-gb-line bg-gb-panel/50 text-gb-muted",
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
