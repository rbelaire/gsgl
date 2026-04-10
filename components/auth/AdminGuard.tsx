"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { isAdminEmail } from "@/lib/constants/admins";

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps a page so only admin users can access it.
 * Non-admins are redirected to /dashboard.
 * When Firebase is not configured, blocks access entirely.
 */
export function AdminGuard({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const authed = !loading && !!user;
  const admin = authed && isAdminEmail(user?.email);

  useEffect(() => {
    if (loading) return;
    if (!isFirebaseConfigured || !user) {
      router.replace("/login");
      return;
    }
    if (!isAdminEmail(user.email)) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (!isFirebaseConfigured) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gb-muted">Firebase is not configured.</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gb-muted">Loading…</p>
      </main>
    );
  }

  if (!authed || !admin) return null;

  return <>{children}</>;
}
