"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";

interface AuthState {
  user: User | null;
  /** True while we're waiting for Firebase to resolve the initial auth state. */
  loading: boolean;
}

export function useAuth(): AuthState {
  // Start loading only when Firebase is configured; otherwise we're already done.
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: isFirebaseConfigured,
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setState({ user: null, loading: false });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false });
    });

    return unsubscribe;
  }, []);

  return state;
}
