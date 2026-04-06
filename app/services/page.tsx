import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/mock-data/site";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Services"
        title="Structured fitting services for every equipment decision"
        description="Each service combines player inputs with measurable launch characteristics to produce practical recommendations."
      />
      <div className="mt-10 grid gap-5">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </main>
  );
}
