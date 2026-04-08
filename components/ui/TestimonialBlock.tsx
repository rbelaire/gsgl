interface TestimonialBlockProps {
  quote: string;
  source: string;
  role: string;
}

export function TestimonialBlock({ quote, source, role }: TestimonialBlockProps) {
  return (
    <blockquote className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
      <p className="text-lg leading-8 text-gb-text">“{quote}”</p>
      <footer className="mt-4 text-sm text-gb-muted">
        <span className="font-semibold text-gb-text">{source}</span>
        <span className="mx-2">•</span>
        <span>{role}</span>
      </footer>
    </blockquote>
  );
}
