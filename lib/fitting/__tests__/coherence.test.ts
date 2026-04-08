import { describe, expect, it } from "vitest";
import { validateBuildCoherence } from "../coherence";
import type { ScoredRecommendation } from "../types";

function makeRec(
  overrides: Partial<ScoredRecommendation> & { id: string },
): ScoredRecommendation {
  const { id, ...rest } = overrides;
  return {
    id,
    name: id,
    category: "driver",
    score: 75,
    reasons: [],
    expectedImprovement: "",
    confidence: "High",
    components: {
      distance: 50,
      dispersion: 50,
      launchSpin: 50,
      feel: 50,
      forgiveness: 50,
    },
    ...rest,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// (e) Build coherence validator
// ═══════════════════════════════════════════════════════════════════════════

describe("validateBuildCoherence — no conflict", () => {
  it("returns #1 picks untouched when build is coherent", () => {
    const candidates = {
      driver: [makeRec({ id: "d1", category: "driver", components: { distance: 50, dispersion: 50, launchSpin: 65, feel: 50, forgiveness: 50 } })],
      shaft: [makeRec({ id: "s1", category: "shaft", components: { distance: 50, dispersion: 50, launchSpin: 50, feel: 50, forgiveness: 50 } })],
      ball: [makeRec({ id: "b1", category: "ball", components: { distance: 50, dispersion: 50, launchSpin: 60, feel: 50, forgiveness: 50 } })],
      iron: [makeRec({ id: "i1", category: "irons" })],
    };
    const result = validateBuildCoherence(candidates);
    expect(result.driver.id).toBe("d1");
    expect(result.ball.id).toBe("b1");
    expect(result.shaft.id).toBe("s1");
    expect(result.iron.id).toBe("i1");
  });
});

describe("validateBuildCoherence — all-low-spin stack (C-1)", () => {
  it("swaps ball when driver + ball both have low launchSpin scores", () => {
    const lowSpinDriver = makeRec({
      id: "d-lowspin",
      category: "driver",
      components: { distance: 50, dispersion: 50, launchSpin: 40, feel: 50, forgiveness: 50 },
    });
    const lowSpinBall = makeRec({
      id: "b-lowspin",
      category: "ball",
      components: { distance: 50, dispersion: 50, launchSpin: 40, feel: 50, forgiveness: 50 },
    });
    const altBall = makeRec({
      id: "b-mid",
      category: "ball",
      components: { distance: 50, dispersion: 50, launchSpin: 55, feel: 50, forgiveness: 50 },
    });

    const candidates = {
      driver: [lowSpinDriver],
      shaft: [makeRec({ id: "s1", category: "shaft" })],
      ball: [lowSpinBall, altBall],
      iron: [makeRec({ id: "i1", category: "irons" })],
    };

    const result = validateBuildCoherence(candidates);
    expect(result.ball.id).toBe("b-mid");
    expect(result.ball.swappedForCoherence).toBe(true);
    expect(result.ball.reasons.some((r) => r.toLowerCase().includes("low-spin stack"))).toBe(true);
  });

  it("does NOT swap if there is no #2 ball candidate", () => {
    const lowSpinDriver = makeRec({
      id: "d-lowspin",
      category: "driver",
      components: { distance: 50, dispersion: 50, launchSpin: 40, feel: 50, forgiveness: 50 },
    });
    const lowSpinBall = makeRec({
      id: "b-lowspin",
      category: "ball",
      components: { distance: 50, dispersion: 50, launchSpin: 40, feel: 50, forgiveness: 50 },
    });

    const candidates = {
      driver: [lowSpinDriver],
      shaft: [makeRec({ id: "s1", category: "shaft" })],
      ball: [lowSpinBall], // only one ball in catalog
      iron: [makeRec({ id: "i1", category: "irons" })],
    };

    const result = validateBuildCoherence(candidates);
    // Can't swap — original pick stays
    expect(result.ball.id).toBe("b-lowspin");
  });
});

describe("validateBuildCoherence — draw-bias mismatch penalty (C-4)", () => {
  it("swaps driver when it has a left-miss mismatch reason", () => {
    const drawDriver = makeRec({
      id: "d-draw",
      category: "driver",
      reasons: ["draw-bias driver would worsen the miss."],
    });
    const neutralDriver = makeRec({ id: "d-neutral", category: "driver" });

    const candidates = {
      driver: [drawDriver, neutralDriver],
      shaft: [makeRec({ id: "s1", category: "shaft" })],
      ball: [makeRec({ id: "b1", category: "ball" })],
      iron: [makeRec({ id: "i1", category: "irons" })],
    };

    const result = validateBuildCoherence(candidates);
    expect(result.driver.id).toBe("d-neutral");
    expect(result.driver.swappedForCoherence).toBe(true);
  });
});

describe("validateBuildCoherence — at most one swap per category", () => {
  it("a category is only swapped once even if two conflicts target it", () => {
    // Construct a ball that triggers both C-1 (low launchSpin) and C-3-style
    // reason.  After the first swap the category is locked.
    const lowSpinDriver = makeRec({
      id: "d-lowspin",
      category: "driver",
      components: { distance: 50, dispersion: 50, launchSpin: 40, feel: 50, forgiveness: 50 },
    });
    const problematicShaft = makeRec({
      id: "s-problem",
      category: "shaft",
      // high launchSpin + will hit C-2 if driver also has high launchSpin,
      // but driver here is low — no C-2 conflict.
      reasons: ["heavy shaft will reduce control"],
      components: { distance: 50, dispersion: 50, launchSpin: 40, feel: 50, forgiveness: 50 },
    });
    const altShaft = makeRec({ id: "s-alt", category: "shaft" });

    const candidates = {
      driver: [lowSpinDriver],
      shaft: [problematicShaft, altShaft],
      ball: [
        makeRec({ id: "b-ok", category: "ball", components: { distance: 50, dispersion: 50, launchSpin: 60, feel: 50, forgiveness: 50 } }),
      ],
      iron: [makeRec({ id: "i1", category: "irons" })],
    };

    const result = validateBuildCoherence(candidates);
    // shaft should swap once (C-3 fires for heavy shaft control reason)
    expect(result.shaft.id).toBe("s-alt");
    expect(result.shaft.swappedForCoherence).toBe(true);
  });
});
