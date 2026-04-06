import { RuleEvaluation } from "./rules";

export const FIT_WEIGHTS = {
  distance: 0.25,
  dispersion: 0.3,
  launchSpin: 0.25,
  preference: 0.1,
  forgiveness: 0.1,
};

export function weightedScore(evaluation: RuleEvaluation): number {
  const score =
    evaluation.distance * FIT_WEIGHTS.distance +
    evaluation.dispersion * FIT_WEIGHTS.dispersion +
    evaluation.launchSpin * FIT_WEIGHTS.launchSpin +
    evaluation.preference * FIT_WEIGHTS.preference +
    evaluation.forgiveness * FIT_WEIGHTS.forgiveness;

  return Math.round(score);
}

export function scoreToConfidence(score: number, hasLaunchData: boolean): "High" | "Medium" | "Low" {
  if (!hasLaunchData) return "Low";
  if (score >= 80) return "High";
  if (score >= 65) return "Medium";
  return "Low";
}
