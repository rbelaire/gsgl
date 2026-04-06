interface RecommendationCardProps {
  title: string;
  value: string;
  summary: string;
}

export function RecommendationCard({ title, value, summary }: RecommendationCardProps) {
  return (
    <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gsgl-slate">{title}</p>
      <h3 className="mt-3 text-xl font-semibold text-gsgl-navy">{value}</h3>
      <p className="mt-3 text-sm leading-6 text-gsgl-gray">{summary}</p>
    </article>
  );
}
