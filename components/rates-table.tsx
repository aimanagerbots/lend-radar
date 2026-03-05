"use client";

import { DefiLlamaPool } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
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
}

function formatTvl(tvl: number): string {
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
  if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(0)}K`;
  return `$${tvl.toFixed(0)}`;
}

function formatApy(apy: number | null): string {
  if (apy == null) return "—";
  return `${apy.toFixed(2)}%`;
}

export function RatesTable({ pools, bestRates }: RatesTableProps) {
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
          <TableHead className="text-right">TVL</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools.map((pool) => {
          const isBest = bestRates.get(pool.symbol) === pool.pool;
          return (
            <TableRow
              key={pool.pool}
              className={isBest ? "bg-green-950/20" : ""}
            >
              <TableCell className="font-medium">
                {pool.symbol}
                {pool.poolMeta && (
                  <span className="text-xs text-muted-foreground ml-1">
                    ({pool.poolMeta})
                  </span>
                )}
              </TableCell>
              <TableCell>{pool.chain}</TableCell>
              <TableCell>{pool.project}</TableCell>
              <TableCell className="text-right font-mono">
                <span className="text-green-400">{formatApy(pool.apy)}</span>
                {isBest && (
                  <Badge
                    variant="default"
                    className="ml-2 bg-green-600 text-white text-[10px] px-1.5 py-0"
                  >
                    BEST
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right font-mono text-muted-foreground">
                {formatApy(pool.apyBase)}
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
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
