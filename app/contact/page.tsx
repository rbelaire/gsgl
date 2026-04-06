import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeader
        eyebrow="Contact"
        title="Start your fitting inquiry"
        description="Tell us about your current setup and goals. We will use this information to guide your first fitting session."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <form className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="First name" />
            <input className="rounded-md border border-gsgl-navy/20 px-3 py-2" placeholder="Last name" />
            <input className="rounded-md border border-gsgl-navy/20 px-3 py-2 sm:col-span-2" placeholder="Email address" type="email" />
            <input className="rounded-md border border-gsgl-navy/20 px-3 py-2 sm:col-span-2" placeholder="What are you trying to improve?" />
            <textarea className="min-h-36 rounded-md border border-gsgl-navy/20 px-3 py-2 sm:col-span-2" placeholder="Share current equipment, launch data access, and timeline." />
          </div>
          <div className="mt-5">
            <Button type="submit">Send Inquiry</Button>
          </div>
        </form>

        <aside className="space-y-6">
          <article className="rounded-xl border border-gsgl-navy/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gsgl-navy">Getting started</h2>
            <p className="mt-3 text-sm leading-7 text-gsgl-gray">
              Initial inquiries typically begin with a digital fit intake so recommendations can be scoped before any in-person testing.
            </p>
          </article>
          <article className="rounded-xl border border-gsgl-gold/30 bg-gsgl-sand p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gsgl-navy">Future studio fitting</h2>
            <p className="mt-3 text-sm leading-7 text-gsgl-gray">
              Include your region and preferred timeline to be notified when Gulf South studio fitting windows open.
            </p>
          </article>
        </aside>
      </div>
    </main>
  );
}
