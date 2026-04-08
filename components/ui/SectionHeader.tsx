interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({ eyebrow, title, description, centered = false }: SectionHeaderProps) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gb-muted">{eyebrow}</p> : null}
      <h2 className="text-3xl font-bold tracking-tight text-gb-text sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-gb-muted">{description}</p> : null}
    </div>
  );
}
