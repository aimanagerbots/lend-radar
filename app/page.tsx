"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchLendingPools } from "@/lib/api";
import { REFETCH_INTERVAL } from "@/lib/constants";
import { DefiLlamaPool } from "@/lib/types";
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
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

type SortField = "apy" | "tvl";

const POOLS_PER_PAGE = 50;

function formatTotalTvl(tvl: number): string {
  if (tvl >= 1e12) return `$${(tvl / 1e12).toFixed(1)}T`;
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
  return `$${tvl.toFixed(0)}`;
}

function relativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return "1 min ago";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  return `${hours} hours ago`;
}

function RateExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    data: pools = [],
    isLoading,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["lending-pools"],
    queryFn: fetchLendingPools,
    refetchInterval: REFETCH_INTERVAL,
    staleTime: REFETCH_INTERVAL,
  });

  // Initialize state from URL params
  const [assetFilter, setAssetFilterState] = useState(
    searchParams.get("asset") ?? ""
  );
  const [chainFilter, setChainFilterState] = useState(
    searchParams.get("chain") ?? "all"
  );
  const [protocolFilter, setProtocolFilterState] = useState(
    searchParams.get("protocol") ?? "all"
  );
  const [sortBy, setSortByState] = useState<SortField>(
    (searchParams.get("sort") as SortField) ?? "apy"
  );
  const [page, setPage] = useState(
    Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  );

  // Helper to update URL params
  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (
          value === "" ||
          value === "all" ||
          (key === "sort" && value === "apy") ||
          (key === "page" && value === "1")
        ) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [searchParams, router]
  );

  const setAssetFilter = useCallback(
    (value: string) => {
      setAssetFilterState(value);
      setPage(1);
      updateParams({ asset: value, page: "1" });
    },
    [updateParams]
  );

  const setChainFilter = useCallback(
    (value: string) => {
      setChainFilterState(value);
      setPage(1);
      updateParams({ chain: value, page: "1" });
    },
    [updateParams]
  );

  const setProtocolFilter = useCallback(
    (value: string) => {
      setProtocolFilterState(value);
      setPage(1);
      updateParams({ protocol: value, page: "1" });
    },
    [updateParams]
  );

  const setSortBy = useCallback(
    (value: SortField) => {
      setSortByState(value);
      setPage(1);
      updateParams({ sort: value, page: "1" });
    },
    [updateParams]
  );

  const setPageWithUrl = useCallback(
    (p: number) => {
      setPage(p);
      updateParams({ page: String(p) });
    },
    [updateParams]
  );

  // Unique chains and protocols from data
  const chains = useMemo(
    () => [...new Set(pools.map((p) => p.chain))].sort(),
    [pools]
  );
  const protocols = useMemo(
    () => [...new Set(pools.map((p) => p.project))].sort(),
    [pools]
  );

  // Total TVL across all pools
  const totalTvl = useMemo(
    () => pools.reduce((sum, p) => sum + p.tvlUsd, 0),
    [pools]
  );

  // Filter and sort (no slice -- we paginate separately)
  const filtered = useMemo(() => {
    const result = pools.filter((p: DefiLlamaPool) => {
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

    return result;
  }, [pools, assetFilter, chainFilter, protocolFilter, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / POOLS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * POOLS_PER_PAGE;
  const endIdx = Math.min(startIdx + POOLS_PER_PAGE, filtered.length);
  const paginatedPools = filtered.slice(startIdx, endIdx);

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Subtitle */}
        <div className="mb-5">
          <p className="text-base text-zinc-400">
            Real-time best DeFi lending rates across all chains. Auto-refreshes
            every 5 minutes.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Input
            placeholder="Filter asset (USDC, ETH, WBTC...)"
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
          />
          <Select value={chainFilter} onValueChange={setChainFilter}>
            <SelectTrigger>
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
            <SelectTrigger>
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
            <SelectTrigger>
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
          <div className="flex flex-wrap gap-x-6 gap-y-1 mb-4 text-sm text-muted-foreground">
            <span>{protocols.length} protocols</span>
            <span>{chains.length} chains</span>
            <span>TVL {formatTotalTvl(totalTvl)}</span>
            <span>{filtered.length} pools</span>
            {dataUpdatedAt > 0 && (
              <span>Updated {relativeTime(dataUpdatedAt)}</span>
            )}
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
            <RatesTable
              pools={paginatedPools}
              bestRates={bestRates}
              staggerAnimation
              pageOffset={startIdx}
            />
          )}
        </Card>

        {/* Pagination */}
        {!isLoading && !error && filtered.length > POOLS_PER_PAGE && (
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {startIdx + 1}-{endIdx} of {filtered.length} pools
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPageWithUrl(safePage - 1)}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="text-sm text-muted-foreground px-2">
                Page {safePage} of {totalPages}
              </span>
              <button
                onClick={() => setPageWithUrl(safePage + 1)}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-zinc-800 text-zinc-200 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-muted-foreground text-xs mt-6">
          Rates are supply APY. Not financial advice.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground">
          <div className="max-w-7xl mx-auto">
            <div className="mb-5">
              <p className="text-base text-zinc-400">
                Real-time best DeFi lending rates across all chains.
                Auto-refreshes every 5 minutes.
              </p>
            </div>
            <Card>
              <LoadingSkeleton />
            </Card>
          </div>
        </div>
      }
    >
      <RateExplorerContent />
    </Suspense>
  );
}
