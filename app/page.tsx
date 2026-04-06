import { HeroSection } from "@/components/sections/HeroSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { TestimonialBlock } from "@/components/ui/TestimonialBlock";
import { featuredCapabilities } from "@/lib/mock-data/site";

const processSteps = [
  {
    title: "Capture the player baseline",
    description: "Start with tendencies, current equipment, and launch metrics to establish a complete performance snapshot.",
  },
  {
    title: "Apply structured fit logic",
    description: "Compare inputs against fit rules for ball, club head, shaft profile, and key spec decisions.",
  },
  {
    title: "Deliver practical recommendations",
    description: "Return clear suggestions, confidence levels, and next actions for testing or in-studio validation.",
  },
];

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeader
          eyebrow="Core fit coverage"
          title="One platform for ball, club, shaft, and spec optimization"
          description="Gulf South Golf Lab is designed for players and fitters who want equipment decisions grounded in launch data and player tendencies."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredCapabilities.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </div>
      </section>

      <section className="border-y border-gsgl-navy/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeader
            eyebrow="How it works"
            title="A clear workflow built for consistent fitting decisions"
            description="The platform follows a repeatable process so each recommendation can be traced to measurable player inputs."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article key={step.title} className="rounded-xl border border-gsgl-navy/10 bg-gsgl-offwhite p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gsgl-slate">Step {index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-gsgl-navy">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gsgl-gray">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeader
          eyebrow="Credibility"
          title="Built around measurable outcomes, not assumptions"
          description="Recommendations are presented with confidence context so players know when to trust the output and when additional data is needed."
        />
        <div className="mt-8">
          <TestimonialBlock
            quote="This framework gives our team a consistent way to tie launch monitor numbers to practical equipment decisions."
            source="Performance Coach"
            role="Regional player development program"
          />
        </div>
      </section>
    </main>
  );
}
