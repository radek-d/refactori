"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "hsl(222 47% 5%)" }}>
        <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(250 84% 67% / 0.15) 0%, transparent 60%)" }} />

        <div style={{ width: "100%", maxWidth: "420px", background: "hsl(222 40% 8% / 0.7)", backdropFilter: "blur(16px)", border: "1px solid hsl(222 25% 20%)", borderRadius: "1rem", padding: "2.5rem", textAlign: "center" }}>
          <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "hsl(142 70% 45% / 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <Zap style={{ width: "1.75rem", height: "1.75rem", color: "hsl(142 70% 45%)" }} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem", color: "hsl(210 20% 94%)" }}>Check your inbox</h2>
          <p style={{ fontSize: "0.875rem", lineHeight: "1.5", color: "hsl(210 15% 55%)" }}>
            We sent a confirmation link to <strong style={{ color: "hsl(210 20% 94%)" }}>{email}</strong>. Click it to activate your Refactori account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "hsl(222 47% 5%)" }}>
      <div style={{ position: "fixed", inset: 0, zIndex: -1, background: "radial-gradient(ellipse 60% 50% at 50% 0%, hsl(250 84% 67% / 0.15) 0%, transparent 60%)" }} />

      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem", background: "hsl(250 84% 67%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: "700", fontSize: "1rem" }}>R</span>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "hsl(210 20% 94%)" }}>Refactori</span>
        </div>

        <div style={{ background: "hsl(222 40% 8% / 0.7)", backdropFilter: "blur(16px)", border: "1px solid hsl(222 25% 20%)", borderRadius: "1rem", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", textAlign: "center", marginBottom: "0.25rem", color: "hsl(210 20% 94%)" }}>Create account</h1>
          <p style={{ fontSize: "0.875rem", textAlign: "center", marginBottom: "1.75rem", color: "hsl(210 15% 55%)" }}>
            Free forever · No credit card required
          </p>

          {error && (
            <div style={{ marginBottom: "1.25rem", padding: "0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem", background: "hsl(4 86% 58% / 0.1)", border: "1px solid hsl(4 86% 58% / 0.3)", color: "hsl(4 86% 58%)" }}>
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            id="google-register-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.625rem",
              padding: "0.75rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: "600",
              marginBottom: "1.25rem", cursor: "pointer", transition: "all 0.15s ease",
              background: "hsl(210 20% 94%)", color: "hsl(222 47% 8%)",
              border: "none", opacity: googleLoading || loading ? 0.6 : 1,
            }}
          >
            {googleLoading ? (
              <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Sign up with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ flex: 1, height: "1px", background: "hsl(222 25% 20%)" }} />
            <span style={{ fontSize: "0.75rem", color: "hsl(210 12% 38%)" }}>or sign up with email</span>
            <div style={{ flex: 1, height: "1px", background: "hsl(222 25% 20%)" }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.375rem", color: "hsl(210 15% 55%)" }}>
                Email
              </label>
              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: "100%", padding: "0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem",
                  outline: "none", background: "hsl(222 35% 12%)", border: "1px solid hsl(222 25% 20%)",
                  color: "hsl(210 20% 94%)", boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.375rem", color: "hsl(210 15% 55%)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="register-password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  style={{
                    width: "100%", padding: "0.75rem 2.75rem 0.75rem 1rem", borderRadius: "0.5rem", fontSize: "0.875rem",
                    outline: "none", background: "hsl(222 35% 12%)", border: "1px solid hsl(222 25% 20%)",
                    color: "hsl(210 20% 94%)", boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "hsl(210 12% 38%)", padding: 0 }}
                >
                  {showPw ? <EyeOff style={{ width: "1rem", height: "1rem" }} /> : <Eye style={{ width: "1rem", height: "1rem" }} />}
                </button>
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading || googleLoading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                padding: "0.75rem", borderRadius: "0.5rem", fontWeight: "600", fontSize: "0.875rem",
                background: "hsl(250 84% 67%)", color: "white", border: "none", cursor: "pointer",
                opacity: loading || googleLoading ? 0.6 : 1, transition: "all 0.15s ease",
              }}
            >
              {loading && <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />}
              {loading ? "Creating account…" : "Create free account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.875rem", marginTop: "1.5rem", color: "hsl(210 15% 55%)" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ fontWeight: "600", color: "hsl(250 84% 67%)", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
