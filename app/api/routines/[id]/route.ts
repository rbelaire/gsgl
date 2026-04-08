import { NextRequest, NextResponse } from "next/server";
import { requireUserId, AuthError } from "@/lib/firebase/auth-server";
import { updateRoutine, deleteRoutine } from "@/lib/firebase/routines";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUserId(req);
    const { id } = await params;
    const body = await req.json();
    await updateRoutine(id, body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUserId(req);
    const { id } = await params;
    await deleteRoutine(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
