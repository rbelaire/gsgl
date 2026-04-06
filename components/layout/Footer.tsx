import Link from "next/link";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-gsgl-navy/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-gsgl-navy">{siteConfig.name}</h3>
          <p className="mt-3 text-sm leading-6 text-gsgl-gray">{siteConfig.tagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gsgl-slate">Navigation</h4>
          <ul className="mt-3 space-y-2 text-sm text-gsgl-gray">
            {siteConfig.navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gsgl-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gsgl-slate">Contact</h4>
          <p className="mt-3 text-sm text-gsgl-gray">hello@gulfsouthgolflab.com</p>
          <p className="mt-1 text-sm text-gsgl-gray">Gulf South region studio planning in progress</p>
        </div>
      </div>
      <div className="border-t border-gsgl-navy/10 px-4 py-4 text-center text-xs text-gsgl-gray">
        © {new Date().getFullYear()} Gulf South Golf Lab. All rights reserved.
      </div>
    </footer>
  );
}
