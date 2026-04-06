import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/firebase/auth-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await requireUserId(req);
    const { id } = await params;
    const [sessionSnap, recSnap] = await Promise.all([
      adminDb().collection("sessions").doc(id).get(),
      adminDb().collection("recommendations").doc(id).get(),
    ]);

    if (!sessionSnap.exists) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const session = sessionSnap.data();
    if (session?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      session,
      recommendation: recSnap.exists ? recSnap.data() : null,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
