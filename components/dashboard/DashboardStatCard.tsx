interface DashboardStatCardProps {
  label: string;
  value: string;
  trend: string;
}

export function DashboardStatCard({ label, value, trend }: DashboardStatCardProps) {
  return (
    <article className="rounded-xl border border-gsgl-navy/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-gsgl-gray">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gsgl-navy">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-gsgl-slate">{trend}</p>
    </article>
  );
}
