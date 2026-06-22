"use client";

import { MatchReport as MatchReportType, RefactorMeta } from "@/lib/types";
import { AlertTriangle, CheckCircle2, XCircle, Lightbulb, TrendingUp } from "lucide-react";

interface Props {
  report: MatchReportType;
  meta: RefactorMeta;
}

function ScoreRing({ pct }: { pct: number }) {
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  const color =
    pct >= 80 ? "hsl(var(--color-green))" :
    pct >= 60 ? "hsl(var(--color-amber))" :
                "hsl(var(--color-red))";

  return (
    <svg width="88" height="88" className="shrink-0">
      <circle cx="44" cy="44" r={radius} fill="none"
              stroke="hsl(var(--color-surface-3))" strokeWidth="6" />
      <circle cx="44" cy="44" r={radius} fill="none"
              stroke={color} strokeWidth="6"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 44 44)"
              style={{ transition: "stroke-dasharray 0.6s ease" }} />
      <text x="44" y="44" textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize="16" fontWeight="700" fontFamily="Inter, sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

export default function MatchReport({ report, meta }: Props) {
  return (
    <div className="space-y-4 sticky top-8">
      {/* Score card */}
      <div className="glass p-5">
        <div className="flex items-center gap-4 mb-4">
          <ScoreRing pct={report.matchPercentage} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
               style={{ color: "hsl(var(--color-text-muted))" }}>
              ATS Match Score
            </p>
            <p className="text-sm font-medium">{meta.targetJobTitle}</p>
            <p className="text-xs" style={{ color: "hsl(var(--color-text-muted))" }}>
              @ {meta.targetCompany}
            </p>
          </div>
        </div>

        {/* Score interpretation */}
        <div className="text-xs px-3 py-2 rounded-lg"
             style={{
               background: report.matchPercentage >= 80
                 ? "hsl(var(--color-green) / 0.1)"
                 : report.matchPercentage >= 60
                 ? "hsl(var(--color-amber) / 0.1)"
                 : "hsl(var(--color-red) / 0.1)",
               color: report.matchPercentage >= 80
                 ? "hsl(var(--color-green))"
                 : report.matchPercentage >= 60
                 ? "hsl(var(--color-amber))"
                 : "hsl(var(--color-red))",
             }}>
          {report.matchPercentage >= 80
            ? "Strong match — likely to pass ATS screening"
            : report.matchPercentage >= 60
            ? "Good match — some gaps worth addressing"
            : "Significant gaps — review missing keywords"}
        </div>
      </div>

      {/* Matched keywords */}
      {report.matchedKeywords.length > 0 && (
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--color-green))" }} />
            <span className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "hsl(var(--color-text-muted))" }}>
              Matched ({report.matchedKeywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.matchedKeywords.map((kw) => (
              <span key={kw}
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      background: "hsl(var(--color-green) / 0.1)",
                      border: "1px solid hsl(var(--color-green) / 0.25)",
                      color: "hsl(var(--color-green))",
                    }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing keywords */}
      {report.missingKeywords.length > 0 && (
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--color-red))" }} />
            <span className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "hsl(var(--color-text-muted))" }}>
              Missing ({report.missingKeywords.length})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {report.missingKeywords.map((kw) => (
              <span key={kw}
                    className="px-2 py-0.5 rounded text-xs font-mono"
                    style={{
                      background: "hsl(var(--color-red) / 0.1)",
                      border: "1px solid hsl(var(--color-red) / 0.25)",
                      color: "hsl(var(--color-red))",
                    }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Advice */}
      {report.advice.length > 0 && (
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--color-amber))" }} />
            <span className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "hsl(var(--color-text-muted))" }}>
              Advice
            </span>
          </div>
          <ul className="space-y-2.5">
            {report.advice.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed"
                  style={{ color: "hsl(var(--color-text-muted))" }}>
                <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "hsl(var(--color-amber))" }} />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ATS Warnings */}
      {report.atsWarnings.length > 0 && (
        <div className="glass p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "hsl(var(--color-amber))" }} />
            <span className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "hsl(var(--color-text-muted))" }}>
              ATS Warnings
            </span>
          </div>
          <ul className="space-y-2">
            {report.atsWarnings.map((w, i) => (
              <li key={i} className="text-xs leading-relaxed"
                  style={{ color: "hsl(var(--color-text-muted))" }}>
                ⚠ {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
