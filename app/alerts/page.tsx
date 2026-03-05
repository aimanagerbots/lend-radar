"use client";

import { mockAlerts } from "@/lib/mock/alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  BarChart3,
  Zap,
  Bell,
  Plus,
} from "lucide-react";

const typeConfig: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  rate_drop: {
    label: "Rate Drop",
    icon: <TrendingDown className="h-5 w-5" />,
    color: "text-red-400 bg-red-500/10",
  },
  rate_spike: {
    label: "Rate Spike",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-emerald-400 bg-emerald-500/10",
  },
  tvl_drop: {
    label: "TVL Drop",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-amber-400 bg-amber-500/10",
  },
  new_opportunity: {
    label: "New Opportunity",
    icon: <Zap className="h-5 w-5" />,
    color: "text-blue-400 bg-blue-500/10",
  },
};

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
              Alerts
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Configure notifications for rate changes, TVL drops, and new opportunities.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-mono text-sm font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20">
            <Plus className="h-4 w-4" />
            Create Alert
          </button>
        </div>

        {/* Alert Cards */}
        <div className="space-y-4">
          {mockAlerts.map((alert, idx) => {
            const config = typeConfig[alert.type] || typeConfig.new_opportunity;

            return (
              <div
                key={alert.id}
                className={`animate-fade-in-up delay-${idx + 1}`}
              >
                <Card
                  className={`border-zinc-800 bg-zinc-900 transition-opacity ${
                    !alert.active ? "opacity-50" : ""
                  }`}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.color}`}
                      >
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs font-semibold text-zinc-300">
                            {config.label}
                          </span>
                          {/* Active/Inactive badge */}
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              alert.active
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-zinc-700/50 text-zinc-500"
                            }`}
                          >
                            {alert.active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="text-sm text-zinc-200 mb-2">
                          {alert.condition}
                        </p>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                          {alert.protocol && (
                            <span>
                              Protocol:{" "}
                              <span className="text-zinc-400">{alert.protocol}</span>
                            </span>
                          )}
                          {alert.chain && (
                            <span>
                              Chain:{" "}
                              <span className="text-zinc-400">{alert.chain}</span>
                            </span>
                          )}
                          {alert.asset && (
                            <span>
                              Asset:{" "}
                              <span className="font-mono text-zinc-400">
                                {alert.asset}
                              </span>
                            </span>
                          )}
                          <span>
                            Channel:{" "}
                            <span className="text-zinc-400 capitalize">
                              {alert.channel}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Right side stats */}
                      <div className="shrink-0 text-right">
                        <div className="mb-1">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Triggered
                          </p>
                          <p className="font-mono text-sm font-bold text-zinc-200">
                            {alert.triggerCount}x
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Last Triggered
                          </p>
                          <p className="font-mono text-[11px] text-zinc-500">
                            {formatDate(alert.lastTriggered)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
