-- ============================================================
-- REFACTORI — Migration 0002: Credits System
-- Run via: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Add credits column to user_profiles ──────────────────────────────────────
ALTER TABLE public.user_profiles
    ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 1;

-- ── Update the new-user trigger to set credits = 1 ──────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, avatar_url, credits)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'avatar_url',
        1  -- 1 free credit on signup
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- ── Credit transactions log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- +N for purchase, -1 for usage
    amount          INTEGER NOT NULL,
    type            TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),

    -- Payment reference (Lemon Squeezy order ID)
    payment_ref     TEXT,
    description     TEXT,

    -- Balance after this transaction
    balance_after   INTEGER NOT NULL,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_transactions_user
    ON public.credit_transactions(user_id, created_at DESC);

-- ── RLS for credit_transactions ─────────────────────────────────────────────
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credit transactions"
    ON public.credit_transactions
    FOR SELECT
    USING (auth.uid() = user_id);

-- Only the service role can insert credit transactions (backend-only writes)
-- No INSERT/UPDATE/DELETE policy for regular users

-- ── Grant existing users 1 free credit if they have 0 ──────────────────────
UPDATE public.user_profiles
SET credits = 1
WHERE credits = 0 AND refactors_used = 0;
