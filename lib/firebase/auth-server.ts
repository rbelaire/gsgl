import { NextRequest } from "next/server";
import { adminAuth } from "./admin";

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: "missing_token" | "invalid_token" | "expired_token",
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireUserId(req: NextRequest): Promise<string> {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new AuthError("Missing auth token", "missing_token");

  try {
    const decoded = await adminAuth().verifyIdToken(token);
    return decoded.uid;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("auth/id-token-expired")) {
      throw new AuthError("Auth token has expired", "expired_token");
    }
    throw new AuthError("Invalid auth token", "invalid_token");
  }
}
