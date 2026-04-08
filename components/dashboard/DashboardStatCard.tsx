interface DashboardStatCardProps {
  label: string;
  value: string;
  trend: string;
}

export function DashboardStatCard({ label, value, trend }: DashboardStatCardProps) {
  return (
    <article className="rounded-xl border border-gb-line bg-gb-panel p-5 shadow-sm">
      <p className="text-sm text-gb-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gb-text">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-gb-muted">{trend}</p>
    </article>
  );
}
