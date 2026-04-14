import { NextRequest, NextResponse } from "next/server";
import { requireUserId, AuthError } from "@/lib/firebase/auth-server";
import { updateRoutine, deleteRoutine } from "@/lib/firebase/routines";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const uid = await requireUserId(req);
    const { id } = await params;
    const body = await req.json();
    await updateRoutine(uid, id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof Error && err.message.startsWith("Forbidden"))
      return NextResponse.json({ error: err.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const uid = await requireUserId(req);
    const { id } = await params;
    await deleteRoutine(uid, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    if (err instanceof Error && err.message.startsWith("Forbidden"))
      return NextResponse.json({ error: err.message }, { status: 403 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
