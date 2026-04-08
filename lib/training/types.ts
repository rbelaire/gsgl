export type DrillType = "warmup" | "technical" | "pressure" | "transfer" | "skill" | "random";
export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type HandicapBand = "Beginner (20+)" | "Intermediate (10-19)" | "Advanced (0-9)";

export interface Drill {
  id: string;
  name: string;
  description: string;
  weaknesses: string[];
  type: DrillType;
  levels: SkillLevel[];
}

export interface NewDrill {
  drill_id: string;
  name: string;
  category: DrillType;
  weakness_target: string;
  skill_min: number;
  skill_max: number;
  duration_min: number;
  difficulty: number;
  equipment: string[];
  location: string;
  fatigue_level: "low" | "medium" | "high";
  scoring_type: "binary" | "strokes" | "percentage" | "dispersion_radius";
  focus_tags: string[];
  setup: string;
  execution: string;
  scoring: string;
  progression_hint: string;
  constraints: string[];
}

export interface TrainingProfile {
  name: string;
  handicap: string;          // "Beginner (20+)" | "Intermediate (10-19)" | "Advanced (0-9)"
  weakness: string;
  weaknesses: string[];
  daysPerWeek: number;
  hoursPerSession: number;
  notes: string;
}

export interface Session {
  title: string;
  bullets: string[];
  drillIds: string[];
}

export interface Week {
  week: number;
  headline: string;
  sessions: Session[];
}

export interface Routine {
  id?: string;
  userId?: string;
  title: string;
  meta: string;
  profileSnapshot: TrainingProfile;
  weeks: Week[];
  completions: Record<string, boolean>;   // "weekIdx-sessionIdx" → true/false
  reflections: Record<string, Reflection>;
  createdAt?: string;
}

export interface Reflection {
  rating: number;
  tags: string[];
  note: string;
}

export interface UserStats {
  routinesSaved: number;
  sessionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  weaknessCoverage: Record<string, number>;
}
