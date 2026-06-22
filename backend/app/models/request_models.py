from pydantic import BaseModel, HttpUrl
from typing import Optional


class RefactorRequest(BaseModel):
    """Payload sent from Next.js to FastAPI to trigger a CV refactoring."""

    raw_cv_text: str
    """Full text of the candidate's original CV (plain text, no HTML)."""

    job_url: Optional[str] = None
    """URL of the job posting. Backend will scrape it if provided."""

    job_description_override: Optional[str] = None
    """Manual job description text. Used as fallback if scraping fails or job_url is None."""

    company_name: str
    """Name of the target company (used for history labeling)."""

    user_id: str
    """Supabase auth.users UUID — passed from Next.js after token verification."""
