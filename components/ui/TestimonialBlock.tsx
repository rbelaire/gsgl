interface TestimonialBlockProps {
  quote: string;
  source: string;
  role: string;
}

export function TestimonialBlock({ quote, source, role }: TestimonialBlockProps) {
  return (
    <blockquote className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
      <p className="text-lg leading-8 text-gsgl-navy">“{quote}”</p>
      <footer className="mt-4 text-sm text-gsgl-gray">
        <span className="font-semibold text-gsgl-navy">{source}</span>
        <span className="mx-2">•</span>
        <span>{role}</span>
      </footer>
    </blockquote>
  );
}
