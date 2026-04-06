"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth } from "@/lib/firebase/client";
import { db } from "@/lib/firebase/firestore-client";
import { Card } from "@/components/Card";
import { TopNav } from "@/components/TopNav";

interface SessionItem {
  id: string;
  createdAt?: { seconds: number };
  profile?: { handicap?: number };
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const q = query(collection(db, "sessions"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const snaps = await getDocs(q);
      setSessions(snaps.docs.map((doc) => doc.data() as SessionItem));
    });

    return () => unsub();
  }, []);

  return (
    <main>
      <TopNav />
      <div className="mx-auto max-w-6xl p-4">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link className="rounded-md bg-slate-900 px-4 py-2 text-white" href="/fit/new">
            New Fit
          </Link>
        </div>
        <Card title="Previous fitting sessions">
          <div className="space-y-3">
            {sessions.length === 0 ? <p className="text-sm text-slate-600">No sessions yet.</p> : null}
            {sessions.map((session) => (
              <Link key={session.id} href={`/session/${session.id}`} className="block rounded-lg border p-3 hover:bg-slate-50">
                <p className="font-medium">Session {session.id}</p>
                <p className="text-sm text-slate-600">Handicap: {session.profile?.handicap ?? "N/A"}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
