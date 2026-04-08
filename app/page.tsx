import Link from "next/link";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: "⚙️",
    title: "Club Fitting",
    description:
      "Data-driven recommendations for ball, driver, irons, and shafts — built from your launch data and tendencies.",
    href: "/fit/new",
    cta: "Start a fit",
  },
  {
    icon: "📅",
    title: "Training Routines",
    description:
      "Generate a personalized 4-week practice plan targeting your weaknesses. Change the plan anytime.",
    href: "/training",
    cta: "Build a routine",
  },
  {
    icon: "🎯",
    title: "Drill Library",
    description:
      "330+ structured drills organized by weakness, skill level, and type — warmup, skill, pressure, and transfer.",
    href: "/drills",
    cta: "Browse drills",
  },
  {
    icon: "📈",
    title: "Progress Stats",
    description:
      "Track sessions completed, current streak, and weakness coverage across all your training activity.",
    href: "/stats",
    cta: "View stats",
  },
];

const steps = [
  {
    n: "01",
    title: "Get fitted",
    description:
      "Run through the fitting workflow — profile, launch data, goals — and get personalized equipment recommendations.",
  },
  {
    n: "02",
    title: "Build your routine",
    description:
      "Generate a 4-week training plan around your biggest weaknesses, or browse and pick drills manually.",
  },
  {
    n: "03",
    title: "Track and improve",
    description:
      "Log sessions, rate your practice, and watch your streaks and weakness coverage improve over time.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gb-line">
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gb-muted">
            Golf fitting · Practice planning · Drill library
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build the game
            <br />
            <span className="text-gb-green">you want.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-gb-muted">
            Club fitting data meets practice science. Get fitted, build a training routine, and track
            every session — all in one place.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/fit/new">Start a Fit</Button>
            <Button href="/training" variant="secondary">
              Build a Routine
            </Button>
          </div>
        </div>
      </section>

      {/* ── Feature grid ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gb-muted">
          Everything in one platform
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Four tools. One build.</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group flex flex-col rounded-xl border border-gb-line bg-gb-panel p-6 transition-colors hover:border-gb-green/40"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-gb-muted">{f.description}</p>
              <span className="mt-4 text-sm font-semibold text-gb-green group-hover:underline">
                {f.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="border-y border-gb-line bg-gb-panel">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gb-muted">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">A repeatable loop that works.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <article key={s.n} className="rounded-xl border border-gb-line bg-gb-bg p-6">
                <p className="text-4xl font-bold text-gb-green/30">{s.n}</p>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gb-muted">{s.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fitting CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl border border-gb-green/20 bg-gb-green-soft p-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            The fit is the foundation.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gb-muted">
            Every practice session is more effective when you know you&apos;re training with the right
            equipment. Start with a fitting, then build your routine.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/fit/new">Start a Fit Now</Button>
            <Button href="/drills" variant="secondary">
              Browse the Drill Library
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
