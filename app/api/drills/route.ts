import { NextResponse } from "next/server";
import { DRILL_LIBRARY } from "@/lib/training/drills";

export async function GET() {
  return NextResponse.json({ drills: DRILL_LIBRARY });
}
