"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";

const INPUT_CLS =
  "w-full rounded-md border border-gsgl-navy/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gsgl-gold/50";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // If Firebase isn't configured, redirect to dashboard (no auth needed).
  useEffect(() => {
    if (!isFirebaseConfigured) {
      router.replace("/dashboard");
    }
  }, [router]);

  if (!isFirebaseConfigured) return null;

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth!, email.trim(), password);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight text-gsgl-navy">Sign in</h1>
      <p className="mt-3 text-sm leading-7 text-gsgl-gray">
        Access your fitting sessions and saved recommendations.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-medium text-gsgl-navy mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={INPUT_CLS}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gsgl-navy mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={INPUT_CLS}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
    </main>
  );
}
