from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
import hmac
import hashlib
import json
import logging
from typing import Optional

from app.core.dependencies import verify_api_secret
from app.core.config import get_settings
from app.services import supabase_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get(
    "/credits",
    summary="Get user credit balance",
    dependencies=[Depends(verify_api_secret)],
)
async def get_credits(user_id: str):
    """Returns the current credit balance of the user."""
    try:
        credits = await supabase_service.get_user_credits(user_id)
        return {"credits": credits}
    except Exception as e:
        logger.error("Error fetching credits: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch credit balance."
        )


@router.post(
    "/webhook",
    summary="Lemon Squeezy Webhook handler",
)
async def lemonsqueezy_webhook(request: Request, x_signature: Optional[str] = Header(None)):
    """
    Handles Lemon Squeezy order_created webhook events and adds credits.
    Verifies signature using HMAC SHA256.
    """
    settings = get_settings()
    
    # Read raw body
    body = await request.body()
    
    # Verify signature if webhook secret is configured
    if settings.lemonsqueezy_webhook_secret:
        if not x_signature:
            logger.warning("Missing X-Signature header on webhook")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing signature"
            )
            
        digest = hmac.new(
            settings.lemonsqueezy_webhook_secret.encode("utf-8"),
            body,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(digest, x_signature):
            logger.warning("Invalid webhook signature")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid signature"
            )
            
    try:
        payload = json.loads(body)
    except Exception as e:
        logger.error("Failed to parse webhook JSON: %s", e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload"
        )
        
    meta = payload.get("meta", {})
    event_name = meta.get("event_name")
    
    if event_name == "order_created":
        data = payload.get("data", {})
        attributes = data.get("attributes", {})
        custom_data = meta.get("custom_data", {}) or attributes.get("custom_data", {})
        
        # Extract user_id from custom_data
        user_id = custom_data.get("user_id") if isinstance(custom_data, dict) else None
        if not user_id:
            # Fallback to checking attributes just in case
            user_id = attributes.get("custom_data", {}).get("user_id") if isinstance(attributes.get("custom_data"), dict) else None
            
        if not user_id:
            logger.error("Webhook payload missing user_id in custom_data: %s", payload)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing user_id in custom_data"
            )
            
        order_number = attributes.get("order_number")
        
        # Extract credit quantity or fall back to 5
        credits_to_add = 5
        if isinstance(custom_data, dict) and "credits" in custom_data:
            try:
                credits_to_add = int(custom_data["credits"])
            except ValueError:
                pass
                
        payment_ref = f"lemonsqueezy-order-{order_number}"
        
        logger.info("Processing webhook order_created for user=%s, credits=%d", user_id, credits_to_add)
        
        await supabase_service.add_credits(
            user_id=user_id,
            amount=credits_to_add,
            payment_ref=payment_ref
        )
        
        return {"status": "success", "credits_added": credits_to_add}
        
    return {"status": "ignored_event", "event": event_name}
