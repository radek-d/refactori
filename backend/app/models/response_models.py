from pydantic import BaseModel, EmailStr
from typing import Optional


# ─── Meta ────────────────────────────────────────────────────────────────────

class SectionTitles(BaseModel):
    summary: str
    skills: str
    experience: str
    education: str
    certifications: str
    openSource: str

class RefactorMeta(BaseModel):
    refactoredAt: str
    modelUsed: str
    targetCompany: str
    targetJobTitle: str
    jobUrl: Optional[str] = None
    sectionTitles: SectionTitles


# ─── Candidate ───────────────────────────────────────────────────────────────

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    location: Optional[str] = None


class Candidate(BaseModel):
    fullName: str
    title: str
    contactInfo: ContactInfo
    summary: str


# ─── Tech Stack ──────────────────────────────────────────────────────────────

class TechStack(BaseModel):
    languages: list[str]
    frameworks: list[str]
    infrastructure: list[str]
    databases: list[str]


# ─── Experience ──────────────────────────────────────────────────────────────

class Achievement(BaseModel):
    formula: str
    """Google X-Y-Z: 'Achieved X, measured by Y, by doing Z'"""
    impact: str
    """Category: performance | quality | cost | scalability | security | dx"""
    metric: str
    """Short human-readable metric: '-65% latency', '+57% coverage'"""


class Project(BaseModel):
    projectName: str
    projectScope: str
    techUsed: list[str]
    achievements: list[Achievement]


class ExperienceEntry(BaseModel):
    companyName: str
    companyUrl: Optional[str] = None
    role: str
    startDate: str
    """Format: YYYY-MM or 'present'"""
    endDate: str
    location: Optional[str] = None
    employmentType: Optional[str] = None
    """B2B | Contract | Freelance"""
    projects: list[Project]


# ─── Education ───────────────────────────────────────────────────────────────

class EducationEntry(BaseModel):
    institution: str
    degree: str
    field: str
    graduationYear: Optional[int] = None
    relevant_coursework: Optional[list[str]] = None


# ─── Certifications ──────────────────────────────────────────────────────────

class Certification(BaseModel):
    name: str
    issuer: str
    year: Optional[int] = None
    credentialUrl: Optional[str] = None


# ─── Open Source ─────────────────────────────────────────────────────────────

class OpenSourceProject(BaseModel):
    projectName: str
    repoUrl: Optional[str] = None
    description: str
    techUsed: list[str]


# ─── Match Report ────────────────────────────────────────────────────────────

class MatchReport(BaseModel):
    matchPercentage: int
    matchedKeywords: list[str]
    missingKeywords: list[str]
    advice: list[str]
    atsWarnings: list[str]


# ─── Root Response ───────────────────────────────────────────────────────────

class RefactorResponse(BaseModel):
    """
    Full JSON contract returned by Groq and passed to Next.js.
    This is also stored as-is in Supabase: cv_refactors.refactored_json
    """
    meta: RefactorMeta
    candidate: Candidate
    techStack: TechStack
    experience: list[ExperienceEntry]
    education: list[EducationEntry]
    certifications: list[Certification]
    openSource: list[OpenSourceProject]
    matchReport: MatchReport


# ─── API wrapper (adds DB record id) ─────────────────────────────────────────

class RefactorAPIResponse(BaseModel):
    refactorId: str
    """UUID from cv_refactors table — used for routing to /refactor/result/[id]"""
    data: RefactorResponse
