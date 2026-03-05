"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchLendingPools } from "@/lib/api";
import { REFETCH_INTERVAL } from "@/lib/constants";
import { DefiLlamaPool } from "@/lib/types";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RatesTable } from "@/components/rates-table";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { TrendingUp, AlertCircle } from "lucide-react";

type SortField = "apy" | "tvl";

export default function Home() {
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

  const [assetFilter, setAssetFilter] = useState("");
  const [chainFilter, setChainFilter] = useState("all");
  const [protocolFilter, setProtocolFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortField>("apy");

  // Unique chains and protocols from data
  const chains = useMemo(
    () => [...new Set(pools.map((p) => p.chain))].sort(),
    [pools]
  );
  const protocols = useMemo(
    () => [...new Set(pools.map((p) => p.project))].sort(),
    [pools]
  );

  // Filter and sort
  const filtered = useMemo(() => {
    let result = pools.filter((p: DefiLlamaPool) => {
      const matchAsset =
        !assetFilter ||
        p.symbol.toLowerCase().includes(assetFilter.toLowerCase());
      const matchChain = chainFilter === "all" || p.chain === chainFilter;
      const matchProtocol =
        protocolFilter === "all" || p.project === protocolFilter;
      return matchAsset && matchChain && matchProtocol;
    });

    result.sort((a, b) =>
      sortBy === "apy" ? b.apy - a.apy : b.tvlUsd - a.tvlUsd
    );

    return result.slice(0, 150);
  }, [pools, assetFilter, chainFilter, protocolFilter, sortBy]);

  // Best rate per asset symbol
  const bestRates = useMemo(() => {
    const map = new Map<string, string>();
    const all = pools.filter((p) => {
      const matchChain = chainFilter === "all" || p.chain === chainFilter;
      const matchProtocol =
        protocolFilter === "all" || p.project === protocolFilter;
      return matchChain && matchProtocol;
    });
    for (const p of all) {
      const current = map.get(p.symbol);
      if (!current) {
        map.set(p.symbol, p.pool);
      } else {
        const currentPool = all.find((x) => x.pool === current);
        if (currentPool && p.apy > currentPool.apy) {
          map.set(p.symbol, p.pool);
        }
      }
    }
    return map;
  }, [pools, chainFilter, protocolFilter]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-3">
            LendRadar <TrendingUp className="text-green-500 h-8 w-8" />
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time best DeFi lending rates across all chains &bull; Data from
            DefiLlama &bull; Auto-refreshes every 5 min
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Filter asset (USDC, ETH, WBTC...)"
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            className="w-64"
          />
          <Select value={chainFilter} onValueChange={setChainFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Chains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              {chains.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={protocolFilter} onValueChange={setProtocolFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Protocols" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Protocols</SelectItem>
              {protocols.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortField)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apy">Sort by APY</SelectItem>
              <SelectItem value="tvl">Sort by TVL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats bar */}
        {!isLoading && !error && (
          <div className="flex gap-6 mb-4 text-sm text-muted-foreground">
            <span>{filtered.length} pools shown</span>
            <span>{chains.length} chains</span>
            <span>{protocols.length} protocols</span>
          </div>
        )}

        {/* Table */}
        <Card>
          {error ? (
            <div className="flex items-center justify-center gap-2 py-20 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Failed to load rates. Check your connection and try again.
            </div>
          ) : isLoading ? (
            <LoadingSkeleton />
          ) : (
            <RatesTable pools={filtered} bestRates={bestRates} />
          )}
        </Card>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Data sourced from DefiLlama Yields API &bull; Rates are supply APY
          &bull; Not financial advice
        </p>
      </div>
    </div>
  );
}
