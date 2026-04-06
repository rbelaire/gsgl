import { NextRequest } from "next/server";
import { adminAuth } from "./admin";

export async function requireUserId(req: NextRequest): Promise<string> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Missing auth token");

  const decoded = await adminAuth().verifyIdToken(token);
  return decoded.uid;
}
