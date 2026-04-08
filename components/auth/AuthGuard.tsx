"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isFirebaseConfigured } from "@/lib/firebase/client";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps a page and redirects to /login when the user is not authenticated.
 * When Firebase is not configured (e.g. local dev without env vars) this
 * component is transparent — it renders children immediately without any auth
 * check so the app remains fully usable without a Firebase project.
 */
export function AuthGuard({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // No Firebase — bypass entirely
  if (!isFirebaseConfigured) return <>{children}</>;

  // Still resolving initial auth state
  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gb-muted">Loading…</p>
      </main>
    );
  }

  // Not authenticated — redirect is in flight, render nothing
  if (!user) return null;

  return <>{children}</>;
}
