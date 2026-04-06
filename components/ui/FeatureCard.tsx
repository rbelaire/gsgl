interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm transition-transform hover:-translate-y-0.5">
      <h3 className="text-lg font-semibold text-gsgl-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-gsgl-gray">{description}</p>
    </article>
  );
}
