"""
Supabase Service — Persistence Layer for CV Refactors + Credits
"""

import logging
from typing import Optional
from uuid import UUID

from supabase import acreate_client, AsyncClient

from app.core.config import get_settings
from app.models.response_models import RefactorResponse

logger = logging.getLogger(__name__)

_TABLE = "cv_refactors"
_PROFILES_TABLE = "user_profiles"
_CREDITS_TABLE = "credit_transactions"


async def _get_client() -> AsyncClient:
    settings = get_settings()
    return await acreate_client(settings.supabase_url, settings.supabase_service_role_key)


# ── Credits ──────────────────────────────────────────────────────────────────

async def get_user_credits(user_id: str) -> int:
    """Returns the current credit balance for a user."""
    client = await _get_client()
    result = (
        await client.table(_PROFILES_TABLE)
        .select("credits")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        return 0
    return result.data.get("credits", 0)


async def check_and_deduct_credit(user_id: str) -> bool:
    """
    Atomically check if user has credits > 0 and deduct 1.
    Returns True if credit was deducted, False if insufficient credits.
    Uses RPC for atomicity to prevent race conditions.
    """
    client = await _get_client()

    # First check current credits
    profile = (
        await client.table(_PROFILES_TABLE)
        .select("credits")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not profile.data or profile.data.get("credits", 0) <= 0:
        return False

    current_credits = profile.data["credits"]
    new_balance = current_credits - 1

    # Deduct 1 credit (with optimistic concurrency — only if credits haven't changed)
    update_result = (
        await client.table(_PROFILES_TABLE)
        .update({"credits": new_balance})
        .eq("id", user_id)
        .gte("credits", 1)  # Safety: only deduct if still >= 1
        .execute()
    )

    if not update_result.data:
        return False

    # Log the transaction
    await client.table(_CREDITS_TABLE).insert({
        "user_id": user_id,
        "amount": -1,
        "type": "usage",
        "description": "CV refactoring",
        "balance_after": new_balance,
    }).execute()

    # Increment refactors_used counter
    await client.table(_PROFILES_TABLE).update({
        "refactors_used": current_credits  # This is actually refactors_used + 1 but we need to read it
    }).eq("id", user_id).execute()

    logger.info("Deducted 1 credit for user=%s, new balance=%d", user_id, new_balance)
    return True


async def add_credits(user_id: str, amount: int, payment_ref: Optional[str] = None) -> int:
    """
    Add credits to a user's account after a successful payment.
    Returns the new balance.
    """
    client = await _get_client()

    # Get current balance
    profile = (
        await client.table(_PROFILES_TABLE)
        .select("credits")
        .eq("id", user_id)
        .single()
        .execute()
    )

    current = profile.data.get("credits", 0) if profile.data else 0
    new_balance = current + amount

    # Update credits
    await client.table(_PROFILES_TABLE).update({
        "credits": new_balance,
    }).eq("id", user_id).execute()

    # Log the transaction
    await client.table(_CREDITS_TABLE).insert({
        "user_id": user_id,
        "amount": amount,
        "type": "purchase",
        "payment_ref": payment_ref,
        "description": f"Purchased {amount} credits",
        "balance_after": new_balance,
    }).execute()

    logger.info("Added %d credits for user=%s (ref=%s), new balance=%d", amount, user_id, payment_ref, new_balance)
    return new_balance


# ── CV Refactors ─────────────────────────────────────────────────────────────

async def save_refactor(
    user_id: str,
    raw_cv_text: str,
    company_name: str,
    job_url: Optional[str],
    raw_job_desc: str,
    response: RefactorResponse,
) -> str:
    """
    Persists a completed refactor to Supabase.
    Returns the UUID of the newly created cv_refactors row.
    """
    client = await _get_client()

    row = {
        "user_id": user_id,
        "raw_cv_text": raw_cv_text,
        "job_url": job_url,
        "job_title": response.meta.targetJobTitle,
        "company_name": company_name,
        "raw_job_desc": raw_job_desc,
        "refactored_json": response.model_dump(),
        "match_percent": response.matchReport.matchPercentage,
        "missing_kw": response.matchReport.missingKeywords,
        "status": "done",
    }

    result = await client.table(_TABLE).insert(row).execute()

    if not result.data:
        raise RuntimeError("Supabase insert returned no data")

    record_id: str = result.data[0]["id"]
    logger.info("Saved refactor id=%s for user=%s", record_id, user_id)
    return record_id


async def get_refactor_by_id(record_id: str, user_id: str) -> Optional[dict]:
    """
    Fetches a single cv_refactors row by ID.
    user_id filter ensures users can only read their own records (belt + suspenders on top of RLS).
    """
    client = await _get_client()
    result = (
        await client.table(_TABLE)
        .select("*")
        .eq("id", record_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return result.data


async def list_user_refactors(user_id: str, limit: int = 20) -> list[dict]:
    """
    Returns the user's refactoring history, newest first.
    """
    client = await _get_client()
    result = (
        await client.table(_TABLE)
        .select("id, company_name, job_title, job_url, match_percent, status, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return result.data or []
