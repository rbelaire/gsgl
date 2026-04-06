export type Tempo = "smooth" | "medium" | "aggressive";
export type MissTendency = "left" | "right" | "both";
export type Trajectory = "low" | "mid" | "high";

export interface PlayerProfile {
  handicap: number;
  heightIn: number;
  wristToFloorIn: number;
  ageRange: "under30" | "30to50" | "over50";
  tempo: Tempo;
  missTendency: MissTendency;
  trajectory: Trajectory;
}

export interface CurrentEquipment {
  driverModel: string;
  driverLoft: string;
  driverShaft: string;
  ironModel: string;
  ironShaft: string;
  ballModel: string;
}

export interface LaunchData {
  clubSpeed?: number;
  ballSpeed?: number;
  launchAngle?: number;
  spinRate?: number;
  carryDistance?: number;
  attackAngle?: number;
  consistencyIndex?: number;
}

export interface FitGoals {
  moreDistance: boolean;
  lessSpin: boolean;
  higherLaunch: boolean;
  tighterDispersion: boolean;
  softerFeel: boolean;
}

export interface FitSessionInput {
  profile: PlayerProfile;
  equipment: CurrentEquipment;
  launchData: LaunchData;
  goals: FitGoals;
}

export type RecommendationCategory = "ball" | "driver" | "irons" | "shaft";

export interface ScoredRecommendation {
  id: string;
  name: string;
  category: RecommendationCategory;
  score: number;
  reasons: string[];
  expectedImprovement: string;
  confidence: "High" | "Medium" | "Low";
  components: {
    distance: number;
    dispersion: number;
    launchSpin: number;
    preference: number;
    forgiveness: number;
  };
}

export interface FitRecommendationResult {
  ball: ScoredRecommendation[];
  driver: ScoredRecommendation[];
  irons: ScoredRecommendation[];
  shafts: ScoredRecommendation[];
  confidence: "High" | "Medium" | "Low";
  buildSpecs: {
    lengthAdjustment: string;
    lieAdjustment: string;
    gripSize: string;
  };
}
