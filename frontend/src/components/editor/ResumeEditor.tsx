"use client";

import { RefactorData, TechStack } from "@/lib/types";
import { Printer, Edit3 } from "lucide-react";

interface Props {
  data: RefactorData;
}

const TECH_CATEGORY_LABELS: Record<keyof TechStack, string> = {
  languages: "Languages",
  frameworks: "Frameworks",
  infrastructure: "Infrastructure",
  databases: "Databases",
};


export default function ResumeEditor({ data }: Props) {
  function handlePrint() {
    import("html2pdf.js").then((html2pdf) => {
      const element = document.getElementById("cv-print-root");
      if (!element) return;
      
      // Temporarily override dark mode classes specifically for the PDF capture
      const originalClasses = element.className;
      const originalColor = element.style.color;
      const originalBg = element.style.backgroundColor;
      
      element.className = ""; // Remove glass and other dark-mode wrappers
      element.style.color = "#111111"; // Force dark text
      element.style.backgroundColor = "#ffffff"; // Force white bg
      
      const opt = {
        margin:       [10, 10, 10, 10] as [number, number, number, number],
        filename:     `${data.candidate.fullName.replace(/\\s+/g, '_')}_CV.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#ffffff', color: '#111111' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf.default().set(opt as any).from(element).save().then(() => {
        element.className = originalClasses;
        element.style.color = originalColor;
        element.style.backgroundColor = originalBg;
      });
    });
  }

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="no-print flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4" style={{ color: "hsl(var(--color-brand))" }} />
          <span className="text-sm font-medium">Live editor — click any field to edit</span>
        </div>
        <button
          id="print-cv-btn"
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "hsl(var(--color-brand))", color: "white" }}
        >
          <Printer className="w-4 h-4" />
          Download ATS PDF
        </button>
      </div>

      {/* ── CV Document ─────────────────────────────────────── */}
      <div
        id="cv-print-root"
        className="glass"
        style={{
          maxWidth: "210mm",
          minHeight: "297mm",
          margin: "0 auto",
          padding: "20mm 22mm",
          fontFamily: "'Inter', Arial, sans-serif",
          fontSize: "0.875rem",
          lineHeight: "1.6",
          color: "hsl(var(--color-text))",
        }}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <header style={{ borderBottom: "2px solid #000", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
          <h1
            contentEditable
            suppressContentEditableWarning
            className="text-3xl font-extrabold tracking-tight mb-1"
            style={{ outline: "none", color: "#000" }}
          >
            {data.candidate.fullName}
          </h1>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text-base font-medium mb-3"
            style={{ color: "#333", outline: "none" }}
          >
            {data.candidate.title}
          </p>
          <div className="flex flex-wrap gap-3 text-xs" style={{ color: "hsl(var(--color-text-muted))" }}>
            {data.candidate.contactInfo.email && (
              <span contentEditable suppressContentEditableWarning style={{ outline: "none" }}>
                ✉ {data.candidate.contactInfo.email}
              </span>
            )}
            {data.candidate.contactInfo.phone && (
              <span contentEditable suppressContentEditableWarning style={{ outline: "none" }}>
                ☎ {data.candidate.contactInfo.phone}
              </span>
            )}
            {data.candidate.contactInfo.location && (
              <span contentEditable suppressContentEditableWarning style={{ outline: "none" }}>
                📍 {data.candidate.contactInfo.location}
              </span>
            )}
            {data.candidate.contactInfo.linkedin && (
              <a
                href={data.candidate.contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "hsl(var(--color-brand))" }}
              >
                LinkedIn
              </a>
            )}
            {data.candidate.contactInfo.github && (
              <a
                href={data.candidate.contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "hsl(var(--color-brand))" }}
              >
                GitHub
              </a>
            )}
          </div>
        </header>

        {/* ── Summary ─────────────────────────────────────────── */}
        <Section title={data.meta.sectionTitles?.summary || "Professional Summary"}>
          <p
            contentEditable
            suppressContentEditableWarning
            className="text-sm leading-relaxed"
            style={{ outline: "none", color: "#111" }}
          >
            {data.candidate.summary}
          </p>
        </Section>

        {/* ── Tech Stack ──────────────────────────────────────── */}
        <Section title={data.meta.sectionTitles?.skills || "Skills"}>
          <div className="space-y-2">
            {(Object.keys(TECH_CATEGORY_LABELS) as (keyof TechStack)[]).map((cat) => {
              const items = data.techStack[cat];
              if (!items?.length) return null;
              return (
                <div key={cat} className="flex flex-wrap items-start gap-1.5">
                  <span className="text-xs font-semibold shrink-0 mt-0.5 w-24"
                        style={{ color: "hsl(var(--color-text-muted))" }}>
                    {TECH_CATEGORY_LABELS[cat]}:
                  </span>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {items.map((tech, idx) => (
                      <span key={tech} className="text-sm" style={{ color: "#111" }}>
                        {tech}{idx < items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── Experience ──────────────────────────────────────── */}
        <Section title={data.meta.sectionTitles?.experience || "Experience"}>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-7">
              <div className="flex items-start justify-between mb-1 flex-wrap gap-1">
                <div>
                  <h3
                    contentEditable
                    suppressContentEditableWarning
                    className="font-bold text-base"
                    style={{ outline: "none" }}
                  >
                    {exp.role}
                  </h3>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    className="text-sm font-medium"
                    style={{ color: "#444", outline: "none" }}
                  >
                    {exp.companyName}
                    {exp.location && ` · ${exp.location}`}
                    {exp.employmentType && ` · ${exp.employmentType}`}
                  </p>
                </div>
                <span className="text-xs font-mono mt-1" style={{ color: "#666" }}>
                  {exp.startDate} — {exp.endDate}
                </span>
              </div>

              {/* Projects */}
              {exp.projects.map((proj, j) => (
                <div key={j} className="cv-project-block mt-3 pl-4" style={{ borderLeft: "2px solid #ccc" }}>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    className="text-sm font-semibold mb-0.5"
                    style={{ outline: "none" }}
                  >
                    {proj.projectName}
                  </p>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    className="text-xs mb-1.5 italic"
                    style={{ color: "hsl(var(--color-text-muted))", outline: "none" }}
                  >
                    {proj.projectScope}
                  </p>

                  {/* Tech used in project */}
                  {proj.techUsed.length > 0 && (
                    <div className="text-xs mb-2 italic" style={{ color: "#444" }}>
                      {proj.techUsed.join(", ")}
                    </div>
                  )}

                  {/* Achievements */}
                  <ul className="space-y-1.5 list-disc pl-4">
                    {proj.achievements.map((ach, k) => (
                      <li key={k} className="text-sm" style={{ color: "#111" }}>
                        <span
                          className="font-semibold mr-1"
                          style={{ color: "#333" }}
                        >
                          [{ach.metric}]
                        </span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          style={{ outline: "none" }}
                        >
                          {ach.formula}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </Section>

        {/* ── Education ───────────────────────────────────────── */}
        {data.education.length > 0 && (
          <Section title={data.meta.sectionTitles?.education || "Education"}>
            {data.education.map((ed, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p contentEditable suppressContentEditableWarning className="text-sm font-semibold" style={{ outline: "none", color: "#111" }}>
                      {ed.degree} in {ed.field}
                    </p>
                    <p contentEditable suppressContentEditableWarning className="text-sm" style={{ color: "#444", outline: "none" }}>
                      {ed.institution}
                    </p>
                  </div>
                  {ed.graduationYear && (
                    <span className="text-xs font-mono" style={{ color: "hsl(var(--color-text-muted))" }}>
                      {ed.graduationYear}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* ── Certifications ──────────────────────────────────── */}
        {data.certifications.length > 0 && (
          <Section title={data.meta.sectionTitles?.certifications || "Certifications"}>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i} className="text-sm">
                  <span contentEditable suppressContentEditableWarning className="font-semibold" style={{ outline: "none", color: "#111" }}>
                    {cert.name}
                  </span>
                  <span style={{ color: "#555" }}>
                    {' - '}{cert.issuer}{cert.year && ` (${cert.year})`}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Open Source ─────────────────────────────────────── */}
        {data.openSource.length > 0 && (
          <Section title={data.meta.sectionTitles?.openSource || "Open Source"}>
            {data.openSource.map((os, i) => (
              <div key={i} className="mb-3 flex items-start gap-2">
                <div>
                  <p contentEditable suppressContentEditableWarning className="text-sm font-semibold" style={{ outline: "none", color: "#111" }}>
                    {os.projectName}
                  </p>
                  <p contentEditable suppressContentEditableWarning className="text-xs" style={{ color: "#444", outline: "none", marginBottom: "4px" }}>
                    {os.description}
                  </p>
                  <div className="text-xs italic" style={{ color: "#666" }}>
                    {os.techUsed.join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2
        className="text-sm font-bold tracking-widest uppercase mb-3 pb-1"
        style={{
          color: "#000",
          borderBottom: "1px solid #000",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
