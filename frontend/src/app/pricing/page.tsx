"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Zap, Check, ArrowLeft, Loader2 } from "lucide-react";

// Lemon Squeezy checkout URLs (variant IDs)
// User can configure these in .env or update them directly
const CHECKOUT_PACK_5 = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_5 ?? "https://refactori.lemonsqueezy.com/buy/variant_starter";
const CHECKOUT_PACK_15 = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_15 ?? "https://refactori.lemonsqueezy.com/buy/variant_pro";
const CHECKOUT_PACK_50 = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_50 ?? "https://refactori.lemonsqueezy.com/buy/variant_ultimate";

export default function PricingPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const getCheckoutLink = (baseCheckoutUrl: string, credits: number) => {
    if (!user) return "/login?next=/pricing";
    
    const url = new URL(baseCheckoutUrl);
    // Pass user_id and credit quantity as custom parameters to Lemon Squeezy
    url.searchParams.set("checkout[custom][user_id]", user.id);
    url.searchParams.set("checkout[custom][credits]", credits.toString());
    
    // Auto-fill user email in checkout
    if (user.email) {
      url.searchParams.set("checkout[email]", user.email);
    }
    
    return url.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "hsl(var(--color-brand))" }} />
      </div>
    );
  }

  const tiers = [
    {
      name: "Starter Pack",
      credits: 5,
      price: "29 PLN",
      desc: "Perfect for editing a few resumes for specific job listings.",
      features: [
        "5 CV refactor credits",
        "Full ATS optimization",
        "X-Y-Z achievement optimization",
        "Groq Llama-3.3 AI engine",
        "Downloadable PDF format"
      ],
      link: getCheckoutLink(CHECKOUT_PACK_5, 5),
      popular: false,
    },
    {
      name: "Pro Pack",
      credits: 15,
      price: "69 PLN",
      desc: "Ideal for active candidates applying to multiple positions.",
      features: [
        "15 CV refactor credits",
        "Full ATS optimization",
        "X-Y-Z achievement optimization",
        "Groq Llama-3.3 AI engine",
        "Downloadable PDF format",
        "Priority AI scraping speed"
      ],
      link: getCheckoutLink(CHECKOUT_PACK_15, 15),
      popular: true,
    },
    {
      name: "Ultimate Pack",
      credits: 50,
      price: "149 PLN",
      desc: "For maximum flexibility and massive application pipelines.",
      features: [
        "50 CV refactor credits",
        "Full ATS optimization",
        "X-Y-Z achievement optimization",
        "Groq Llama-3.3 AI engine",
        "Downloadable PDF format",
        "Priority AI scraping speed",
        "Lifetime history access"
      ],
      link: getCheckoutLink(CHECKOUT_PACK_50, 50),
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      {/* Background decoration */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse 70% 30% at 50% 0%, hsl(250 84% 67% / 0.1) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: "hsl(var(--color-text-muted))" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get <span className="gradient-text">Refactori Credits</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--color-text-muted))" }}>
            Every resume refactor uses 1 credit. Buy credit packs as you need them. No subscriptions, no hidden fees.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass flex flex-col justify-between p-8 relative transition-all duration-300 hover:scale-[1.01] ${
                tier.popular
                  ? "border-2 animate-pulse-glow"
                  : ""
              }`}
              style={{
                borderColor: tier.popular ? "hsl(var(--color-brand))" : undefined,
                background: tier.popular ? "hsl(var(--color-surface) / 0.85)" : undefined,
              }}
            >
              {tier.popular && (
                <span
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-white shadow-lg"
                  style={{ background: "hsl(var(--color-brand))" }}
                >
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-center mb-1" style={{ color: "hsl(var(--color-text))" }}>
                  {tier.name}
                </h3>
                <p className="text-xs text-center mb-6" style={{ color: "hsl(var(--color-text-muted))" }}>
                  {tier.desc}
                </p>

                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-1">
                    <Zap className="w-6 h-6 fill-current" style={{ color: "hsl(var(--color-amber))" }} />
                    <span className="text-4xl font-extrabold font-mono">{tier.credits}</span>
                  </div>
                  <span className="text-xs uppercase font-semibold" style={{ color: "hsl(var(--color-text-subtle))" }}>
                    refactor credits
                  </span>
                  <div className="mt-4 text-3xl font-bold">{tier.price}</div>
                  <span className="text-xs" style={{ color: "hsl(var(--color-text-muted))" }}>
                    one-time purchase
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "hsl(var(--color-brand))" }} />
                      <span style={{ color: "hsl(var(--color-text-muted))" }}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={tier.link}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                style={{
                  background: tier.popular ? "hsl(var(--color-brand))" : "hsl(var(--color-surface-2))",
                  color: "white",
                  border: tier.popular ? "none" : "1px solid hsl(var(--color-border))",
                }}
              >
                <span>Purchase Pack</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-xs" style={{ color: "hsl(var(--color-text-subtle))" }}>
          Secure payment processing by Lemon Squeezy. No business setup required. VAT and invoices are handled automatically.
        </div>
      </div>
    </div>
  );
}
