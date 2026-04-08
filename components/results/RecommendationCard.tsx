interface RecommendationCardProps {
  title: string;
  value: string;
  summary: string;
}

export function RecommendationCard({ title, value, summary }: RecommendationCardProps) {
  return (
    <article className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gb-muted">{title}</p>
      <h3 className="mt-3 text-xl font-semibold text-gb-text">{value}</h3>
      <p className="mt-3 text-sm leading-6 text-gb-muted">{summary}</p>
    </article>
  );
}
