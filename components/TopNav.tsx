"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function TopNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link className="text-base font-semibold" href="/dashboard">
          Gulf South Golf Lab
        </Link>
        <button
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          onClick={() => signOut(auth)}
          type="button"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
