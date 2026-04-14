import { NextRequest, NextResponse } from "next/server";
import { requireUserId, AuthError } from "@/lib/firebase/auth-server";
import { buildRulesRoutine, normalizeProfile, validateProfileShape } from "@/lib/training/drills";

export async function POST(req: NextRequest) {
  try {
    await requireUserId(req);
    const body = await req.json();
    const rawProfile = body?.profile;

    if (!validateProfileShape(rawProfile)) {
      return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
    }

    const profile = normalizeProfile(rawProfile);
    const { weeks } = buildRulesRoutine(profile);

    const title = profile.name;

    const totalMinutes = Math.round(profile.hoursPerSession * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const sessionLengthLabel = h === 0 ? `${m} min` : m === 0 ? `${h} hr` : `${h} hr ${m} min`;
    const meta = `${profile.handicap} · ${profile.daysPerWeek} day${profile.daysPerWeek > 1 ? "s" : ""}/week · ${sessionLengthLabel}/session`;

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
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Failed to generate routine" }, { status: 500 });
  }
}
