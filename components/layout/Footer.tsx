import Link from "next/link";
import { siteConfig } from "@/lib/constants/site";

export function Footer() {
  return (
    <footer className="print:hidden border-t border-gb-line bg-gb-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-semibold text-gb-text">
            the<span className="text-gb-green">golf</span>
            <span className="text-gb-cta">build</span>
          </h3>
          <p className="mt-3 text-sm leading-6 text-gb-muted">{siteConfig.tagline}</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gb-muted">Navigation</h4>
          <ul className="mt-3 space-y-2 text-sm text-gb-muted">
            {siteConfig.navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gb-text">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-gb-muted">Contact</h4>
          <p className="mt-3 text-sm text-gb-muted">hello@thegolfbuild.com</p>
          <p className="mt-1 text-sm text-gb-muted">Gulf South region · Vercel-hosted</p>
        </div>
      </div>
      <div className="border-t border-gb-line px-4 py-4 text-center text-xs text-gb-muted">
        © {new Date().getFullYear()} The Golf Build. All rights reserved.
      </div>
    </footer>
  );
}
