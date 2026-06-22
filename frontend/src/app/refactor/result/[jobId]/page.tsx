"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getRefactor } from "@/lib/api";
import { RefactorData } from "@/lib/types";
import ResumeEditor from "@/components/editor/ResumeEditor";
import MatchReport from "@/components/editor/MatchReport";
import { Loader2, AlertCircle } from "lucide-react";

export default function ResultPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [data, setData] = useState<RefactorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRefactor(jobId)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(var(--color-brand))" }} />
        <p className="text-sm" style={{ color: "hsl(var(--color-text-muted))" }}>
          Loading your refactored CV…
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <AlertCircle className="w-8 h-8" style={{ color: "hsl(var(--color-red))" }} />
        <p className="text-sm" style={{ color: "hsl(var(--color-text-muted))" }}>
          {error ?? "Could not load this refactor."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1400px] mx-auto px-4 py-8">
        {/* ── Left: Match Report sidebar ─────────────────────── */}
        <aside className="lg:w-80 shrink-0 no-print">
          <MatchReport report={data.matchReport} meta={data.meta} />
        </aside>

        {/* ── Right: Live CV Editor + Print ──────────────────── */}
        <main className="flex-1 min-w-0">
          <ResumeEditor data={data} />
        </main>
      </div>
    </div>
  );
}
