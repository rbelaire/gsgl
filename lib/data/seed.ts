import { RecommendationCategory } from "../fitting/types";

export interface EquipmentOption {
  id: string;
  name: string;
  category: RecommendationCategory;
  traits: string[];
  spinProfile?: "low" | "mid" | "high";
  launchProfile?: "low" | "mid" | "high";
  feel?: "firm" | "balanced" | "soft";
  weightClass?: "light" | "mid" | "heavy";
  flexProfile?: "regular" | "stiff" | "xstiff";
  forgivenessLevel?: "high" | "mid" | "low";
  bias?: "draw" | "neutral";
}

export const balls: EquipmentOption[] = [
  {
    id: "ball-low-firm",
    name: "Tour Distance LS",
    category: "ball",
    traits: ["low spin", "firm", "distance"],
    spinProfile: "low",
    launchProfile: "mid",
    feel: "firm",
  },
  {
    id: "ball-mid-balanced",
    name: "Performance Balance",
    category: "ball",
    traits: ["mid spin", "balanced", "all around"],
    spinProfile: "mid",
    launchProfile: "mid",
    feel: "balanced",
  },
  {
    id: "ball-high-soft",
    name: "Control Soft Urethane",
    category: "ball",
    traits: ["high spin", "soft", "control"],
    spinProfile: "high",
    launchProfile: "high",
    feel: "soft",
  },
];

export const drivers: EquipmentOption[] = [
  {
    id: "driver-low-spin",
    name: "LS 9.0 Head",
    category: "driver",
    traits: ["low spin", "penetrating flight"],
    spinProfile: "low",
    launchProfile: "low",
    forgivenessLevel: "low",
    bias: "neutral",
  },
  {
    id: "driver-forgiveness",
    name: "Max Forgiveness 10.5 Head",
    category: "driver",
    traits: ["high MOI", "stable", "forgiveness"],
    spinProfile: "mid",
    launchProfile: "mid",
    forgivenessLevel: "high",
    bias: "neutral",
  },
  {
    id: "driver-draw",
    name: "Draw Bias 10.5 Head",
    category: "driver",
    traits: ["draw bias", "anti-right miss", "forgiving"],
    spinProfile: "mid",
    launchProfile: "mid",
    forgivenessLevel: "high",
    bias: "draw",
  },
];

export const shafts: EquipmentOption[] = [
  {
    id: "shaft-light-high",
    name: "Launch 50",
    category: "shaft",
    traits: ["light", "high launch"],
    weightClass: "light",
    launchProfile: "high",
    flexProfile: "regular",
  },
  {
    id: "shaft-mid-mid",
    name: "Control 60",
    category: "shaft",
    traits: ["mid weight", "mid launch"],
    weightClass: "mid",
    launchProfile: "mid",
    flexProfile: "stiff",
  },
  {
    id: "shaft-heavy-low",
    name: "Tour 70",
    category: "shaft",
    traits: ["heavy", "low launch", "stable"],
    weightClass: "heavy",
    launchProfile: "low",
    flexProfile: "xstiff",
  },
];

export const irons: EquipmentOption[] = [
  {
    id: "iron-forged-player",
    name: "Forged Player Cavity",
    category: "irons",
    traits: ["workability", "mid forgiveness"],
    forgivenessLevel: "mid",
    launchProfile: "mid",
  },
  {
    id: "iron-distance-game",
    name: "Distance Game Improvement",
    category: "irons",
    traits: ["forgiveness", "high launch", "distance"],
    forgivenessLevel: "high",
    launchProfile: "high",
  },
  {
    id: "iron-players-compact",
    name: "Compact Players Iron",
    category: "irons",
    traits: ["low spin", "flighted", "precision"],
    forgivenessLevel: "low",
    launchProfile: "low",
  },
];
