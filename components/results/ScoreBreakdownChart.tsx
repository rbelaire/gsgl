"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface Props {
  components: {
    distance: number;
    dispersion: number;
    launchSpin: number;
    preference: number;
    forgiveness: number;
  };
}

const AXIS_LABELS: Record<keyof Props["components"], string> = {
  distance: "Distance",
  dispersion: "Dispersion",
  launchSpin: "Launch/Spin",
  preference: "Preference",
  forgiveness: "Forgiveness",
};

export function ScoreBreakdownChart({ components }: Props) {
  const data = (Object.keys(AXIS_LABELS) as (keyof typeof AXIS_LABELS)[]).map(
    (key) => ({
      subject: AXIS_LABELS[key],
      score: components[key],
    }),
  );

  return (
    <ResponsiveContainer width="100%" height={180}>
      <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke="#1B2B4B1A" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6B7280" }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="score"
          stroke="#C4A55A"
          fill="#C4A55A"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
