"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { Button } from "@/components/ui/Button";

const INPUT_CLS =
  "w-full rounded-md border border-gb-line bg-gb-input px-3 py-2.5 text-sm text-gb-text placeholder:text-gb-muted focus:outline-none focus:ring-2 focus:ring-gb-green/40";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured) router.replace("/dashboard");
  }, [router]);

  if (!isFirebaseConfigured) return null;

  function resetForm() {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
  }

  function switchMode(next: "signin" | "signup") {
    resetForm();
    setMode(next);
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Name is required.");
        return;
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth!, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth!, email.trim(), password);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/email-already-in-use") {
        setError("An account with that email already exists. Sign in instead.");
      } else if (code === "auth/invalid-email") {
        setError("That doesn't look like a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Choose a stronger password (at least 8 characters).");
      } else if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-20">
      <h1 className="text-3xl font-bold tracking-tight">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h1>
      <p className="mt-2 text-sm text-gb-muted">
        {mode === "signin"
          ? "Access your fitting sessions and saved recommendations."
          : "Get started with fitting, training routines, and the drill library."}
      </p>

      {/* Mode toggle */}
      <div className="mt-6 flex rounded-lg border border-gb-line bg-gb-panel p-1">
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
            mode === "signin"
              ? "bg-gb-green text-white"
              : "text-gb-muted hover:text-gb-text"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "bg-gb-green text-white"
              : "text-gb-muted hover:text-gb-text"
          }`}
        >
          Create account
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 rounded-xl border border-gb-line bg-gb-panel p-6"
      >
        <div className="grid gap-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className={INPUT_CLS}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={INPUT_CLS}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className={INPUT_CLS}
              placeholder={mode === "signup" ? "Min. 8 characters" : "••••••••"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gb-text" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                className={INPUT_CLS}
                placeholder="Re-enter password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-5">
          <Button type="submit" disabled={submitting} className="w-full justify-center">
            {submitting
              ? mode === "signup"
                ? "Creating account…"
                : "Signing in…"
              : mode === "signup"
              ? "Create account"
              : "Sign in"}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-gb-muted">
        {mode === "signin" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className="font-semibold text-gb-green hover:underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className="font-semibold text-gb-green hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </main>
  );
}
