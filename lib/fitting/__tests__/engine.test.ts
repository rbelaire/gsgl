import { describe, expect, it } from "vitest";
import { runFittingEngine } from "../engine";
import type { FitSessionInput } from "../types";

function makeInput(overrides: Partial<FitSessionInput> = {}): FitSessionInput {
  return {
    profile: {
      handicap: 12,
      heightIn: 70,
      wristToFloorIn: 33,
      ageRange: "30to50",
      tempo: "medium",
      missTendency: "both",
      trajectory: "mid",
    },
    equipment: {
      driverModel: "TSR3",
      driverLoft: "10.5",
      driverShaft: "Aldila Ascent 60S",
      ironModel: "JPX 923",
      ironShaft: "DG 105 S300",
      ballModel: "Pro V1",
    },
    launchData: { clubSpeed: 95, ballSpeed: 140, spinRate: 2800, launchAngle: 12, carryDistance: 260 },
    goals: {
      moreDistance: false,
      lessSpin: false,
      higherLaunch: false,
      tighterDispersion: true,
      softerFeel: false,
    },
    ...overrides,
  };
}

describe("runFittingEngine", () => {
  it("returns recommendations for all four categories", () => {
    const result = runFittingEngine(makeInput());
    expect(result.ball.length).toBeGreaterThan(0);
    expect(result.driver.length).toBeGreaterThan(0);
    expect(result.irons.length).toBeGreaterThan(0);
    expect(result.shafts.length).toBeGreaterThan(0);
  });

  it("returns at most 3 recommendations per category, sorted by score descending", () => {
    const result = runFittingEngine(makeInput());
    for (const category of [result.ball, result.driver, result.irons, result.shafts]) {
      expect(category.length).toBeLessThanOrEqual(3);
      for (let i = 1; i < category.length; i++) {
        expect(category[i - 1].score).toBeGreaterThanOrEqual(category[i].score);
      }
    }
  });

  it("includes build specs in the result", () => {
    const result = runFittingEngine(makeInput());
    expect(result.buildSpecs).toHaveProperty("lengthAdjustment");
    expect(result.buildSpecs).toHaveProperty("lieAdjustment");
    expect(result.buildSpecs).toHaveProperty("gripSize");
  });

  it("returns Standard specs for average height and wrist measurement", () => {
    const result = runFittingEngine(makeInput());
    expect(result.buildSpecs.lengthAdjustment).toBe("Standard");
    expect(result.buildSpecs.lieAdjustment).toBe("Standard");
  });

  it("returns upright/longer specs for tall player", () => {
    const result = runFittingEngine(
      makeInput({ profile: { ...makeInput().profile, heightIn: 76, wristToFloorIn: 38 } }),
    );
    expect(result.buildSpecs.lengthAdjustment).toBe("+0.5 in");
    expect(result.buildSpecs.lieAdjustment).toBe("+1° upright");
  });

  it("returns flat/shorter specs for shorter player", () => {
    const result = runFittingEngine(
      makeInput({ profile: { ...makeInput().profile, heightIn: 64, wristToFloorIn: 30 } }),
    );
    expect(result.buildSpecs.lengthAdjustment).toBe("-0.5 in");
    expect(result.buildSpecs.lieAdjustment).toBe("-1° flat");
  });

  it("returns Low confidence when no launch data is provided", () => {
    const result = runFittingEngine(makeInput({ launchData: {} }));
    expect(result.confidence).toBe("Low");
  });

  it("each recommendation includes score, reasons, and confidence", () => {
    const result = runFittingEngine(makeInput());
    for (const rec of [...result.ball, ...result.driver, ...result.irons, ...result.shafts]) {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(100);
      expect(rec.reasons.length).toBeGreaterThan(0);
      expect(["High", "Medium", "Low"]).toContain(rec.confidence);
    }
  });
});
