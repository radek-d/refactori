"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { refactorCV, getUserCredits } from "@/lib/api";
import {
  Upload, Link2, FileText, Building2, Briefcase,
  Loader2, Zap, AlertCircle, ChevronDown
} from "lucide-react";

type InputTab = "paste" | "upload";

export default function RefactorPage() {
  const router = useRouter();

  const [inputTab, setInputTab] = useState<InputTab>("paste");
  const [cvText, setCvText] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualDesc, setShowManualDesc] = useState(false);

  const [credits, setCredits] = useState<number | null>(null);
  const [checkingCredits, setCheckingCredits] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUserCredits()
      .then((res) => {
        setCredits(res.credits);
      })
      .catch((err) => {
        console.error("Error checking credits:", err);
      })
      .finally(() => {
        setCheckingCredits(false);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();

    if (inputTab === "paste") {
      if (!cvText.trim()) { setError("Please paste your CV text."); setLoading(false); return; }
      fd.append("cv_text", cvText);
    } else {
      if (!cvFile) { setError("Please upload a CV file."); setLoading(false); return; }
      fd.append("cv_file", cvFile);
    }

    if (!jobUrl && !jobDesc) {
      setError("Provide a job URL or paste the job description.");
      setLoading(false);
      return;
    }

    if (jobUrl) fd.append("job_url", jobUrl);
    if (jobDesc) fd.append("job_description", jobDesc);
    fd.append("company_name", companyName);
    fd.append("job_title", jobTitle);

    try {
      const result = await refactorCV(fd);
      router.push(`/refactor/result/${result.refactorId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Refactoring failed. Please try again.");
      setLoading(false);
    }
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setCvFile(file);
  }

  if (checkingCredits) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(var(--color-brand))" }} />
      </div>
    );
  }

  if (credits !== null && credits <= 0) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse 70% 40% at 50% 0%, hsl(250 84% 67% / 0.12) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-md w-full glass p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center animate-pulse-glow"
               style={{ background: "hsl(var(--color-amber) / 0.1)", border: "1px solid hsl(var(--color-amber) / 0.3)" }}>
            <Zap className="w-8 h-8" style={{ color: "hsl(var(--color-amber))" }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Out of Credits</h1>
            <p className="text-sm" style={{ color: "hsl(var(--color-text-muted))" }}>
              You have used all your free generations. Purchase credits to continue refactoring your CV for target IT job descriptions.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-brand/10"
              style={{ background: "hsl(var(--color-brand))", color: "white" }}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Get Credits</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-center py-3 rounded-xl font-semibold text-sm transition-all border"
              style={{ color: "hsl(var(--color-text-muted))", borderColor: "hsl(var(--color-border))" }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 0%, hsl(250 84% 67% / 0.12) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
               style={{ background: "hsl(var(--color-brand) / 0.12)", border: "1px solid hsl(var(--color-brand) / 0.25)", color: "hsl(var(--color-brand))" }}>
            <Zap className="w-3 h-3" />
            REFACTORI ENGINE
          </div>
          <h1 className="text-3xl font-bold mb-2">Refactor your CV</h1>
          <p className="text-sm" style={{ color: "hsl(var(--color-text-muted))" }}>
            Powered by llama-3.3-70b · ATS-optimized output in ~10 seconds
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg text-sm"
                 style={{ background: "hsl(var(--color-red) / 0.1)", border: "1px solid hsl(var(--color-red) / 0.3)", color: "hsl(var(--color-red))" }}>
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* ── CV Input ──────────────────────────────────────── */}
          <div className="glass p-5">
            <div className="flex items-center gap-1 mb-4 p-1 rounded-lg w-fit"
                 style={{ background: "hsl(var(--color-surface-2))" }}>
              {(["paste", "upload"] as InputTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setInputTab(tab)}
                  className="px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize"
                  style={inputTab === tab ? {
                    background: "hsl(var(--color-brand))",
                    color: "white",
                  } : { color: "hsl(var(--color-text-muted))" }}
                >
                  {tab === "paste" ? (
                    <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Paste text</span>
                  ) : (
                    <span className="flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" />Upload PDF/DOCX</span>
                  )}
                </button>
              ))}
            </div>

            {inputTab === "paste" ? (
              <textarea
                id="cv-text-input"
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV in plain text here…&#10;&#10;Include: work experience, tech stack, education, certifications."
                rows={12}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none glow-focus font-mono"
                style={{
                  background: "hsl(var(--color-surface-2))",
                  border: "1px solid hsl(var(--color-border))",
                  color: "hsl(var(--color-text))",
                  lineHeight: "1.7",
                }}
              />
            ) : (
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                style={{
                  borderColor: cvFile ? "hsl(var(--color-brand) / 0.5)" : "hsl(var(--color-border))",
                  background: cvFile ? "hsl(var(--color-brand) / 0.05)" : "hsl(var(--color-surface-2))",
                }}
              >
                <Upload className="w-8 h-8" style={{ color: cvFile ? "hsl(var(--color-brand))" : "hsl(var(--color-text-subtle))" }} />
                {cvFile ? (
                  <div className="text-center">
                    <p className="font-medium text-sm">{cvFile.name}</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(var(--color-text-muted))" }}>
                      {(cvFile.size / 1024).toFixed(0)} KB · Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-medium text-sm">Drop your CV here</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(var(--color-text-muted))" }}>
                      PDF or DOCX · max 5 MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="cv-file-input"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                />
              </div>
            )}
          </div>

          {/* ── Job Info ──────────────────────────────────────── */}
          <div className="glass p-5 space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: "hsl(var(--color-text-muted))" }}>
              TARGET POSITION
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--color-text-muted))" }}>
                  Company name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--color-text-subtle))" }} />
                  <input
                    id="company-name-input"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none glow-focus"
                    style={{
                      background: "hsl(var(--color-surface-2))",
                      border: "1px solid hsl(var(--color-border))",
                      color: "hsl(var(--color-text))",
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--color-text-muted))" }}>
                  Job title *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--color-text-subtle))" }} />
                  <input
                    id="job-title-input"
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none glow-focus"
                    style={{
                      background: "hsl(var(--color-surface-2))",
                      border: "1px solid hsl(var(--color-border))",
                      color: "hsl(var(--color-text))",
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "hsl(var(--color-text-muted))" }}>
                Job posting URL (auto-scraped)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsl(var(--color-text-subtle))" }} />
                <input
                  id="job-url-input"
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://jobs.company.com/senior-backend-engineer"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none glow-focus"
                  style={{
                    background: "hsl(var(--color-surface-2))",
                    border: "1px solid hsl(var(--color-border))",
                    color: "hsl(var(--color-text))",
                  }}
                />
              </div>
            </div>

            {/* Manual description fallback */}
            <button
              type="button"
              onClick={() => setShowManualDesc(!showManualDesc)}
              className="flex items-center gap-1.5 text-xs transition-colors"
              style={{ color: "hsl(var(--color-text-muted))" }}
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showManualDesc ? "rotate-180" : ""}`} />
              {showManualDesc ? "Hide" : "Can't scrape? Paste job description manually"}
            </button>

            {showManualDesc && (
              <textarea
                id="job-desc-input"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here as fallback…"
                rows={6}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none glow-focus"
                style={{
                  background: "hsl(var(--color-surface-2))",
                  border: "1px solid hsl(var(--color-border))",
                  color: "hsl(var(--color-text))",
                }}
              />
            )}
          </div>

          {/* Submit */}
          <button
            id="refactor-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-base transition-all disabled:opacity-60"
            style={{ background: "hsl(var(--color-brand))", color: "white" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>REFACTORI ENGINE is working…</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Refactor my CV</span>
              </>
            )}
          </button>

          {loading && (
            <p className="text-center text-xs animate-pulse" style={{ color: "hsl(var(--color-text-muted))" }}>
              Scraping job posting · Analyzing CV · Applying X-Y-Z formula · Building match report…
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
