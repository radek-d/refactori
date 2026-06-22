-- ============================================================
-- REFACTORI — Supabase PostgreSQL Schema
-- Run via: Supabase Dashboard > SQL Editor
-- or: supabase db push
-- ============================================================

-- ── cv_refactors ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cv_refactors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Input data
    raw_cv_text     TEXT        NOT NULL,
    job_url         TEXT,
    job_title       TEXT,
    company_name    TEXT        NOT NULL,
    raw_job_desc    TEXT,

    -- Refactoring result (full JSON contract)
    refactored_json JSONB       NOT NULL,

    -- Denormalized fields for fast dashboard queries
    match_percent   SMALLINT    CHECK (match_percent BETWEEN 0 AND 100),
    missing_kw      TEXT[]      DEFAULT '{}',

    -- Versioning (allows re-refactoring same CV for same job)
    version         SMALLINT    NOT NULL DEFAULT 1,
    status          TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','processing','done','error')),

    -- Audit
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cv_refactors_user_created
    ON public.cv_refactors(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cv_refactors_company
    ON public.cv_refactors(user_id, company_name);

CREATE INDEX IF NOT EXISTS idx_cv_refactors_status
    ON public.cv_refactors(status)
    WHERE status IN ('pending', 'processing');

-- GIN index for fast JSONB keyword searches
CREATE INDEX IF NOT EXISTS idx_cv_refactors_json
    ON public.cv_refactors USING GIN (refactored_json);

-- ── Auto-update trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cv_refactors_updated_at ON public.cv_refactors;
CREATE TRIGGER trg_cv_refactors_updated_at
    BEFORE UPDATE ON public.cv_refactors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.cv_refactors ENABLE ROW LEVEL SECURITY;

-- Users can only access their own refactor records
CREATE POLICY "Users manage own refactors"
    ON public.cv_refactors
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ── user_profiles (optional — for future plan/usage tracking) ────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name    TEXT,
    avatar_url      TEXT,
    plan            TEXT    NOT NULL DEFAULT 'free'
                            CHECK (plan IN ('free', 'pro', 'team')),
    refactors_used  INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile"
    ON public.user_profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data ->> 'full_name',
        NEW.raw_user_meta_data ->> 'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
