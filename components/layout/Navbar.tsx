"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/helpers/cn";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  async function handleSignOut() {
    if (auth) {
      await signOut(auth);
    }
    router.push("/");
  }

  return (
    <header className="print:hidden sticky top-0 z-30 border-b border-gsgl-navy/10 bg-gsgl-offwhite/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-gsgl-navy">
            {siteConfig.name}
          </Link>
          <div className="flex items-center gap-2">
            {isFirebaseConfigured && user ? (
              <button
                onClick={handleSignOut}
                className="rounded-md border border-gsgl-navy/20 bg-white px-4 py-2.5 text-sm font-semibold text-gsgl-navy transition-colors hover:bg-gsgl-sand"
                type="button"
              >
                Sign out
              </button>
            ) : null}
            <Button href="/fit/new" className="shrink-0">
              Start a Fit
            </Button>
          </div>
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
