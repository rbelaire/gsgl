import type { CameraView, SwingLineType, SwingPosition } from "./types";

export const SWING_POSITION_LABELS: Record<SwingPosition, string> = {
  address: "Address",
  takeaway_club_parallel: "Takeaway (Club Parallel)",
  lead_arm_parallel: "Lead Arm Parallel",
  top: "Top",
  shaft_parallel_downswing: "Shaft Parallel (Downswing)",
  impact: "Impact",
  finish: "Finish",
};

export const SWING_LINE_TYPE_LABELS: Record<SwingLineType, string> = {
  shaft_plane: "Shaft Plane",
  vertical_grip_line: "Vertical Grip Line",
  spine_angle: "Spine Angle",
  hip_depth: "Hip Depth",
  head_line: "Head Line",
  hand_path: "Hand Path",
  lead_boundary: "Lead Boundary",
  trail_boundary: "Trail Boundary",
  low_point: "Low Point",
  ball_position: "Ball Position",
  custom: "Custom",
};

export const DEFAULT_LINE_COLORS: Record<SwingLineType, string> = {
  shaft_plane: "#22C55E",
  vertical_grip_line: "#0EA5E9",
  spine_angle: "#A855F7",
  hip_depth: "#F97316",
  head_line: "#F43F5E",
  hand_path: "#14B8A6",
  lead_boundary: "#EAB308",
  trail_boundary: "#6366F1",
  low_point: "#EF4444",
  ball_position: "#F59E0B",
  custom: "#94A3B8",
};

export const LINE_TOOL_RECOMMENDATIONS: Record<CameraView, SwingLineType[]> = {
  dtl: [
    "shaft_plane",
    "vertical_grip_line",
    "hip_depth",
    "head_line",
    "hand_path",
    "lead_boundary",
    "trail_boundary",
  ],
  face_on: [
    "spine_angle",
    "head_line",
    "hand_path",
    "low_point",
    "ball_position",
    "vertical_grip_line",
  ],
};

export function getSwingPositionLabel(position: SwingPosition): string {
  return SWING_POSITION_LABELS[position];
}

export function getSwingLineTypeLabel(type: SwingLineType): string {
  return SWING_LINE_TYPE_LABELS[type];
}

export function getDefaultLineColor(type: SwingLineType): string {
  return DEFAULT_LINE_COLORS[type];
}

export function getRecommendedLineTools(cameraView: CameraView): SwingLineType[] {
  return LINE_TOOL_RECOMMENDATIONS[cameraView];
}
