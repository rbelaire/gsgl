"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/Card";
import { TopNav } from "@/components/TopNav";
import { auth } from "@/lib/firebase/client";

interface Recommendation {
  name: string;
  score: number;
  reasons: string[];
  expectedImprovement: string;
  confidence: "High" | "Medium" | "Low";
}

interface SessionResponse {
  recommendation: {
    ball: Recommendation[];
    driver: Recommendation[];
    irons: Recommendation[];
    shafts: Recommendation[];
    confidence: "High" | "Medium" | "Low";
    buildSpecs: {
      lengthAdjustment: string;
      lieAdjustment: string;
      gripSize: string;
    };
  } | null;
}

export default function SessionResultPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SessionResponse | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(`/api/session/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const json = (await res.json()) as SessionResponse;
      setData(json);
    });
    return () => unsub();
  }, [id]);

  const rec = data?.recommendation;

  const chartData = rec
    ? [
        { category: "Ball", score: rec.ball[0]?.score ?? 0 },
        { category: "Driver", score: rec.driver[0]?.score ?? 0 },
        { category: "Irons", score: rec.irons[0]?.score ?? 0 },
        { category: "Shaft", score: rec.shafts[0]?.score ?? 0 },
      ]
    : [];

  return (
    <main>
      <TopNav />
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        <h1 className="text-2xl font-bold">Fitting Results</h1>
        {!rec ? <p>Loading...</p> : null}

        {rec ? (
          <>
            <Card title={`Overall confidence: ${rec.confidence}`}>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#0f172a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <RecommendationSection title="Ball Recommendation" items={rec.ball} />
            <RecommendationSection title="Driver Setup" items={rec.driver} />
            <RecommendationSection title="Iron + Shaft Recommendation" items={[...rec.irons, ...rec.shafts]} />

            <Card title="Basic Build Specs">
              <p>Length: {rec.buildSpecs.lengthAdjustment}</p>
              <p>Lie: {rec.buildSpecs.lieAdjustment}</p>
              <p>Grip: {rec.buildSpecs.gripSize}</p>
            </Card>
          </>
        ) : null}
      </div>
    </main>
  );
}

function RecommendationSection({ title, items }: { title: string; items: Recommendation[] }) {
  return (
    <Card title={title}>
      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <article key={item.name} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-slate-600">Score {item.score} / 100</p>
            </div>
            <p className="mt-2 text-sm">Why: {item.reasons.join(" ")}</p>
            <p className="mt-1 text-sm">Expected improvement: {item.expectedImprovement}</p>
            <p className="mt-1 text-sm">Confidence: {item.confidence}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
