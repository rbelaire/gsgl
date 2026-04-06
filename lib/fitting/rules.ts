import { EquipmentOption } from "../data/seed";
import { FitSessionInput } from "./types";

export interface RuleEvaluation {
  distance: number;
  dispersion: number;
  launchSpin: number;
  preference: number;
  forgiveness: number;
  reasons: string[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export function evaluateOption(input: FitSessionInput, option: EquipmentOption): RuleEvaluation {
  const evalResult: RuleEvaluation = {
    distance: 50,
    dispersion: 50,
    launchSpin: 50,
    preference: 50,
    forgiveness: 50,
    reasons: [],
  };

  const { launchData, goals, profile } = input;

  if (option.category === "driver") {
    if ((launchData.spinRate ?? 0) > 3000 && option.spinProfile === "low") {
      evalResult.launchSpin += 25;
      evalResult.distance += 10;
      evalResult.reasons.push("Spin above 3000 rpm aligned with low-spin driver head.");
    }
    if ((launchData.launchAngle ?? 0) < 10 && option.launchProfile !== "low") {
      evalResult.launchSpin += 20;
      evalResult.reasons.push("Launch below 10° benefits from added loft/launch support.");
    }
    if (profile.missTendency === "right" && option.bias === "draw") {
      evalResult.dispersion += 25;
      evalResult.forgiveness += 10;
      evalResult.reasons.push("Right miss tendency matched with draw-biased head.");
    }
    if ((launchData.consistencyIndex ?? 50) < 45 && option.forgivenessLevel === "high") {
      evalResult.dispersion += 20;
      evalResult.forgiveness += 25;
      evalResult.reasons.push("Inconsistent strike pattern matched with high-MOI forgiveness.");
    }
  }

  if (option.category === "ball") {
    if ((launchData.spinRate ?? 0) > 3200 && (launchData.launchAngle ?? 0) > 14 && option.spinProfile === "low") {
      evalResult.launchSpin += 25;
      evalResult.distance += 10;
      evalResult.reasons.push("High spin and high launch favor lower-spin ball flight.");
    }
    if (goals.softerFeel && option.feel === "soft") {
      evalResult.preference += 30;
      evalResult.reasons.push("Softer feel goal matched with soft urethane profile.");
    }
  }

  if (option.category === "shaft") {
    if ((launchData.clubSpeed ?? 0) > 103 && profile.tempo === "aggressive" && option.weightClass === "heavy") {
      evalResult.dispersion += 20;
      evalResult.distance += 10;
      evalResult.reasons.push("High speed and aggressive tempo favor heavier stable shaft.");
    }
    if ((launchData.launchAngle ?? 0) < 10 && option.launchProfile === "high") {
      evalResult.launchSpin += 20;
      evalResult.reasons.push("Low launch improved by higher-launch shaft profile.");
    }
  }

  if (option.category === "irons") {
    if (profile.handicap > 15 && option.forgivenessLevel === "high") {
      evalResult.forgiveness += 25;
      evalResult.dispersion += 10;
      evalResult.reasons.push("Handicap profile supports a more forgiving iron design.");
    }
    if (profile.trajectory === "low" && option.launchProfile === "high") {
      evalResult.launchSpin += 18;
      evalResult.reasons.push("Low trajectory tendency benefits from higher-launch iron setup.");
    }
  }

  if (goals.moreDistance) evalResult.distance += 8;
  if (goals.lessSpin) evalResult.launchSpin += 8;
  if (goals.higherLaunch) evalResult.launchSpin += 8;
  if (goals.tighterDispersion) evalResult.dispersion += 10;

  evalResult.distance = clamp(evalResult.distance);
  evalResult.dispersion = clamp(evalResult.dispersion);
  evalResult.launchSpin = clamp(evalResult.launchSpin);
  evalResult.preference = clamp(evalResult.preference);
  evalResult.forgiveness = clamp(evalResult.forgiveness);

  if (evalResult.reasons.length === 0) {
    evalResult.reasons.push("Balanced fit against current player profile and goals.");
  }

  return evalResult;
}
