export type CameraView = "dtl" | "face_on";

export type SwingPosition =
  | "address"
  | "takeaway_club_parallel"
  | "lead_arm_parallel"
  | "top"
  | "shaft_parallel_downswing"
  | "impact"
  | "finish";

export type SwingLineType =
  | "shaft_plane"
  | "vertical_grip_line"
  | "spine_angle"
  | "hip_depth"
  | "head_line"
  | "hand_path"
  | "lead_boundary"
  | "trail_boundary"
  | "low_point"
  | "ball_position"
  | "custom";

export interface SwingPoint {
  x: number;
  y: number;
}

export interface SwingDrawingLine {
  id: string;
  type: SwingLineType;
  label: string;
  color: string;
  points: SwingPoint[];
  strokeWidth: number;
  locked: boolean;
  createdAt: string;
}

export interface SwingFrame {
  id: string;
  videoId: string;
  position: SwingPosition;
  timestamp: number;
  imageUrl?: string;
  drawings: SwingDrawingLine[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SwingVideo {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  localObjectUrl?: string;
  storagePath?: string;
  downloadUrl?: string;
  uploadedAt: string;
}

export interface SwingDrillRecommendation {
  id: string;
  title: string;
  purpose: string;
  setup: string;
  reps: string;
  successCheckpoint: string;
}

export interface SwingReport {
  id: string;
  userId?: string;
  studentName: string;
  title: string;
  date: string;
  club: string;
  cameraView: CameraView;
  ballFlight: string;
  contactQuality: string;
  mainMiss: string;
  priorityFix: string;
  summary: string;
  videos: SwingVideo[];
  frames: SwingFrame[];
  drills: SwingDrillRecommendation[];
  createdAt: string;
  updatedAt: string;
}
