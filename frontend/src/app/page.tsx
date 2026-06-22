import Link from "next/link";
import { ArrowRight, Zap, Target, FileText, BarChart3, Shield, Cpu } from "lucide-react";

const FEATURES = [
  {
    icon: Target,
    title: "ATS Score Optimization",
    desc: "Surgical keyword injection from the job posting. Exact spelling, zero stuffing — maximizes pass rate through automated screening.",
    color: "brand",
  },
  {
    icon: Zap,
    title: "Ultra-fast Groq Inference",
    desc: "Powered by llama-3.3-70b-versatile on Groq's LPU™ infrastructure. Full CV refactoring in under 10 seconds.",
    color: "cyan",
  },
  {
    icon: FileText,
    title: "Google X-Y-Z Formula",
    desc: "Every bullet point rewritten as: \u201cAchieved X, measured by Y, by doing Z.\u201d Hard metrics, no filler, no buzzwords.",
    color: "green",
  },
  {
    icon: BarChart3,
    title: "Match Report",
    desc: "Instant analysis: match percentage, missing keywords, actionable advice ranked by impact, ATS formatting warnings.",
    color: "amber",
  },
  {
    icon: Shield,
    title: "ATS-Clean PDF Export",
    desc: "Native browser print — vector text, no images, no tables. Perfect for Workday, Greenhouse, Lever, and iCIMS.",
    color: "brand",
  },
  {
    icon: Cpu,
    title: "IT-Specific Intelligence",
    desc: "Tech stack auto-classified: Languages / Frameworks / Infrastructure / Databases. Understands B2B, UoP, remote, and more.",
    color: "cyan",
  },
];

const ROLES = ["Developers", "DevOps", "Data Scientists", "QA Engineers", "Product Managers"];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* ── Background ───────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, hsl(250 84% 67% / 0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "hsl(var(--color-border))" }}
        />
      </div>

      {/* ── Navbar ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
           style={{ borderBottom: "1px solid hsl(var(--color-border) / 0.5)", backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: "hsl(var(--color-brand))" }}>
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "hsl(var(--color-text))" }}>
            Refactori
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "hsl(var(--color-text-muted))" }}
          >
            Log in
          </Link>
          <Link
            href="/register"
            id="hero-cta-nav"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-all"
            style={{ background: "hsl(var(--color-brand))", color: "white" }}
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="pt-40 pb-28 px-6 text-center max-w-5xl mx-auto animate-fade-up">
        {/* Role carousel pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
             style={{ background: "hsl(var(--color-brand) / 0.12)", border: "1px solid hsl(var(--color-brand) / 0.25)", color: "hsl(var(--color-brand))" }}>
          <Zap className="w-3 h-3" />
          Built exclusively for IT professionals
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
          <span className="gradient-text">Refactor your CV</span>
          <br />
          <span style={{ color: "hsl(var(--color-text))" }}>for every role.</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
           style={{ color: "hsl(var(--color-text-muted))" }}>
          Paste your CV and a job posting URL. In seconds, REFACTORI ENGINE rewrites your
          experience with <strong style={{ color: "hsl(var(--color-text))" }}>hard metrics</strong>,{" "}
          <strong style={{ color: "hsl(var(--color-text))" }}>ATS keywords</strong>, and the{" "}
          <strong style={{ color: "hsl(var(--color-text))" }}>Google X-Y-Z formula</strong> — then
          exports a clean, recruiter-ready PDF.
        </p>

        {/* Roles */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {ROLES.map((role) => (
            <span key={role} className="tech-badge tech-badge-lang">{role}</span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            id="hero-cta-primary"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all animate-pulse-glow"
            style={{ background: "hsl(var(--color-brand))", color: "white" }}
          >
            Refactor my CV — it&apos;s free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 rounded-xl text-base font-medium transition-colors"
            style={{
              color: "hsl(var(--color-text-muted))",
              border: "1px solid hsl(var(--color-border))",
            }}
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not AI-generated. <span className="gradient-text">AI-refactored.</span>
          </h2>
          <p style={{ color: "hsl(var(--color-text-muted))" }}>
            Every field engineered for technical hiring pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            const colorMap: Record<string, string> = {
              brand: "hsl(var(--color-brand))",
              cyan: "hsl(var(--color-cyan))",
              green: "hsl(var(--color-green))",
              amber: "hsl(var(--color-amber))",
            };
            const col = colorMap[feat.color];
            return (
              <div
                key={feat.title}
                className="glass p-6 hover:border-opacity-50 transition-all group"
                style={{ "--hover-border": col } as React.CSSProperties}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${col}18` }}
                >
                  <Icon className="w-5 h-5" style={{ color: col }} />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "hsl(var(--color-text))" }}>
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--color-text-muted))" }}>
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works steps ───────────────────────────────── */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          3 steps. <span className="gradient-text">Zero fluff.</span>
        </h2>
        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "Upload your CV + paste job URL",
              desc: "Drop a PDF, DOCX, or paste plain text. Paste the job posting URL — we scrape it automatically.",
            },
            {
              step: "02",
              title: "REFACTORI ENGINE processes it",
              desc: "llama-3.3-70b on Groq rewrites every bullet with X-Y-Z formula, injects ATS keywords, classifies your tech stack.",
            },
            {
              step: "03",
              title: "Edit live → download ATS PDF",
              desc: "Full inline editor — tweak any field before printing. Download a clean vector PDF in one click.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="glass flex items-start gap-6 p-6"
            >
              <div
                className="text-3xl font-extrabold font-mono shrink-0"
                style={{ color: "hsl(var(--color-brand) / 0.4)" }}
              >
                {item.step}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm" style={{ color: "hsl(var(--color-text-muted))" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA footer ───────────────────────────────────────── */}
      <section className="py-24 px-6 text-center">
        <div
          className="max-w-2xl mx-auto glass p-12"
          style={{ background: "hsl(var(--color-brand) / 0.06)" }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to get past the ATS?
          </h2>
          <p className="mb-8" style={{ color: "hsl(var(--color-text-muted))" }}>
            Join tech professionals refactoring smarter, not harder.
          </p>
          <Link
            href="/register"
            id="footer-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all"
            style={{ background: "hsl(var(--color-brand))", color: "white" }}
          >
            Start refactoring <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-8 px-6 text-center text-sm border-t"
              style={{ borderColor: "hsl(var(--color-border))", color: "hsl(var(--color-text-subtle))" }}>
        © 2026 Refactori · Automated resume refactoring for tech professionals
      </footer>
    </main>
  );
}
