interface EmptyStatePanelProps {
  title: string;
  description: string;
}

export function EmptyStatePanel({ title, description }: EmptyStatePanelProps) {
  return (
    <div className="rounded-xl border border-dashed border-gsgl-navy/25 bg-gsgl-sand p-8 text-center">
      <h3 className="text-lg font-semibold text-gsgl-navy">{title}</h3>
      <p className="mt-3 text-sm text-gsgl-gray">{description}</p>
    </div>
  );
}
