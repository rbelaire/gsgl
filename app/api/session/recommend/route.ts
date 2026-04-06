import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/firebase/auth-server";
import { runFittingEngine } from "@/lib/fitting/engine";
import { fitSessionSchema } from "@/lib/session-schema";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId(req);
    const body = await req.json();
    const parsed = fitSessionSchema.parse(body);

    const result = runFittingEngine(parsed);

    if (body.sessionId) {
      await adminDb().collection("recommendations").doc(body.sessionId).set({
        sessionId: body.sessionId,
        userId,
        ...result,
        scores: {
          ball: result.ball.map((v) => ({ id: v.id, score: v.score })),
          driver: result.driver.map((v) => ({ id: v.id, score: v.score })),
          irons: result.irons.map((v) => ({ id: v.id, score: v.score })),
          shafts: result.shafts.map((v) => ({ id: v.id, score: v.score })),
        },
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
