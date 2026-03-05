"use client";

import { useState } from "react";
import { mockOpportunities } from "@/lib/mock/opportunities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ArrowRight, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

const typeBadge: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  rate_improvement: {
    label: "Rate Improvement",
    color: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
  },
  risk_alert: {
    label: "Risk Alert",
    color: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
  },
  new_opportunity: {
    label: "New Opportunity",
    color: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
    icon: <Sparkles className="h-3.5 w-3.5" />,
  },
};

const severityColor: Record<string, string> = {
  high: "text-red-400",
  medium: "text-amber-400",
  low: "text-zinc-400",
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "rate_improvement", label: "Rate Improvements" },
  { key: "risk_alert", label: "Risk Alerts" },
  { key: "new_opportunity", label: "New Opportunities" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

export default function OpportunitiesPage() {
  const [activeTab, setActiveTab] = useState<FilterKey>("all");

  const filteredOpportunities =
    activeTab === "all"
      ? mockOpportunities
      : mockOpportunities.filter((opp) => opp.type === activeTab);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
            Opportunities
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            AI-generated recommendations to optimize your DeFi lending positions.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="animate-fade-in-up mb-6 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 font-mono text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
                  : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Opportunity Cards */}
        <div className="space-y-4">
          {filteredOpportunities.length === 0 ? (
            <Card className="border-zinc-800 bg-zinc-900 p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Sparkles className="h-8 w-8 text-zinc-600" />
                <p className="mt-3 font-mono text-sm font-semibold text-zinc-300">
                  No opportunities found
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  No matching opportunities for this filter. Try selecting a different tab.
                </p>
              </div>
            </Card>
          ) : (
            filteredOpportunities.map((opp, idx) => {
              const badge = typeBadge[opp.type] || typeBadge.new_opportunity;
              return (
                <div
                  key={opp.id}
                  className={`animate-fade-in-up delay-${idx + 1}`}
                >
                  <Card className="border-zinc-800 bg-zinc-900">
                    <CardHeader>
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${badge.color}`}
                        >
                          {badge.icon}
                          {badge.label}
                        </span>
                        <span
                          className={`font-mono text-xs font-semibold uppercase ${severityColor[opp.severity]}`}
                        >
                          {opp.severity} severity
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-zinc-600">
                          {new Date(opp.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <CardTitle className="mt-2 font-mono text-lg text-zinc-100">
                        {opp.asset}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Current vs Suggested */}
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        {opp.currentProtocol ? (
                          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                              Current
                            </p>
                            <p className="font-mono text-sm text-zinc-300">
                              {opp.currentProtocol}
                            </p>
                            <p className="font-mono text-xs text-zinc-500">
                              {opp.currentChain}
                            </p>
                            <p className="mt-1 font-mono text-lg font-bold text-zinc-400">
                              {opp.currentAPY?.toFixed(2)}%
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                              Current
                            </p>
                            <p className="font-mono text-sm text-zinc-500">
                              No position
                            </p>
                          </div>
                        )}

                        <ArrowRight className="h-5 w-5 text-zinc-600" />

                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-emerald-500/70">
                            Suggested
                          </p>
                          <p className="font-mono text-sm text-emerald-300">
                            {opp.suggestedProtocol}
                          </p>
                          <p className="font-mono text-xs text-emerald-500/60">
                            {opp.suggestedChain}
                          </p>
                          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                            {opp.suggestedAPY.toFixed(2)}%
                          </p>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                          <RiskBadge score={opp.riskScore} size="md" />
                        </div>
                      </div>

                      {/* Metrics Row */}
                      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {opp.estimatedAnnualGain !== null && (
                          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                              Est. Annual Gain
                            </p>
                            <p
                              className={`font-mono text-sm font-bold ${
                                opp.estimatedAnnualGain >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {opp.estimatedAnnualGain >= 0 ? "+" : ""}$
                              {opp.estimatedAnnualGain.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                        )}
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Confidence
                          </p>
                          <p className="font-mono text-sm font-bold text-zinc-200">
                            {(opp.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Gas Cost
                          </p>
                          <p className="font-mono text-sm text-zinc-400">
                            ${opp.estimatedGasCost.toFixed(2)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Bridge Cost
                          </p>
                          <p className="font-mono text-sm text-zinc-400">
                            ${opp.estimatedBridgeCost.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">
                          Reasoning
                        </p>
                        <p className="text-sm leading-relaxed text-zinc-400">
                          {opp.reasoning}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
