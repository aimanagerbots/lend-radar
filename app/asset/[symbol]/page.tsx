"use client";

import { use, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLendingPools } from "@/lib/api";
import { REFETCH_INTERVAL } from "@/lib/constants";
import { mockHistoricalData, historicalProtocols } from "@/lib/mock/historical";
import { APYHistoryChart } from "@/components/charts/APYHistoryChart";
import { Card } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import Link from "next/link";
import { ArrowLeft, TrendingUp, BarChart3, Layers, Shield } from "lucide-react";

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(2)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
}

function formatProtocolName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AssetPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = use(params);
  const upperSymbol = symbol.toUpperCase();

  const {
    data: pools = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lending-pools"],
    queryFn: fetchLendingPools,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });

  // Filter pools for this asset (match symbol containing our asset)
  const assetPools = useMemo(() => {
    return pools
      .filter((p) => p.symbol.toUpperCase().includes(upperSymbol))
      .sort((a, b) => b.apy - a.apy);
  }, [pools, upperSymbol]);

  // Compute summary stats
  const stats = useMemo(() => {
    if (assetPools.length === 0) return null;

    const best = assetPools[0];
    const avgApy =
      assetPools.reduce((sum, p) => sum + p.apy, 0) / assetPools.length;
    const uniqueProtocols = new Set(assetPools.map((p) => p.project));

    return {
      bestApy: best.apy,
      bestProtocol: formatProtocolName(best.project),
      bestChain: best.chain,
      avgApy,
      poolCount: assetPools.length,
      topProtocol: formatProtocolName(best.project),
    };
  }, [assetPools]);

  // Historical chart data
  const historicalChartData = useMemo(() => {
    const assetHistory = mockHistoricalData[upperSymbol];
    if (!assetHistory) return [];

    return historicalProtocols
      .filter((protocol) => assetHistory[protocol])
      .map((protocol) => ({
        protocol,
        data: assetHistory[protocol],
      }));
  }, [upperSymbol]);

  const summaryCards = stats
    ? [
        {
          label: "Best APY",
          value: `${stats.bestApy.toFixed(2)}%`,
          sub: `${stats.bestProtocol} on ${stats.bestChain}`,
          icon: TrendingUp,
        },
        {
          label: "Average APY",
          value: `${stats.avgApy.toFixed(2)}%`,
          sub: `Across ${stats.poolCount} pools`,
          icon: BarChart3,
        },
        {
          label: "Active Pools",
          value: stats.poolCount.toString(),
          sub: `${new Set(assetPools.map((p) => p.chain)).size} chains`,
          icon: Layers,
        },
        {
          label: "Best Protocol",
          value: stats.topProtocol,
          sub: `${stats.bestApy.toFixed(2)}% APY`,
          icon: Shield,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all rates
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-6">
          <h1 className="font-mono text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            {upperSymbol}
          </h1>
          {stats && (
            <div className="flex items-baseline gap-2 pb-1">
              <span className="font-mono text-3xl font-bold text-emerald-500 sm:text-4xl">
                {stats.bestApy.toFixed(2)}%
              </span>
              <span className="text-sm text-zinc-500">
                best rate via {stats.bestProtocol} on {stats.bestChain}
              </span>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <Card className="border-zinc-800 bg-zinc-900">
            <LoadingSkeleton />
          </Card>
        )}

        {/* Error state */}
        {error && (
          <Card className="border-zinc-800 bg-zinc-900 p-8 text-center">
            <p className="text-red-400">
              Failed to load pool data. Please try again later.
            </p>
          </Card>
        )}

        {/* Main content */}
        {!isLoading && !error && (
          <>
            {/* Summary cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaryCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.label}
                    className={`animate-fade-in-up delay-${i} border-zinc-800 bg-zinc-900 p-5`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                          {card.label}
                        </p>
                        <p className="mt-1 font-mono text-2xl font-bold text-emerald-500">
                          {card.value}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {card.sub}
                        </p>
                      </div>
                      <Icon className="h-5 w-5 text-zinc-700" />
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* APY History Chart */}
            {historicalChartData.length > 0 && (
              <Card className="mb-8 border-zinc-800 bg-zinc-900 p-5">
                <APYHistoryChart
                  protocols={historicalChartData}
                  height={380}
                  className="w-full"
                />
              </Card>
            )}

            {/* Live Pools Table */}
            <Card className="border-zinc-800 bg-zinc-900">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h3 className="font-mono text-sm font-semibold text-zinc-200">
                  Live Pools for {upperSymbol}
                </h3>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {assetPools.length} pools sorted by APY
                </p>
              </div>

              {assetPools.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-zinc-500">
                  No pools found for {upperSymbol}. Try a different asset.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-500">
                        <th className="px-5 py-3 font-medium">Protocol</th>
                        <th className="px-5 py-3 font-medium">Chain</th>
                        <th className="px-5 py-3 font-medium">Symbol</th>
                        <th className="px-5 py-3 text-right font-medium">
                          APY
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Base APY
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          Reward APY
                        </th>
                        <th className="px-5 py-3 text-right font-medium">
                          TVL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetPools.map((pool, idx) => (
                        <tr
                          key={pool.pool}
                          className={`border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/40 ${
                            idx === 0 ? "bg-emerald-500/5" : ""
                          }`}
                        >
                          <td className="px-5 py-3 font-medium text-zinc-200">
                            {formatProtocolName(pool.project)}
                          </td>
                          <td className="px-5 py-3 text-zinc-400">
                            {pool.chain}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-zinc-400">
                            {pool.symbol}
                          </td>
                          <td
                            className={`px-5 py-3 text-right font-mono font-semibold ${
                              idx === 0 ? "text-emerald-400" : "text-zinc-200"
                            }`}
                          >
                            {pool.apy.toFixed(2)}%
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-zinc-400">
                            {pool.apyBase != null
                              ? `${pool.apyBase.toFixed(2)}%`
                              : "-"}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-zinc-400">
                            {pool.apyReward != null
                              ? `${pool.apyReward.toFixed(2)}%`
                              : "-"}
                          </td>
                          <td className="px-5 py-3 text-right font-mono text-zinc-300">
                            {formatTVL(pool.tvlUsd)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
