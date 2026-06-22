"""
Groq Service — Core AI Engine for CV Refactoring

Uses llama-3.3-70b-versatile via Groq SDK.
Handles JSON schema injection, retry logic, and response validation.
"""

import json
import logging
from typing import Any, Optional

from groq import AsyncGroq
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import get_settings
from app.models.response_models import RefactorResponse
from app.prompts.system_prompt import SYSTEM_PROMPT, build_user_prompt

logger = logging.getLogger(__name__)

# JSON schema hint injected into user prompt so the model knows exact output shape
_JSON_SCHEMA_HINT = """
{
  "meta": {
    "refactoredAt": "ISO8601 string",
    "modelUsed": "string",
    "targetCompany": "string",
    "targetJobTitle": "string",
    "jobUrl": "string | null",
    "sectionTitles": {
      "summary": "Translated 'Professional Summary'",
      "skills": "Translated 'Skills'",
      "experience": "Translated 'Experience'",
      "education": "Translated 'Education'",
      "certifications": "Translated 'Certifications'",
      "openSource": "Translated 'Open Source'"
    }
  },
  "candidate": {
    "fullName": "string",
    "title": "string",
    "contactInfo": {
      "email": "string | null",
      "phone": "string | null",
      "linkedin": "string | null",
      "github": "string | null",
      "location": "string | null"
    },
    "summary": "string (max 4 sentences)"
  },
  "techStack": {
    "languages": ["string"],
    "frameworks": ["string"],
    "infrastructure": ["string"],
    "databases": ["string"]
  },
  "experience": [
    {
      "companyName": "string",
      "companyUrl": "string | null",
      "role": "string",
      "startDate": "YYYY-MM or present",
      "endDate": "YYYY-MM or present",
      "location": "string | null",
      "employmentType": "B2B | UoP | Contract | Freelance | null",
      "projects": [
        {
          "projectName": "string",
          "projectScope": "string (1 sentence)",
          "techUsed": ["string"],
          "achievements": [
            {
              "formula": "Achieved X, measured by Y, by doing Z",
              "impact": "performance | quality | cost | scalability | security | dx",
              "metric": "short metric string e.g. -65% latency"
            }
          ]
        }
      ]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduationYear": "integer | null",
      "relevant_coursework": ["string"] 
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "year": "integer | null",
      "credentialUrl": "string | null"
    }
  ],
  "openSource": [
    {
      "projectName": "string",
      "repoUrl": "string | null",
      "description": "string",
      "techUsed": ["string"]
    }
  ],
  "matchReport": {
    "matchPercentage": "integer 0-100",
    "matchedKeywords": ["string"],
    "missingKeywords": ["string"],
    "advice": ["string (actionable, specific)"],
    "atsWarnings": ["string"]
  }
}
"""


@retry(
    retry=retry_if_exception_type(Exception),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=8),
    before_sleep=lambda rs: logger.warning(
        "Groq call failed (attempt %d), retrying...", rs.attempt_number
    ),
)
async def run_refactor(
    raw_cv_text: str,
    company_name: str,
    job_title: str,
    job_url: Optional[str],
    job_description: str,
) -> RefactorResponse:
    """
    Calls Groq API with the REFACTORI ENGINE system prompt.
    Returns a validated RefactorResponse Pydantic model.
    """
    settings = get_settings()
    client = AsyncGroq(api_key=settings.groq_api_key)

    user_prompt = build_user_prompt(
        raw_cv_text=raw_cv_text,
        company_name=company_name,
        job_title=job_title,
        job_url=job_url,
        job_description=job_description,
        json_schema=_JSON_SCHEMA_HINT,
    )

    logger.info(
        "Starting REFACTORI refactor — company='%s', job='%s', cv_length=%d chars",
        company_name, job_title, len(raw_cv_text),
    )

    completion = await client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.6,
        max_tokens=4000,
        top_p=1,
        response_format={"type": "json_object"},  # JSON format required for parsing
    )

    raw_json = completion.choices[0].message.content
    logger.info("Groq response received (%d chars)", len(raw_json or ""))

    if not raw_json:
        raise ValueError("Groq returned empty response")

    # Parse and validate against Pydantic schema
    try:
        data: dict[str, Any] = json.loads(raw_json)
        response = RefactorResponse.model_validate(data)
        logger.info(
            "Refactor validated — match=%d%%, missing=%d keywords",
            response.matchReport.matchPercentage,
            len(response.matchReport.missingKeywords),
        )
        return response
    except Exception as exc:
        logger.error("Groq response failed Pydantic validation: %s", exc)
        logger.debug("Raw Groq output: %s", raw_json[:2000])
        raise ValueError(f"AI response did not match expected schema: {exc}") from exc
