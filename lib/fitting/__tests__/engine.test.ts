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

describe("runFittingEngine — basic output shape", () => {
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

  it("each recommendation includes score, reasons, and confidence", () => {
    const result = runFittingEngine(makeInput());
    for (const rec of [...result.ball, ...result.driver, ...result.irons, ...result.shafts]) {
      expect(rec.score).toBeGreaterThanOrEqual(0);
      expect(rec.score).toBeLessThanOrEqual(100);
      expect(rec.reasons.length).toBeGreaterThan(0);
      expect(["High", "Medium", "Low"]).toContain(rec.confidence);
    }
  });

  it("components include feel (not legacy preference)", () => {
    const result = runFittingEngine(makeInput());
    const rec = result.ball[0];
    expect(rec.components).toHaveProperty("feel");
    expect(rec.components).not.toHaveProperty("preference");
  });
});

// ── Confidence split ──────────────────────────────────────────────────────────

describe("runFittingEngine — dual confidence signals", () => {
  it("returns both dataConfidence and matchStrength fields", () => {
    const result = runFittingEngine(makeInput());
    expect(result).toHaveProperty("dataConfidence");
    expect(result).toHaveProperty("matchStrength");
  });

  it("dataConfidence is profile_only when no launch data provided", () => {
    const result = runFittingEngine(makeInput({ launchData: {} }));
    expect(result.dataConfidence).toBe("profile_only");
  });

  it("dataConfidence is profile_and_launch when launch data provided", () => {
    const result = runFittingEngine(makeInput());
    expect(result.dataConfidence).toBe("profile_and_launch");
  });

  it("matchStrength is independent of dataConfidence", () => {
    const withLaunch = runFittingEngine(makeInput());
    const withoutLaunch = runFittingEngine(makeInput({ launchData: {} }));
    // Both should have a valid matchStrength regardless of data completeness
    expect(["strong", "moderate", "weak"]).toContain(withLaunch.matchStrength);
    expect(["strong", "moderate", "weak"]).toContain(withoutLaunch.matchStrength);
  });

  it("confidenceSummary is a non-empty string", () => {
    const result = runFittingEngine(makeInput());
    expect(typeof result.confidenceSummary).toBe("string");
    expect(result.confidenceSummary.length).toBeGreaterThan(10);
  });

  it("confidenceSummary mentions 'launch monitor' when data is profile_only", () => {
    const result = runFittingEngine(makeInput({ launchData: {} }));
    expect(result.confidenceSummary).toContain("launch monitor");
  });

  it("legacy confidence field still present for backward compatibility", () => {
    const result = runFittingEngine(makeInput());
    expect(["High", "Medium", "Low"]).toContain(result.confidence);
  });
});

// ── Normalized scores ─────────────────────────────────────────────────────────

describe("runFittingEngine — min-max normalization", () => {
  it("top item reaches 100 when items differ, or all are 50 when items tie", () => {
    // Use an input that fires several rules to create differentiation.
    const richInput = makeInput({
      profile: { ...makeInput().profile, missTendency: "right", handicap: 20, trajectory: "low" },
      launchData: { spinRate: 3200, launchAngle: 8, clubSpeed: 110, consistencyIndex: 35 },
      goals: { moreDistance: true, lessSpin: true, higherLaunch: true, tighterDispersion: true, softerFeel: false },
    });
    const result = runFittingEngine(richInput);
    for (const category of [result.ball, result.driver, result.irons, result.shafts]) {
      const scores = category.map((r) => r.score);
      const allEqual = scores.every((s) => s === scores[0]);
      if (allEqual) {
        // All tied — min-max correctly returns neutral 50
        expect(scores[0]).toBe(50);
      } else {
        // Differentiated — top should be normalized to 100
        expect(Math.max(...scores)).toBe(100);
      }
    }
  });
});
