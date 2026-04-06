import { balls, drivers, irons, shafts } from "../data/seed";
import { evaluateOption } from "./rules";
import { scoreToConfidence, weightedScore } from "./scoring";
import { FitRecommendationResult, FitSessionInput, ScoredRecommendation } from "./types";

function buildSpecs(input: FitSessionInput) {
  const { heightIn, wristToFloorIn } = input.profile;
  let lengthAdjustment = "Standard";
  let lieAdjustment = "Standard";

  if (heightIn > 74 && wristToFloorIn > 36) {
    lengthAdjustment = "+0.5 in";
    lieAdjustment = "+1° upright";
  } else if (heightIn < 66 && wristToFloorIn < 32) {
    lengthAdjustment = "-0.5 in";
    lieAdjustment = "-1° flat";
  }

  const gripSize = heightIn > 73 ? "Midsize" : "Standard";

  return { lengthAdjustment, lieAdjustment, gripSize };
}

function expectedGain(category: string, score: number): string {
  if (score >= 80) return `Strong projected gains in ${category} optimization.`;
  if (score >= 65) return `Moderate projected gains in ${category} with testing validation.`;
  return `Incremental gains expected in ${category}; prioritize validation session.`;
}

function scoreCategory(input: FitSessionInput, options: typeof balls): ScoredRecommendation[] {
  const hasLaunchData = Object.values(input.launchData).some((v) => v !== undefined && v !== null && v !== "");

  return options
    .map((option) => {
      const evaluation = evaluateOption(input, option);
      const score = weightedScore(evaluation);
      return {
        id: option.id,
        category: option.category,
        name: option.name,
        score,
        reasons: evaluation.reasons,
        expectedImprovement: expectedGain(option.category, score),
        confidence: scoreToConfidence(score, hasLaunchData),
        components: {
          distance: evaluation.distance,
          dispersion: evaluation.dispersion,
          launchSpin: evaluation.launchSpin,
          preference: evaluation.preference,
          forgiveness: evaluation.forgiveness,
        },
      } satisfies ScoredRecommendation;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function runFittingEngine(input: FitSessionInput): FitRecommendationResult {
  const ball = scoreCategory(input, balls);
  const driver = scoreCategory(input, drivers);
  const iron = scoreCategory(input, irons);
  const shaft = scoreCategory(input, shafts);

  const hasLaunchData = Object.values(input.launchData).some((v) => v !== undefined && v !== null && v !== "");
  const overall = Math.round(
    [ball[0]?.score ?? 0, driver[0]?.score ?? 0, iron[0]?.score ?? 0, shaft[0]?.score ?? 0].reduce((a, b) => a + b, 0) / 4,
  );

  return {
    ball,
    driver,
    irons: iron,
    shafts: shaft,
    confidence: scoreToConfidence(overall, hasLaunchData),
    buildSpecs: buildSpecs(input),
  };
}
