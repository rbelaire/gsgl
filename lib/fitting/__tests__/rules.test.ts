import { describe, expect, it } from "vitest";
import { evaluateOption } from "../rules";
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

describe("evaluateOption – driver", () => {
  it("boosts launchSpin and distance for high spin + low-spin driver", () => {
    const input = makeInput({ launchData: { spinRate: 3100 } });
    const option = makeOption({ category: "driver", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeGreaterThan(50);
    expect(result.distance).toBeGreaterThan(50);
    expect(result.reasons.some((r) => r.includes("spin"))).toBe(true);
  });

  it("boosts dispersion and forgiveness for right miss + draw-biased head", () => {
    const input = makeInput({ profile: { ...makeInput().profile, missTendency: "right" } });
    const option = makeOption({ category: "driver", bias: "draw" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeGreaterThan(50);
    expect(result.forgiveness).toBeGreaterThan(50);
  });

  it("boosts dispersion and forgiveness for inconsistent strike + high-MOI head", () => {
    const input = makeInput({ launchData: { consistencyIndex: 40 } });
    const option = makeOption({ category: "driver", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeGreaterThan(50);
    expect(result.forgiveness).toBeGreaterThan(50);
  });
});

describe("evaluateOption – ball", () => {
  it("boosts preference for softerFeel goal + soft ball", () => {
    const input = makeInput({ goals: { ...makeInput().goals, softerFeel: true } });
    const option = makeOption({ category: "ball", feel: "soft" });
    const result = evaluateOption(input, option);
    expect(result.preference).toBeGreaterThan(50);
  });

  it("boosts launchSpin and distance for high spin + high launch + low-spin ball", () => {
    const input = makeInput({ launchData: { spinRate: 3300, launchAngle: 15 } });
    const option = makeOption({ category: "ball", spinProfile: "low" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeGreaterThan(50);
    expect(result.distance).toBeGreaterThan(50);
  });
});

describe("evaluateOption – shaft", () => {
  it("boosts dispersion and distance for high speed + aggressive + heavy shaft", () => {
    const input = makeInput({
      profile: { ...makeInput().profile, tempo: "aggressive" },
      launchData: { clubSpeed: 105 },
    });
    const option = makeOption({ category: "shaft", weightClass: "heavy" });
    const result = evaluateOption(input, option);
    expect(result.dispersion).toBeGreaterThan(50);
    expect(result.distance).toBeGreaterThan(50);
  });
});

describe("evaluateOption – irons", () => {
  it("boosts forgiveness for high handicap + forgiving iron", () => {
    const input = makeInput({ profile: { ...makeInput().profile, handicap: 20 } });
    const option = makeOption({ category: "irons", forgivenessLevel: "high" });
    const result = evaluateOption(input, option);
    expect(result.forgiveness).toBeGreaterThan(50);
  });

  it("boosts launchSpin for low trajectory + high-launch iron", () => {
    const input = makeInput({ profile: { ...makeInput().profile, trajectory: "low" } });
    const option = makeOption({ category: "irons", launchProfile: "high" });
    const result = evaluateOption(input, option);
    expect(result.launchSpin).toBeGreaterThan(50);
  });
});

describe("evaluateOption – goal bonuses", () => {
  it("adds distance bonus when moreDistance goal is set", () => {
    const baseline = evaluateOption(makeInput(), makeOption({ category: "driver" }));
    const withGoal = evaluateOption(
      makeInput({ goals: { ...makeInput().goals, moreDistance: true } }),
      makeOption({ category: "driver" }),
    );
    expect(withGoal.distance).toBe(baseline.distance + 8);
  });
});

describe("evaluateOption – default reason", () => {
  it("adds a default reason when no rules match", () => {
    const input = makeInput();
    const option = makeOption({ category: "driver" });
    const result = evaluateOption(input, option);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
