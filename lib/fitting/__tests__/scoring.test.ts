import { describe, expect, it } from "vitest";
import { FIT_WEIGHTS, scoreToConfidence, weightedScore } from "../scoring";
import type { RuleEvaluation } from "../rules";

function makeEval(overrides: Partial<RuleEvaluation> = {}): RuleEvaluation {
  return {
    distance: 50,
    dispersion: 50,
    launchSpin: 50,
    preference: 50,
    forgiveness: 50,
    reasons: [],
    ...overrides,
  };
}

describe("weightedScore", () => {
  it("returns 50 when all components are 50", () => {
    expect(weightedScore(makeEval())).toBe(50);
  });

  it("weights sum to 1.0", () => {
    const total = Object.values(FIT_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBeCloseTo(1.0);
  });

  it("maxes at 100 when all components are 100", () => {
    expect(weightedScore(makeEval({ distance: 100, dispersion: 100, launchSpin: 100, preference: 100, forgiveness: 100 }))).toBe(100);
  });

  it("reflects dominant dispersion weight", () => {
    // dispersion weight (0.30) > distance weight (0.25), so
    // raising dispersion alone should yield a higher score than raising distance alone
    const highDispersion = weightedScore(makeEval({ dispersion: 100 }));
    const highDistance = weightedScore(makeEval({ distance: 100 }));
    expect(highDispersion).toBeGreaterThan(highDistance);
  });
});

describe("scoreToConfidence", () => {
  it("returns Low when no launch data regardless of score", () => {
    expect(scoreToConfidence(95, false)).toBe("Low");
    expect(scoreToConfidence(50, false)).toBe("Low");
  });

  it("returns High when score >= 80 and has launch data", () => {
    expect(scoreToConfidence(80, true)).toBe("High");
    expect(scoreToConfidence(99, true)).toBe("High");
  });

  it("returns Medium when 65 <= score < 80 and has launch data", () => {
    expect(scoreToConfidence(65, true)).toBe("Medium");
    expect(scoreToConfidence(79, true)).toBe("Medium");
  });

  it("returns Low when score < 65 and has launch data", () => {
    expect(scoreToConfidence(64, true)).toBe("Low");
    expect(scoreToConfidence(0, true)).toBe("Low");
  });
});
