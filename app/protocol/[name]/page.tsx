"use client";

import { use, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockRiskScores } from "@/lib/mock/risk-scores";
import { RiskRadarChart } from "@/components/charts/RiskRadarChart";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ChainBadge } from "@/components/shared/ChainBadge";
import { fetchLendingPools } from "@/lib/api";
import { REFETCH_INTERVAL } from "@/lib/constants";
import { Card } from "@/components/ui/card";

function formatTVL(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatAmount(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function normalize(s: string): string {
  return decodeURIComponent(s).toLowerCase().replace(/[\s-]+/g, "-");
}

const factorLabels: Record<string, string> = {
  smartContractSecurity: "Smart Contract",
  tvlStability: "TVL Stability",
  teamReputation: "Team Reputation",
  auditCoverage: "Audit Coverage",
  oracleReliability: "Oracle Reliability",
  historicalPerformance: "Historical Perf.",
};

export default function ProtocolProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  const decodedName = decodeURIComponent(name);

  const protocol = useMemo(() => {
    const norm = normalize(name);
    return mockRiskScores.protocols.find(
      (p) => normalize(p.name) === norm
    );
  }, [name]);

  const radarData = useMemo(() => {
    if (!protocol) return [];
    return Object.entries(protocol.factors).map(([key, value]) => ({
      subject: factorLabels[key] ?? key,
      value,
      fullMark: 100,
    }));
  }, [protocol]);

  const { data: pools, isLoading: poolsLoading } = useQuery({
    queryKey: ["lending-pools"],
    queryFn: fetchLendingPools,
    refetchInterval: REFETCH_INTERVAL,
  });

  const protocolPools = useMemo(() => {
    if (!pools) return [];
    const norm = normalize(name);
    return pools.filter(
      (p) => normalize(p.project) === norm
    );
  }, [pools, name]);

  if (!protocol) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            Protocol Not Found
          </h1>
          <p className="text-zinc-400">
            No risk data available for &quot;{decodedName}&quot;.
          </p>
        </div>
      </div>
    );
  }

  const summaryStats = [
    {
      label: "Numeric Score",
      value: `${protocol.numericScore}/100`,
    },
    {
      label: "TVL Trend (30d)",
      value: `${protocol.tvlTrend30d > 0 ? "+" : ""}${protocol.tvlTrend30d}%`,
      color:
        protocol.tvlTrend30d >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Oracle",
      value: protocol.oracleDependency,
    },
    {
      label: "Governance Token",
      value: protocol.governanceToken,
    },
    {
      label: "Insurance",
      value: protocol.insuranceAvailable ? "Available" : "Not Available",
      color: protocol.insuranceAvailable
        ? "text-emerald-400"
        : "text-zinc-500",
    },
    {
      label: "Last Audit",
      value: protocol.lastAudit,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Protocol Header */}
        <div className="animate-fade-in-up">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
                    {protocol.name}
                  </h1>
                  <RiskBadge score={protocol.overallScore} size="lg" />
                </div>
                <p className="text-sm text-zinc-400">{protocol.auditStatus}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {protocol.chains.map((chain) => (
                    <ChainBadge key={chain} chain={chain} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-right sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    TVL
                  </p>
                  <p className="text-xl font-bold text-emerald-500">
                    {formatTVL(protocol.tvl)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Time in Market
                  </p>
                  <p className="text-xl font-bold text-zinc-100">
                    {protocol.timeInMarket}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    Chains
                  </p>
                  <p className="text-xl font-bold text-zinc-100">
                    {protocol.chains.length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Risk Radar Chart + Summary Stats */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Radar Chart */}
          <div className="animate-fade-in-up [animation-delay:100ms]">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                Risk Factor Analysis
              </h2>
              <RiskRadarChart factors={protocol.factors} label={protocol.name} height={320} />
            </Card>
          </div>

          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {summaryStats.map((stat, i) => (
              <div
                key={stat.label}
                className="animate-fade-in-up"
                style={{ animationDelay: `${150 + i * 75}ms` }}
              >
                <Card className="bg-zinc-900 border-zinc-800 p-4 h-full">
                  <p className="text-xs uppercase tracking-wider text-zinc-500">
                    {stat.label}
                  </p>
                  <p
                    className={`mt-1 text-lg font-bold ${
                      stat.color ?? "text-zinc-100"
                    }`}
                  >
                    {stat.value}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Live Pools Table */}
        <div className="animate-fade-in-up [animation-delay:600ms]">
          <Card className="bg-zinc-900 border-zinc-800 p-6">
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">
              Live Pools
            </h2>
            {poolsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                <span className="ml-3 text-sm text-zinc-400">
                  Loading pools...
                </span>
              </div>
            ) : protocolPools.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                No active pools found for this protocol.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
                      <th className="pb-3 pr-4">Asset</th>
                      <th className="pb-3 pr-4">Chain</th>
                      <th className="pb-3 pr-4 text-right">APY</th>
                      <th className="pb-3 pr-4 text-right">Base APY</th>
                      <th className="pb-3 pr-4 text-right">Reward APY</th>
                      <th className="pb-3 text-right">TVL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {protocolPools
                      .sort((a, b) => b.apy - a.apy)
                      .slice(0, 20)
                      .map((pool) => (
                        <tr
                          key={pool.pool}
                          className="text-zinc-300 transition-colors hover:bg-zinc-800/40"
                        >
                          <td className="py-3 pr-4 font-medium text-zinc-100">
                            {pool.symbol}
                          </td>
                          <td className="py-3 pr-4">
                            <ChainBadge chain={pool.chain} />
                          </td>
                          <td className="py-3 pr-4 text-right font-mono text-emerald-400">
                            {pool.apy.toFixed(2)}%
                          </td>
                          <td className="py-3 pr-4 text-right font-mono text-zinc-400">
                            {pool.apyBase != null
                              ? `${pool.apyBase.toFixed(2)}%`
                              : "--"}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono text-zinc-400">
                            {pool.apyReward != null
                              ? `${pool.apyReward.toFixed(2)}%`
                              : "--"}
                          </td>
                          <td className="py-3 text-right font-mono">
                            {formatTVL(pool.tvlUsd)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Audit Info + Exploit History */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Audit Info */}
          <div className="animate-fade-in-up [animation-delay:750ms]">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                Audit Information
              </h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Status
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {protocol.auditStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Last Audit Date
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {protocol.lastAudit}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Oracle Dependency
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-200">
                    {protocol.oracleDependency}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-zinc-500">
                    Insurance Coverage
                  </dt>
                  <dd
                    className={`mt-1 text-sm font-medium ${
                      protocol.insuranceAvailable
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {protocol.insuranceAvailable
                      ? "Available"
                      : "Not Available"}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>

          {/* Exploit History Timeline */}
          <div className="animate-fade-in-up [animation-delay:900ms]">
            <Card className="bg-zinc-900 border-zinc-800 p-6">
              <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                Exploit History
              </h2>
              {protocol.exploitHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-2 rounded-full bg-emerald-500/10 p-3">
                    <svg
                      className="h-6 w-6 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-emerald-400">
                    No known exploits
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Clean security record
                  </p>
                </div>
              ) : (
                <div className="relative space-y-6 pl-6 before:absolute before:left-[7px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-zinc-700">
                  {protocol.exploitHistory.map((exploit, i) => (
                    <div key={i} className="relative">
                      <div
                        className={`absolute -left-6 top-1 h-3 w-3 rounded-full border-2 ${
                          exploit.recovered
                            ? "border-yellow-500 bg-yellow-500/20"
                            : "border-red-500 bg-red-500/20"
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-500">
                            {exploit.date}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                              exploit.recovered
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {exploit.recovered ? "Recovered" : "Not Recovered"}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-300">
                          {exploit.description}
                        </p>
                        <p className="text-xs font-mono text-red-400">
                          Loss: {formatAmount(exploit.amountLost)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
