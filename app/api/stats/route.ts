import { NextRequest, NextResponse } from "next/server";
import { requireUserId, AuthError } from "@/lib/firebase/auth-server";
import { getUserTrainingStats } from "@/lib/firebase/routines";

export async function GET(req: NextRequest) {
  try {
    const uid = await requireUserId(req);
    const stats = await getUserTrainingStats(uid);
    return NextResponse.json({ stats });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
