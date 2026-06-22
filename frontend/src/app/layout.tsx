import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Refactori — Automated Resume Refactoring for Tech Professionals",
  description:
    "Refactori uses AI to refactor your CV for specific IT job postings — optimizing for ATS systems and highlighting your tech stack using Google's X-Y-Z achievement formula.",
  keywords: [
    "resume refactoring",
    "ATS optimization",
    "CV for developers",
    "tech CV",
    "IT resume",
    "AI resume builder",
  ],
  openGraph: {
    title: "Refactori",
    description: "Automated resume refactoring for tech professionals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
