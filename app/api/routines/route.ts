import { NextRequest, NextResponse } from "next/server";
import { requireUserId, AuthError } from "@/lib/firebase/auth-server";
import { getUserRoutines, createRoutine } from "@/lib/firebase/routines";

export async function GET(req: NextRequest) {
  try {
    const uid = await requireUserId(req);
    const routines = await getUserRoutines(uid);
    return NextResponse.json({ routines });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const uid = await requireUserId(req);
    const body = await req.json();
    const routine = await createRoutine(uid, body.routine);
    return NextResponse.json({ routine }, { status: 201 });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
