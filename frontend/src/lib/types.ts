// ============================================================
// Refactori — TypeScript Type System
// 1:1 mirror of the Python Pydantic JSON contract
// ============================================================

export interface SectionTitles {
  summary: string;
  skills: string;
  experience: string;
  education: string;
  certifications: string;
  openSource: string;
}

export interface RefactorMeta {
  refactoredAt: string;
  modelUsed: string;
  targetCompany: string;
  targetJobTitle: string;
  jobUrl: string | null;
  sectionTitles?: SectionTitles;
}

export interface ContactInfo {
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  location: string | null;
}

export interface Candidate {
  fullName: string;
  title: string;
  contactInfo: ContactInfo;
  summary: string;
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  infrastructure: string[];
  databases: string[];
}

export type AchievementImpact =
  | "performance"
  | "quality"
  | "cost"
  | "scalability"
  | "security"
  | "dx";

export interface Achievement {
  formula: string;
  impact: AchievementImpact;
  metric: string;
}

export interface Project {
  projectName: string;
  projectScope: string;
  techUsed: string[];
  achievements: Achievement[];
}

export type EmploymentType = "B2B" | "UoP" | "Contract" | "Freelance";

export interface ExperienceEntry {
  companyName: string;
  companyUrl: string | null;
  role: string;
  startDate: string;
  endDate: string;
  location: string | null;
  employmentType: EmploymentType | null;
  projects: Project[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number | null;
  relevant_coursework: string[] | null;
}

export interface Certification {
  name: string;
  issuer: string;
  year: number | null;
  credentialUrl: string | null;
}

export interface OpenSourceProject {
  projectName: string;
  repoUrl: string | null;
  description: string;
  techUsed: string[];
}

export interface MatchReport {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  advice: string[];
  atsWarnings: string[];
}

export interface RefactorData {
  meta: RefactorMeta;
  candidate: Candidate;
  techStack: TechStack;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: Certification[];
  openSource: OpenSourceProject[];
  matchReport: MatchReport;
}

export interface RefactorAPIResponse {
  refactorId: string;
  data: RefactorData;
}

// Dashboard history list item (denormalized subset)
export interface RefactorHistoryItem {
  id: string;
  company_name: string;
  job_title: string | null;
  job_url: string | null;
  match_percent: number | null;
  status: "pending" | "processing" | "done" | "error";
  created_at: string;
}
