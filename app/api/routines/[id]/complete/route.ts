import { NextRequest, NextResponse } from "next/server";
import { requireUserId, AuthError } from "@/lib/firebase/auth-server";
import { toggleSessionCompletion } from "@/lib/firebase/routines";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireUserId(req);
    const { id } = await params;
    const { key } = (await req.json()) as { key: string };
    const completed = await toggleSessionCompletion(id, key);
    return NextResponse.json({ completed });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: 401 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
