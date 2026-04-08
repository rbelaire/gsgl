"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { useAuth } from "@/hooks/useAuth";
import { siteConfig } from "@/lib/constants/site";
import { cn } from "@/lib/helpers/cn";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  async function handleSignOut() {
    if (auth) await signOut(auth);
    router.push("/");
  }

  return (
    <header className="print:hidden sticky top-0 z-30 border-b border-gb-line bg-gb-bg/95 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-gb-text">
            the<span className="text-gb-green">golf</span>
            <span className="text-gb-cta">build</span>
          </Link>
          <div className="flex items-center gap-3">
            {isFirebaseConfigured && user ? (
              <button
                onClick={handleSignOut}
                className="rounded-md border border-gb-line px-4 py-2 text-sm font-medium text-gb-muted transition-colors hover:text-gb-text"
                type="button"
              >
                Sign out
              </button>
            ) : isFirebaseConfigured ? (
              <Link
                href="/login"
                className="rounded-md border border-gb-line px-4 py-2 text-sm font-medium text-gb-muted transition-colors hover:text-gb-text"
              >
                Sign in
              </Link>
            ) : null}
            <Link
              href="/fit/new"
              className="rounded-md bg-gb-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-600"
            >
              Start a Fit
            </Link>
          </div>
        </div>
        <nav className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-gb-line pt-3">
          {siteConfig.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-gb-muted transition-colors hover:text-gb-text",
                pathname === link.href && "text-gb-text",
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
