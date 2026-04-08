interface ServiceCardProps {
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
}

export function ServiceCard({ title, description, inputs, outputs }: ServiceCardProps) {
  return (
    <article className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gb-text">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-gb-muted">{description}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gb-muted">Inputs</h4>
          <ul className="mt-2 space-y-1 text-sm text-gb-muted">
            {inputs.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gb-muted">Outputs</h4>
          <ul className="mt-2 space-y-1 text-sm text-gb-muted">
            {outputs.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
