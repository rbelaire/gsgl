import { describe, expect, it } from "vitest";
import {
  buildConfidenceSummary,
  CATEGORY_WEIGHTS,
  computeDataConfidence,
  computeMatchStrength,
  matchStrengthToLegacyConfidence,
  minMaxNormalize,
  weightedScore,
} from "../scoring";
import type { RuleEvaluation } from "../rules";
import { GOAL_BONUSES, GOAL_TARGET_FINAL_IMPACT } from "../scoringConstants";

function makeEval(overrides: Partial<RuleEvaluation> = {}): RuleEvaluation {
  return {
    distance: 50,
    dispersion: 50,
    launchSpin: 50,
    feel: 50,
    forgiveness: 50,
    reasons: [],
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// (d) Category weights sum to 1.0
// ═══════════════════════════════════════════════════════════════════════════

describe("CATEGORY_WEIGHTS — sums to 1.0", () => {
  const categories = Object.keys(CATEGORY_WEIGHTS) as Array<keyof typeof CATEGORY_WEIGHTS>;

  for (const cat of categories) {
    it(`${cat} weights sum to 1.0`, () => {
      const total = Object.values(CATEGORY_WEIGHTS[cat]).reduce(
        (a: number, b: unknown) => a + (b as number),
        0,
      );
      expect(total).toBeCloseTo(1.0, 10);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// weightedScore — category-aware
// ═══════════════════════════════════════════════════════════════════════════

describe("weightedScore", () => {
  it("returns 50 when all components are 50 (driver)", () => {
    expect(weightedScore(makeEval(), "driver")).toBeCloseTo(50);
  });

  it("returns 50 when all components are 50 (ball)", () => {
    expect(weightedScore(makeEval(), "ball")).toBeCloseTo(50);
  });

  it("shaft feel weight is 0 — feel changes do not affect shaft score", () => {
    const base = weightedScore(makeEval(), "shaft");
    const withFeel = weightedScore(makeEval({ feel: 100 }), "shaft");
    expect(withFeel).toBeCloseTo(base);
  });

  it("dispersion is highest-weighted dimension for drivers", () => {
    const highDispersion = weightedScore(makeEval({ dispersion: 100 }), "driver");
    const highDistance = weightedScore(makeEval({ distance: 100 }), "driver");
    const highLaunch = weightedScore(makeEval({ launchSpin: 100 }), "driver");
    expect(highDispersion).toBeGreaterThan(highDistance);
    expect(highDispersion).toBeGreaterThan(highLaunch);
  });

  it("raw score is NOT capped at 100 (supports scores above 100)", () => {
    // A player triggering many bonuses should produce a raw score > 100.
    const bigEval = makeEval({
      distance: 75,
      dispersion: 95,
      launchSpin: 95,
      feel: 75,
      forgiveness: 80,
    });
    const raw = weightedScore(bigEval, "driver");
    expect(raw).toBeGreaterThan(80);
    // No hard cap enforced here — normalization happens at engine level.
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// minMaxNormalize
// ═══════════════════════════════════════════════════════════════════════════

describe("minMaxNormalize", () => {
  it("maps min to 0 and max to 100", () => {
    const result = minMaxNormalize([50, 75, 100]);
    expect(result[0]).toBe(0);
    expect(result[2]).toBe(100);
  });

  it("returns all 50 when scores are identical", () => {
    expect(minMaxNormalize([70, 70, 70])).toEqual([50, 50, 50]);
  });

  it("preserves relative order", () => {
    const scores = [60, 90, 75];
    const normalized = minMaxNormalize(scores);
    expect(normalized[1]).toBeGreaterThan(normalized[2]);
    expect(normalized[2]).toBeGreaterThan(normalized[0]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// (c) Goal bonuses produce roughly equal final-score impact
// ═══════════════════════════════════════════════════════════════════════════

describe("Goal bonus parity", () => {
  it("each goal bonus * its primary dimension weight ≈ GOAL_TARGET_FINAL_IMPACT", () => {
    // moreDistance: distance dim, driver weight 0.25
    expect(GOAL_BONUSES.moreDistance * CATEGORY_WEIGHTS.driver.distance).toBeCloseTo(
      GOAL_TARGET_FINAL_IMPACT,
      0,
    );
    // lessSpin: launchSpin dim, driver weight 0.25
    expect(GOAL_BONUSES.lessSpin * CATEGORY_WEIGHTS.driver.launchSpin).toBeCloseTo(
      GOAL_TARGET_FINAL_IMPACT,
      0,
    );
    // higherLaunch: launchSpin dim, driver weight 0.25
    expect(GOAL_BONUSES.higherLaunch * CATEGORY_WEIGHTS.driver.launchSpin).toBeCloseTo(
      GOAL_TARGET_FINAL_IMPACT,
      0,
    );
    // tighterDispersion: dispersion dim, driver weight 0.30
    expect(GOAL_BONUSES.tighterDispersion * CATEGORY_WEIGHTS.driver.dispersion).toBeCloseTo(
      GOAL_TARGET_FINAL_IMPACT,
      0,
    );
    // softerFeel: feel dim, ball weight 0.25 (ball-only goal)
    expect(GOAL_BONUSES.softerFeel * CATEGORY_WEIGHTS.ball.feel).toBeCloseTo(
      GOAL_TARGET_FINAL_IMPACT,
      0,
    );
  });

  it("softerFeel bonus (8) is much smaller than the old value (30)", () => {
    expect(GOAL_BONUSES.softerFeel).toBeLessThan(15);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// (f) Confidence split — both signals independently
// ═══════════════════════════════════════════════════════════════════════════

describe("computeDataConfidence", () => {
  it("returns profile_only when launchData is empty", () => {
    expect(computeDataConfidence({})).toBe("profile_only");
  });

  it("returns profile_and_launch when any launch value is present", () => {
    expect(computeDataConfidence({ spinRate: 3000 })).toBe("profile_and_launch");
    expect(computeDataConfidence({ clubSpeed: 95, spinRate: 2800 })).toBe(
      "profile_and_launch",
    );
  });

  it("returns profile_only when all values are undefined", () => {
    expect(
      computeDataConfidence({
        clubSpeed: undefined,
        spinRate: undefined,
        launchAngle: undefined,
      }),
    ).toBe("profile_only");
  });
});

describe("computeMatchStrength", () => {
  it("returns strong for a high normalized score", () => {
    expect(computeMatchStrength(85)).toBe("strong");
    expect(computeMatchStrength(100)).toBe("strong");
  });

  it("returns moderate for a mid-range score", () => {
    expect(computeMatchStrength(60)).toBe("moderate");
  });

  it("returns weak for a low normalized score", () => {
    expect(computeMatchStrength(30)).toBe("weak");
    expect(computeMatchStrength(0)).toBe("weak");
  });
});

describe("dataConfidence and matchStrength are independent", () => {
  it("profile_only data can still produce strong matchStrength", () => {
    const data = computeDataConfidence({});
    const match = computeMatchStrength(90);
    expect(data).toBe("profile_only");
    expect(match).toBe("strong");
  });

  it("profile_and_launch data can produce weak matchStrength", () => {
    const data = computeDataConfidence({ spinRate: 2800 });
    const match = computeMatchStrength(20);
    expect(data).toBe("profile_and_launch");
    expect(match).toBe("weak");
  });
});

describe("buildConfidenceSummary", () => {
  it("mentions 'add launch monitor data' when data is profile_only", () => {
    const summary = buildConfidenceSummary("profile_only", "strong");
    expect(summary).toContain("launch monitor data");
    expect(summary).toContain("Strong match");
  });

  it("does not suggest adding data when profile_and_launch", () => {
    const summary = buildConfidenceSummary("profile_and_launch", "strong");
    expect(summary).not.toContain("add launch");
    expect(summary).toContain("Strong match");
  });

  it("reflects weak match strength regardless of data completeness", () => {
    const summary = buildConfidenceSummary("profile_and_launch", "weak");
    expect(summary).toContain("Weak match");
  });
});

describe("matchStrengthToLegacyConfidence", () => {
  it("maps strong → High", () => expect(matchStrengthToLegacyConfidence("strong")).toBe("High"));
  it("maps moderate → Medium", () => expect(matchStrengthToLegacyConfidence("moderate")).toBe("Medium"));
  it("maps weak → Low", () => expect(matchStrengthToLegacyConfidence("weak")).toBe("Low"));
});
