"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listRefactors, getUserCredits } from "@/lib/api";
import { RefactorHistoryItem } from "@/lib/types";
import {
  Plus, Building2, Briefcase, ExternalLink,
  Loader2, FileText, LogOut, Zap
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
  userEmail: string;
}

function MatchBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const color = pct >= 80 ? "hsl(var(--color-green))" : pct >= 60 ? "hsl(var(--color-amber))" : "hsl(var(--color-red))";
  return (
    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded"
          style={{ background: `${color}18`, border: `1px solid ${color}33`, color }}>
      {pct}% match
    </span>
  );
}

export default function DashboardClient({ userId, userEmail }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<RefactorHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    listRefactors()
      .then((res) => setItems(res.items))
      .finally(() => setLoading(false));

    getUserCredits()
      .then((res) => setCredits(res.credits))
      .catch((err) => console.error("Error fetching credits:", err));
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse 60% 30% at 50% 0%, hsl(250 84% 67% / 0.1) 0%, transparent 50%)" }}
      />

      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center justify-between border-b"
           style={{ borderColor: "hsl(var(--color-border))", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: "hsl(var(--color-brand))" }}>
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg">Refactori</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:scale-105"
            style={{
              color: "hsl(var(--color-amber))",
              border: "1px solid hsl(var(--color-amber) / 0.3)",
              background: "hsl(var(--color-amber) / 0.08)",
            }}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{credits !== null ? `${credits} ${credits === 1 ? 'credit' : 'credits'}` : "Loading..."}</span>
          </Link>
          <span className="text-xs hidden sm:block" style={{ color: "hsl(var(--color-text-muted))" }}>
            {userEmail}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-colors"
            style={{ color: "hsl(var(--color-text-muted))", border: "1px solid hsl(var(--color-border))" }}
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Your CV Deploys</h1>
            <p className="text-sm" style={{ color: "hsl(var(--color-text-muted))" }}>
              History of all refactored CVs — one per job application
            </p>
          </div>
          <Link
            href="/refactor"
            id="new-refactor-btn"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "hsl(var(--color-brand))", color: "white" }}
          >
            <Plus className="w-4 h-4" /> New refactor
          </Link>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "hsl(var(--color-brand))" }} />
          </div>
        ) : items.length === 0 ? (
          <div className="glass p-16 text-center">
            <FileText className="w-10 h-10 mx-auto mb-4" style={{ color: "hsl(var(--color-text-subtle))" }} />
            <h3 className="font-semibold mb-2">No refactors yet</h3>
            <p className="text-sm mb-6" style={{ color: "hsl(var(--color-text-muted))" }}>
              Paste your CV and a job URL to get started.
            </p>
            <Link href="/refactor"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold"
                  style={{ background: "hsl(var(--color-brand))", color: "white" }}>
              <Zap className="w-4 h-4" /> Refactor my first CV
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/refactor/result/${item.id}`}
                className="glass flex items-center gap-4 p-4 transition-all group hover:border-opacity-60"
                style={{ display: "flex" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                     style={{ background: "hsl(var(--color-brand) / 0.1)" }}>
                  <FileText className="w-5 h-5" style={{ color: "hsl(var(--color-brand))" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm truncate">{item.job_title ?? "Unknown role"}</span>
                    <MatchBadge pct={item.match_percent} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs" style={{ color: "hsl(var(--color-text-muted))" }}>
                      <Building2 className="w-3 h-3" />{item.company_name}
                    </span>
                    <span className="text-xs" style={{ color: "hsl(var(--color-text-subtle))" }}>
                      {new Date(item.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: "hsl(var(--color-text-muted))" }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
