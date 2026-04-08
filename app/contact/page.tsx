"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

type Status = "idle" | "submitting" | "success" | "error";

const INPUT_CLS = "rounded-md border border-gb-line px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-gsgl-gold/50";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  function validate(form: HTMLFormElement): boolean {
    const data = new FormData(form);
    const next: typeof errors = {};

    if (!String(data.get("firstName")).trim()) next.firstName = "First name is required.";
    if (!String(data.get("lastName")).trim()) next.lastName = "Last name is required.";

    const email = String(data.get("email")).trim();
    if (!email) {
      next.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }

    if (!String(data.get("goal")).trim()) next.goal = "Please describe what you are trying to improve.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!validate(ev.currentTarget)) return;

    setStatus("submitting");
    // Placeholder: replace with actual API call when endpoint is available.
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="rounded-xl border border-gb-green/20 bg-gb-card p-10 text-center">
          <h2 className="text-2xl font-bold text-gb-text">Inquiry received</h2>
          <p className="mt-4 text-sm leading-7 text-gb-muted">
            We will be in touch shortly to scope your first fitting session.
          </p>
          <div className="mt-6">
            <Button href="/">Back to home</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Contact"
        title="Start your fitting inquiry"
        description="Tell us about your current setup and goals. We will use this information to guide your first fitting session."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <form onSubmit={handleSubmit} noValidate className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="firstName">First name</label>
              <input id="firstName" name="firstName" className={INPUT_CLS} autoComplete="given-name" />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="lastName">Last name</label>
              <input id="lastName" name="lastName" className={INPUT_CLS} autoComplete="family-name" />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" className={INPUT_CLS} autoComplete="email" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="goal">What are you trying to improve?</label>
              <input id="goal" name="goal" className={INPUT_CLS} />
              {errors.goal && <p className="mt-1 text-xs text-red-600">{errors.goal}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gb-text mb-1" htmlFor="notes">Current equipment, launch data access, and timeline</label>
              <textarea id="notes" name="notes" className={`${INPUT_CLS} min-h-36`} />
            </div>
          </div>
          <div className="mt-5">
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send Inquiry"}
            </Button>
          </div>
        </form>

        <aside className="space-y-6">
          <article className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gb-text">Getting started</h2>
            <p className="mt-3 text-sm leading-7 text-gb-muted">
              Initial inquiries typically begin with a digital fit intake so recommendations can be scoped before any in-person testing.
            </p>
          </article>
          <article className="rounded-xl border border-gb-green/20 bg-gb-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gb-text">Future studio fitting</h2>
            <p className="mt-3 text-sm leading-7 text-gb-muted">
              Include your region and preferred timeline to be notified when Gulf South studio fitting windows open.
            </p>
          </article>
        </aside>
      </div>
    </main>
  );
}
