import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-gsgl-navy/10 bg-gsgl-offwhite">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(11,31,58,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(11,31,58,0.07)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gsgl-slate">Golf fitting platform</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-gsgl-navy sm:text-5xl">
          Data-Driven Golf Fitting Built for Better Decisions
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gsgl-gray">
          Fit the ball, clubs, shafts, and specs with a system designed to turn player data into better equipment choices.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/fit/new">Start a Fit</Button>
          <Button href="/services" variant="secondary">
            Explore Services
          </Button>
        </div>
      </div>
    </section>
  );
}
