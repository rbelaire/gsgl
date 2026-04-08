interface FormSectionWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FormSectionWrapper({ title, description, children }: FormSectionWrapperProps) {
  return (
    <section className="rounded-xl border border-gb-line bg-gb-panel p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gb-text">{title}</h2>
      <p className="mt-2 text-sm text-gb-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
