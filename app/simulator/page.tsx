"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { YieldProjectionChart } from "@/components/charts/YieldProjectionChart";
import { Calculator, TrendingUp } from "lucide-react";

const DURATION_OPTIONS = [
  { label: "3 Months", value: "3mo", months: 3 },
  { label: "6 Months", value: "6mo", months: 6 },
  { label: "1 Year", value: "1y", months: 12 },
  { label: "2 Years", value: "2y", months: 24 },
];

function generateProjection(
  principal: number,
  apyPercent: number,
  months: number,
  savingsAPY: number,
  includeComparison: boolean
): { date: string; projected: number; savings?: number }[] {
  const data: { date: string; projected: number; savings?: number }[] = [];
  const monthlyRate = apyPercent / 100 / 12;
  const savingsMonthlyRate = savingsAPY / 100 / 12;
  const start = new Date();

  for (let i = 0; i <= months; i++) {
    const d = new Date(start);
    d.setMonth(d.getMonth() + i);
    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });

    const projected = principal * Math.pow(1 + monthlyRate, i);
    const point: { date: string; projected: number; savings?: number } = {
      date: dateStr,
      projected: parseFloat(projected.toFixed(2)),
    };

    if (includeComparison) {
      point.savings = parseFloat(
        (principal * Math.pow(1 + savingsMonthlyRate, i)).toFixed(2)
      );
    }

    data.push(point);
  }

  return data;
}

export default function SimulatorPage() {
  const [principal, setPrincipal] = useState(10000);
  const [apy, setApy] = useState(7.5);
  const [duration, setDuration] = useState("1y");
  const [compareToggle, setCompareToggle] = useState(true);
  const [savingsAPY, setSavingsAPY] = useState(4.5);

  const months =
    DURATION_OPTIONS.find((d) => d.value === duration)?.months || 12;

  const projectionData = useMemo(() => {
    return generateProjection(principal, apy, months, savingsAPY, compareToggle);
  }, [principal, apy, months, savingsAPY, compareToggle]);

  const totalEarnings = useMemo(() => {
    if (projectionData.length === 0) return 0;
    return projectionData[projectionData.length - 1].projected - principal;
  }, [projectionData, principal]);

  const savingsEarnings = useMemo(() => {
    if (!compareToggle || projectionData.length === 0) return 0;
    const last = projectionData[projectionData.length - 1];
    return (last.savings || principal) - principal;
  }, [projectionData, principal, compareToggle]);

  const difference = totalEarnings - savingsEarnings;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
            Yield Simulator
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Project potential earnings from DeFi lending and compare against traditional savings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Controls */}
          <div className="animate-fade-in-up delay-1">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-400" />
                  <CardTitle className="font-mono text-sm text-zinc-300">
                    Parameters
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Principal */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Principal ($)
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) =>
                      setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>

                {/* APY */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    DeFi APY (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={apy}
                    onChange={(e) =>
                      setApy(Math.max(0, parseFloat(e.target.value) || 0))
                    }
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                    Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setDuration(opt.value)}
                        className={`rounded-lg border px-3 py-2 font-mono text-xs font-medium transition-all duration-150 ${
                          duration === opt.value
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comparison Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Compare vs Savings
                    </label>
                    <button
                      onClick={() => setCompareToggle(!compareToggle)}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        compareToggle ? "bg-emerald-500" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          compareToggle ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  {compareToggle && (
                    <div className="mt-2">
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                        Savings APY (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={savingsAPY}
                        onChange={(e) =>
                          setSavingsAPY(
                            Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-200 outline-none transition-colors focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart + Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart */}
            <div className="animate-fade-in-up delay-2">
              <Card className="border-zinc-800 bg-zinc-900">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <CardTitle className="font-mono text-sm text-zinc-300">
                      Yield Projection
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <YieldProjectionChart data={projectionData} height={350} />
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="animate-fade-in-up delay-3">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Card className="border-zinc-800 bg-zinc-900">
                  <CardContent className="py-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                      Total Earnings (DeFi)
                    </p>
                    <p className="font-mono text-xl font-bold text-emerald-400">
                      +$
                      {totalEarnings.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-zinc-500">
                      at {apy}% APY
                    </p>
                  </CardContent>
                </Card>

                {compareToggle && (
                  <Card className="border-zinc-800 bg-zinc-900">
                    <CardContent className="py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                        Savings Earnings
                      </p>
                      <p className="font-mono text-xl font-bold text-zinc-400">
                        +$
                        {savingsEarnings.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-zinc-500">
                        at {savingsAPY}% APY
                      </p>
                    </CardContent>
                  </Card>
                )}

                {compareToggle && (
                  <Card className="border-zinc-800 bg-zinc-900">
                    <CardContent className="py-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                        DeFi Advantage
                      </p>
                      <p
                        className={`font-mono text-xl font-bold ${
                          difference >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {difference >= 0 ? "+" : ""}$
                        {difference.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-zinc-500">
                        over{" "}
                        {DURATION_OPTIONS.find((d) => d.value === duration)?.label.toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
