import { describe, expect, it } from "vitest";
import { evaluateOption, RULES, GOAL_RULES } from "../rules";
import type { EquipmentOption } from "../../data/seed";
import type { FitSessionInput } from "../types";

function makeInput(overrides: Partial<FitSessionInput> = {}): FitSessionInput {
  return {
    profile: {
      handicap: 15,
      heightIn: 70,
      wristToFloorIn: 33,
      ageRange: "30to50",
      tempo: "medium",
      missTendency: "both",
      trajectory: "mid",
    },
    equipment: {
      driverModel: "",
      driverLoft: "",
      driverShaft: "",
      ironModel: "",
      ironShaft: "",
      ballModel: "",
    },
    launchData: {},
    goals: {
      moreDistance: false,
      lessSpin: false,
      higherLaunch: false,
      tighterDispersion: false,
      softerFeel: false,
    },
    ...overrides,
  };
}

function makeOption(overrides: Partial<EquipmentOption>): EquipmentOption {
  return {
    id: "test",
    name: "Test Option",
    category: "driver",
    traits: [],
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// (a) No rule fires in two dimensions
// ═══════════════════════════════════════════════════════════════════════════

describe("Rule structure — no double-counting", () => {
  it("each rule id is unique", () => {
    const ids = RULES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each rule id appears in exactly one dimension (RULES list)", () => {
    const dimensionByRule: Record<string, string> = {};
    for (const rule of RULES) {
      expect(dimensionByRule[rule.id]).toBeUndefined(); // fail if duplicate
      dimensionByRule[rule.id] = rule.dimension;
    }
  });

  it("no rule id appears in both RULES and GOAL_RULES", () => {
    const ruleIds = new Set(RULES.map((r) => r.id));
    const goalIds = GOAL_RULES.map((g) => g.id);
    for (const id of goalIds) {
      expect(ruleIds.has(id)).toBe(false);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// (b) Penalties fire correctly for mismatch cases
// ═══════════════════════════════════════════════════════════════════════════

describe("Penalties — driver", () => {
  it("DR-3p: draw-bias driver penalises a left-misser in dispersion", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, missTendency: "left" },
    });
    const option = makeOption({ category: "driver", bias: "draw" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeLessThan(50);
  });

  it("DR-3p: draw-bias driver does NOT penalise a right-misser", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, missTendency: "right" },
    });
    const option = makeOption({ category: "driver", bias: "draw" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeGreaterThan(50);
  });

  it("DR-1p: low-spin driver penalises already-low spin in launchSpin", () => {
    const input = makeInput({ launchData: { spinRate: 2000 } });
    const option = makeOption({ category: "driver", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeLessThan(50);
  });

  it("DR-4p: high-MOI driver penalises a consistent striker in forgiveness", () => {
    const input = makeInput({ launchData: { consistencyIndex: 80 } });
    const option = makeOption({ category: "driver", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.forgiveness).toBeLessThan(50);
  });

  it("DR-2p: high-launch driver penalises a player already launching high", () => {
    const input = makeInput({ launchData: { launchAngle: 17 } });
    const option = makeOption({ category: "driver", launchProfile: "high" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeLessThan(50);
  });
});

describe("Penalties — shaft", () => {
  it("SH-1p: heavy shaft penalises smooth tempo player in dispersion", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, tempo: "smooth" },
    });
    const option = makeOption({ category: "shaft", weightClass: "heavy" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeLessThan(50);
  });

  it("SH-1p: heavy shaft penalises slow club speed player in dispersion", () => {
    const input = makeInput({ launchData: { clubSpeed: 75 } });
    const option = makeOption({ category: "shaft", weightClass: "heavy" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeLessThan(50);
  });
});

describe("Penalties — irons", () => {
  it("IR-1p: high-forgiveness irons penalise scratch-level handicap in forgiveness", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, handicap: 2 },
    });
    const option = makeOption({ category: "irons", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.forgiveness).toBeLessThan(50);
  });

  it("IR-2p: high-launch irons penalise a high-ball hitter in launchSpin", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, trajectory: "high" },
    });
    const option = makeOption({ category: "irons", launchProfile: "high" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeLessThan(50);
  });
});

describe("Penalties — ball", () => {
  it("BA-1p: low-spin ball penalises already-low spin in launchSpin", () => {
    const input = makeInput({ launchData: { spinRate: 2000 } });
    const option = makeOption({ category: "ball", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeLessThan(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Bonuses still fire correctly
// ═══════════════════════════════════════════════════════════════════════════

describe("Bonuses — driver", () => {
  it("DR-1: boosts launchSpin for high spin + low-spin driver", () => {
    const input = makeInput({ launchData: { spinRate: 3100 } });
    const option = makeOption({ category: "driver", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeGreaterThan(50);
  });

  it("DR-1: does NOT boost distance (removed double-count)", () => {
    const input = makeInput({ launchData: { spinRate: 3100 } });
    const option = makeOption({ category: "driver", spinProfile: "low" });
    const result = evaluateOption(input, option);
    // distance should stay at base (50) when no distance-specific rule fires
    expect(result.distance).toBe(50);
  });

  it("DR-3: boosts dispersion for right miss + draw bias", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, missTendency: "right" },
    });
    const option = makeOption({ category: "driver", bias: "draw" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeGreaterThan(50);
  });

  it("DR-3: does NOT boost forgiveness (removed double-count)", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, missTendency: "right" },
    });
    const option = makeOption({ category: "driver", bias: "draw" });
    const result = evaluateOption(input, option);
    expect(result.forgiveness).toBe(50);
  });

  it("DR-4: boosts forgiveness for inconsistent striker + high-MOI driver", () => {
    const input = makeInput({ launchData: { consistencyIndex: 40 } });
    const option = makeOption({ category: "driver", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.forgiveness).toBeGreaterThan(50);
  });

  it("DR-4: does NOT boost dispersion (removed double-count)", () => {
    const input = makeInput({ launchData: { consistencyIndex: 40 } });
    const option = makeOption({ category: "driver", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBe(50);
  });
});

describe("Bonuses — irons", () => {
  it("IR-1: boosts forgiveness for high handicap + forgiving iron", () => {
    const input = makeInput({ profile: { ...makeInput().profile, handicap: 20 } });
    const option = makeOption({ category: "irons", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.forgiveness).toBeGreaterThan(50);
  });

  it("IR-1: does NOT boost dispersion (removed double-count)", () => {
    const input = makeInput({ profile: { ...makeInput().profile, handicap: 20 } });
    const option = makeOption({ category: "irons", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBe(50);
  });

  it("IR-2: boosts launchSpin for low trajectory + high-launch iron", () => {
    const input = makeInput({ profile: { ...makeInput().profile, trajectory: "low" } });
    const option = makeOption({ category: "irons", launchProfile: "high" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeGreaterThan(50);
  });
});

describe("Bonuses — ball", () => {
  it("BA-2: boosts feel for softerFeel goal + soft ball", () => {
    const input = makeInput({ goals: { ...makeInput().goals, softerFeel: true } });
    const option = makeOption({ category: "ball", feel: "soft" });
    const result = evaluateOption(input, option);
    expect(result.feel).toBeGreaterThan(50);
  });

  it("BA-1: boosts launchSpin for high spin + high launch + low-spin ball", () => {
    const input = makeInput({ launchData: { spinRate: 3300, launchAngle: 16 } });
    const option = makeOption({ category: "ball", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeGreaterThan(50);
  });

  it("BA-1: does NOT boost distance (removed double-count)", () => {
    const input = makeInput({ launchData: { spinRate: 3300, launchAngle: 16 } });
    const option = makeOption({ category: "ball", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.distance).toBe(50);
  });
});

describe("Bonuses — shaft", () => {
  it("SH-1: boosts dispersion for high speed + aggressive + heavy shaft", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, tempo: "aggressive" },
      launchData: { clubSpeed: 105 },
    });
    const option = makeOption({ category: "shaft", weightClass: "heavy" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeGreaterThan(50);
  });

  it("SH-1: does NOT boost distance (removed double-count)", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, tempo: "aggressive" },
      launchData: { clubSpeed: 105 },
    });
    const option = makeOption({ category: "shaft", weightClass: "heavy" });
    const result = evaluateOption(input, option);
    expect(result.distance).toBe(50);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Goal bonuses
// ═══════════════════════════════════════════════════════════════════════════

describe("Goal bonuses", () => {
  it("adds distance bonus when moreDistance goal is set", () => {
    const baseline = evaluateOption(makeInput(), makeOption({ category: "driver" }));
    const withGoal = evaluateOption(
      makeInput({ goals: { ...makeInput().goals, moreDistance: true } }),
      makeOption({ category: "driver" }),
    );
    expect(withGoal.distance).toBe(baseline.distance + 8);
  });

  it("adds launchSpin bonus when lessSpin goal is set", () => {
    const baseline = evaluateOption(makeInput(), makeOption({ category: "driver" }));
    const withGoal = evaluateOption(
      makeInput({ goals: { ...makeInput().goals, lessSpin: true } }),
      makeOption({ category: "driver" }),
    );
    expect(withGoal.launchSpin).toBe(baseline.launchSpin + 8);
  });

  it("adds dispersion bonus of 7 (not 10) when tighterDispersion goal is set", () => {
    const baseline = evaluateOption(makeInput(), makeOption({ category: "driver" }));
    const withGoal = evaluateOption(
      makeInput({ goals: { ...makeInput().goals, tighterDispersion: true } }),
      makeOption({ category: "driver" }),
    );
    expect(withGoal.dispersion).toBe(baseline.dispersion + 7);
  });
});

describe("Default reason", () => {
  it("adds a default reason when no rules match", () => {
    const input = makeInput();
    const option = makeOption({ category: "driver" });
    const result = evaluateOption(input, option);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
