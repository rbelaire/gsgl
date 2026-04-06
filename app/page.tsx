import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Gulf South Golf Lab</h1>
        <p className="mt-3 text-slate-600">
          Rules-based golf fitting workflow for driver, ball, irons, shafts, and basic build specs.
        </p>
        <div className="mt-6 flex gap-3">
          <Link className="rounded-md bg-slate-900 px-4 py-2 text-white" href="/login">
            Login
          </Link>
          <Link className="rounded-md border border-slate-300 px-4 py-2" href="/signup">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
