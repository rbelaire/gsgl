interface FormSectionWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FormSectionWrapper({ title, description, children }: FormSectionWrapperProps) {
  return (
    <section className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gsgl-navy">{title}</h2>
      <p className="mt-2 text-sm text-gsgl-gray">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
