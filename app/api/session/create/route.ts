import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { requireUserId } from "@/lib/firebase/auth-server";
import { fitSessionSchema } from "@/lib/session-schema";

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId(req);
    const body = await req.json();
    const parsed = fitSessionSchema.parse(body);

    const sessionRef = adminDb().collection("sessions").doc();
    await sessionRef.set({
      id: sessionRef.id,
      userId,
      createdAt: FieldValue.serverTimestamp(),
      ...parsed,
    });

    await adminDb().collection("users").doc(userId).set(
      {
        id: userId,
        email: body.email ?? "",
      },
      { merge: true },
    );

    return NextResponse.json({ id: sessionRef.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
