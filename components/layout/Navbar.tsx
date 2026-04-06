"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/helpers/cn";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-gsgl-navy/10 bg-gsgl-offwhite/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-gsgl-navy">
            {siteConfig.name}
          </Link>
          <Button href="/fit/new" className="shrink-0">
            Start a Fit
          </Button>
        </div>
        <nav className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gsgl-navy/10 pt-3">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-gsgl-gray transition-colors hover:text-gsgl-navy",
                pathname === link.href && "text-gsgl-navy",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
