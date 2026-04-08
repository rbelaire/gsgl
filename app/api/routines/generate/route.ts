import { NextRequest, NextResponse } from "next/server";
import { buildRulesRoutine, normalizeProfile, validateProfileShape } from "@/lib/training/drills";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawProfile = body?.profile;

    if (!validateProfileShape(rawProfile)) {
      return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
    }

    const profile = normalizeProfile(rawProfile);
    const { weeks } = buildRulesRoutine(profile);

    const title =
      profile.weaknesses.length > 1
        ? `${profile.weaknesses[0]} & ${profile.weaknesses[1]}`
        : profile.weaknesses[0] ?? "Custom Routine";

    const meta = `${profile.handicap} · ${profile.daysPerWeek} day${profile.daysPerWeek > 1 ? "s" : ""}/week · ${profile.hoursPerSession}hr/session`;

    return NextResponse.json({
      routine: {
        title,
        meta,
        profileSnapshot: profile,
        weeks,
        completions: {},
        reflections: {},
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate routine" }, { status: 500 });
  }
}
