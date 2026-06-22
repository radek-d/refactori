"""
Refactor Router — POST /refactor

Accepts:
  - cv_text (form field) OR cv_file (PDF/DOCX upload)
  - job_url (optional, auto-scraped) OR job_description (manual fallback)
  - company_name, user_id
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.core.dependencies import verify_api_secret
from app.models.response_models import RefactorAPIResponse, RefactorResponse
from app.services import groq_service, scraper_service, supabase_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/refactor", tags=["refactor"])

_ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}
_MAX_CV_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post(
    "",
    response_model=RefactorAPIResponse,
    summary="Refactor a CV for a specific job posting",
    dependencies=[Depends(verify_api_secret)],
)
async def refactor_cv(
    # ─── CV input (one of two) ───────────────────────────────
    cv_text: Optional[str] = Form(None, description="Plain text CV (paste)"),
    cv_file: Optional[UploadFile] = File(None, description="CV file: PDF or DOCX"),
    # ─── Job posting (auto-scraped or manual) ────────────────
    job_url: Optional[str] = Form(None, description="Job posting URL to auto-scrape"),
    job_description: Optional[str] = Form(None, description="Manual job description fallback"),
    # ─── Required metadata ───────────────────────────────────
    company_name: str = Form(..., min_length=1, max_length=200),
    job_title: str = Form(..., min_length=1, max_length=200),
    user_id: str = Form(..., description="Supabase auth user UUID"),
):
    # ── 1. Resolve CV text ────────────────────────────────────────────────────
    raw_cv_text = await _resolve_cv_text(cv_text, cv_file)

    # ── 2. Resolve job description ────────────────────────────────────────────
    resolved_job_desc = await _resolve_job_description(job_url, job_description)

    if not resolved_job_desc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Job description is required. Provide job_url or job_description.",
        )

    # ── 3. Check and deduct credit ────────────────────────────────────────────
    has_credit = await supabase_service.check_and_deduct_credit(user_id)
    if not has_credit:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="No credits remaining. Purchase more credits to continue refactoring.",
        )

    # ── 4. Run REFACTORI ENGINE via Groq ──────────────────────────────────────
    try:
        refactored: RefactorResponse = await groq_service.run_refactor(
            raw_cv_text=raw_cv_text,
            company_name=company_name,
            job_title=job_title,
            job_url=job_url,
            job_description=resolved_job_desc,
        )
    except Exception as exc:
        logger.error("Groq refactor error: %s", exc)
        # Refund the credit on ANY AI failure (rate limit, auth error, etc.)
        try:
            await supabase_service.add_credits(user_id, 1, payment_ref="refund-ai-failure")
            logger.info("Refunded 1 credit to user=%s due to AI failure", user_id)
        except Exception as refund_exc:
            logger.error("Failed to refund credit: %s", refund_exc)

        exc_to_check = exc
        import tenacity
        if isinstance(exc, tenacity.RetryError):
            exc_to_check = exc.last_attempt.exception() if exc.last_attempt else exc

        exc_str = str(exc_to_check)
        if "413" in exc_str or "Payload Too Large" in exc_str or "tokens" in exc_str.lower():
            detail = "Your CV or job description is too long. Please shorten your CV to the most relevant experience and try again."
        elif "401" in exc_str or "Invalid API Key" in exc_str:
            detail = "AI service configuration error. Please contact support."
        elif "429" in exc_str or "rate_limit" in exc_str.lower():
            detail = "AI service is temporarily overloaded. Please wait 60 seconds and try again."
        else:
            detail = f"AI refactoring failed. Please try again."

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=detail,
        )

    # ── 5. Persist to Supabase ────────────────────────────────────────────────
    try:
        record_id = await supabase_service.save_refactor(
            user_id=user_id,
            raw_cv_text=raw_cv_text,
            company_name=company_name,
            job_url=job_url,
            raw_job_desc=resolved_job_desc,
            response=refactored,
        )
    except Exception as exc:
        logger.error("Supabase save error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save refactoring result.",
        )

    return RefactorAPIResponse(refactorId=record_id, data=refactored)


@router.get(
    "/history",
    summary="List user refactoring history",
    dependencies=[Depends(verify_api_secret)],
)
async def list_history(user_id: str, limit: int = 20):
    records = await supabase_service.list_user_refactors(user_id, limit)
    return {"items": records}


@router.get(
    "/{refactor_id}",
    response_model=RefactorAPIResponse,
    summary="Get a saved refactor by ID",
    dependencies=[Depends(verify_api_secret)],
)
async def get_refactor(refactor_id: str, user_id: str):
    record = await supabase_service.get_refactor_by_id(refactor_id, user_id)
    if not record:
        raise HTTPException(status_code=404, detail="Refactor not found.")
    return RefactorAPIResponse(
        refactorId=record["id"],
        data=RefactorResponse.model_validate(record["refactored_json"]),
    )


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _resolve_cv_text(
    cv_text: Optional[str],
    cv_file: Optional[UploadFile],
) -> str:
    if cv_text and cv_text.strip():
        return cv_text.strip()

    if cv_file:
        if cv_file.content_type not in _ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported file type '{cv_file.content_type}'. Use PDF, DOCX, or TXT.",
            )
        file_bytes = await cv_file.read()
        if len(file_bytes) > _MAX_CV_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="CV file must be smaller than 5 MB.",
            )

        if cv_file.content_type == "application/pdf":
            return scraper_service.extract_text_from_pdf(file_bytes)
        elif "wordprocessingml" in (cv_file.content_type or ""):
            return scraper_service.extract_text_from_docx(file_bytes)
        else:
            return file_bytes.decode("utf-8", errors="replace")

    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="CV text or file is required.",
    )


async def _resolve_job_description(
    job_url: Optional[str],
    manual_desc: Optional[str],
) -> Optional[str]:
    if job_url:
        scraped = await scraper_service.scrape_job_url(job_url)
        if scraped and len(scraped) > 100:
            logger.info("Using scraped job description (%d chars)", len(scraped))
            return scraped
        logger.warning("Scraping failed or returned too little text — falling back to manual")

    if manual_desc and manual_desc.strip():
        return manual_desc.strip()

    return None
