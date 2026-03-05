"use client";

import { DefiLlamaPool } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RatesTableProps {
  pools: DefiLlamaPool[];
  bestRates: Map<string, string>; // symbol -> pool id of best rate
  staggerAnimation?: boolean;
  pageOffset?: number;
}

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: "#627eea",
  Arbitrum: "#28a0f0",
  Base: "#0052ff",
  Optimism: "#ff0420",
  Polygon: "#8247e5",
  BSC: "#f0b90b",
  Solana: "#9945ff",
  Avalanche: "#e84142",
};

const DEFAULT_CHAIN_COLOR = "#71717a";

function formatTvl(tvl: number): string {
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
  if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

function formatApy(apy: number | null): string {
  if (apy == null) return "\u2014";
  return `${apy.toFixed(2)}%`;
}

function getApyColorClass(apy: number | null): string {
  if (apy == null) return "text-zinc-400";
  if (apy > 5) return "text-emerald-400";
  if (apy >= 1) return "text-green-400";
  return "text-zinc-400";
}

export function RatesTable({ pools, bestRates, staggerAnimation = true, pageOffset = 0 }: RatesTableProps) {
  if (pools.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No pools match your filters. Try broadening your search.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Chain</TableHead>
          <TableHead>Protocol</TableHead>
          <TableHead className="text-right">Total APY</TableHead>
          <TableHead className="text-right">Base APY</TableHead>
          <TableHead className="text-right">Reward APY</TableHead>
          <TableHead className="text-right">TVL</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools.map((pool, index) => {
          const isBest = bestRates.get(pool.symbol) === pool.pool;
          const chainColor = CHAIN_COLORS[pool.chain] || DEFAULT_CHAIN_COLOR;

          return (
            <TableRow
              key={pool.pool}
              className={`${staggerAnimation ? "animate-fade-in-up" : ""} ${isBest ? "bg-emerald-950/20" : ""}`}
              style={staggerAnimation ? { animationDelay: `${index * 30}ms` } : undefined}
            >
              <TableCell className="font-medium">
                <Link
                  href={`/asset/${encodeURIComponent(pool.symbol)}`}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {pool.symbol}
                </Link>
                {pool.poolMeta && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({pool.poolMeta})
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chainColor }}
                  />
                  {pool.chain}
                </span>
              </TableCell>
              <TableCell>{pool.project}</TableCell>
              <TableCell className="text-right font-mono">
                <span className={getApyColorClass(pool.apy)}>
                  {formatApy(pool.apy)}
                </span>
                {isBest && (
                  <Badge
                    variant="default"
                    className="ml-2 bg-emerald-600 text-white text-[10px] px-1.5 py-0 animate-emerald-pulse"
                  >
                    BEST
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-mono text-muted-foreground">
                {formatApy(pool.apyBase)}
              </TableCell>
              <TableCell className="text-right font-mono">
                {pool.apyReward != null ? (
                  <span className="text-xs text-muted-foreground">
                    {formatApy(pool.apyReward)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">{"\u2014"}</span>
                )}
              </TableCell>
              <TableCell className="text-right font-mono">
                {formatTvl(pool.tvlUsd)}
              </TableCell>
              <TableCell className="text-right">
                {pool.url ? (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={pool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Deposit <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">{"\u2014"}</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
