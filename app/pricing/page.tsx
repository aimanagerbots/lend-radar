"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

const tiers = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for individual DeFi users exploring yield opportunities.",
    features: [
      "Live rates across 5 protocols",
      "Basic rate comparison table",
      "Single chain support",
      "24h historical data",
      "Community Discord access",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 29,
    annualPrice: 23,
    description: "For power users and active yield farmers who need an edge.",
    features: [
      "Live rates across 50+ protocols",
      "Multi-chain support (8 chains)",
      "30-day historical data & charts",
      "APY alerts & notifications",
      "Auto-rebalance suggestions",
      "Portfolio tracking dashboard",
      "API access (10k req/mo)",
      "Risk scoring & analytics",
      "Export reports (CSV & PDF)",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Institutional",
    monthlyPrice: -1,
    annualPrice: -1,
    description: "For DAOs, treasuries, and funds managing significant capital.",
    features: [
      "Everything in Pro",
      "Unlimited API access",
      "Treasury console & multi-sig",
      "Custom risk policies",
      "Auto-rebalance execution",
      "Dedicated account manager",
      "SLA & priority support",
      "Custom integrations",
      "Audit trail & compliance",
      "White-label options",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in-up delay-1">
          <h1 className="text-3xl font-bold text-zinc-100">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Annual Toggle */}
        <div className="mb-10 flex items-center justify-center gap-3 animate-fade-in-up delay-2">
          <span
            className={`text-sm font-medium ${!annual ? "text-zinc-100" : "text-zinc-500"}`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
              annual ? "bg-emerald-500" : "bg-zinc-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${annual ? "text-zinc-100" : "text-zinc-500"}`}
          >
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              Save 20%
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <Card
              key={tier.name}
              className={`animate-fade-in-up delay-${i + 3} flex flex-col border-zinc-800 bg-zinc-900 p-6 ${
                tier.highlighted
                  ? "ring-2 ring-emerald-500 border-emerald-500/50"
                  : ""
              }`}
            >
              {tier.highlighted && (
                <div className="mb-4 -mt-1 text-center">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-950">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-zinc-100">{tier.name}</h3>
              <p className="mt-1 text-xs text-zinc-500">{tier.description}</p>

              <div className="mt-5 mb-6">
                {tier.monthlyPrice === -1 ? (
                  <span className="text-3xl font-bold font-mono text-zinc-100">Custom</span>
                ) : tier.monthlyPrice === 0 ? (
                  <>
                    <span className="text-3xl font-bold font-mono text-zinc-100">$0</span>
                    <span className="text-sm text-zinc-500">/mo</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold font-mono text-emerald-500">
                      ${annual ? tier.annualPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-sm text-zinc-500">/mo</span>
                    {annual && tier.monthlyPrice > 0 && (
                      <span className="ml-2 text-xs text-zinc-600 line-through">
                        ${tier.monthlyPrice}
                      </span>
                    )}
                  </>
                )}
              </div>

              <ul className="mb-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  tier.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "border border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
                }`}
              >
                {tier.cta}
              </button>
            </Card>
          ))}
        </div>

        {/* FAQ or Note */}
        <div className="mt-12 text-center animate-fade-in-up delay-5">
          <p className="text-xs text-zinc-600">
            All plans include access to the LendRadar community. Prices shown in USD.
            <br />
            Institutional plans require KYB verification. Contact sales for volume discounts.
          </p>
        </div>
      </div>
    </div>
  );
}
