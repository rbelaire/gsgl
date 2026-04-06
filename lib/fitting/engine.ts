import { balls, drivers, irons, shafts } from "../data/seed";
import type { EquipmentOption } from "../data/seed";
import { evaluateOption } from "./rules";
import { scoreToConfidence, weightedScore } from "./scoring";
import { FitRecommendationResult, FitSessionInput, ScoredRecommendation } from "./types";

export interface EquipmentCatalog {
  balls: EquipmentOption[];
  drivers: EquipmentOption[];
  irons: EquipmentOption[];
  shafts: EquipmentOption[];
}

const SEED_CATALOG: EquipmentCatalog = { balls, drivers, irons, shafts };

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

function scoreCategory(
  input: FitSessionInput,
  options: EquipmentOption[],
): ScoredRecommendation[] {
  const hasLaunchData = Object.values(input.launchData).some(
    (v) => v !== undefined && v !== null && v !== "",
  );

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

/**
 * Run the fitting engine against a player input.
 *
 * Pass a `catalog` to use equipment fetched from Firestore (or any other
 * source). Omit it to fall back to the local seed data — useful in tests
 * and when Firebase is not configured.
 */
export function runFittingEngine(
  input: FitSessionInput,
  catalog: EquipmentCatalog = SEED_CATALOG,
): FitRecommendationResult {
  const ball = scoreCategory(input, catalog.balls);
  const driver = scoreCategory(input, catalog.drivers);
  const iron = scoreCategory(input, catalog.irons);
  const shaft = scoreCategory(input, catalog.shafts);

  const hasLaunchData = Object.values(input.launchData).some(
    (v) => v !== undefined && v !== null && v !== "",
  );
  const overall = Math.round(
    [ball[0]?.score ?? 0, driver[0]?.score ?? 0, iron[0]?.score ?? 0, shaft[0]?.score ?? 0].reduce(
      (a, b) => a + b,
      0,
    ) / 4,
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
