"use client";

import { mockTransactions } from "@/lib/mock/transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const typeBadge: Record<string, { label: string; color: string }> = {
  deposit: {
    label: "Deposit",
    color: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20",
  },
  withdraw: {
    label: "Withdraw",
    color: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20",
  },
  rebalance: {
    label: "Rebalance",
    color: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20",
  },
};

const statusBadge: Record<string, { label: string; color: string }> = {
  completed: {
    label: "Completed",
    color: "bg-emerald-500/15 text-emerald-400",
  },
  pending: {
    label: "Pending",
    color: "bg-amber-500/15 text-amber-400",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/15 text-red-400",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            History of deposits, withdrawals, and rebalances across your DeFi positions.
          </p>
        </div>

        {/* Table Card */}
        <div className="animate-fade-in-up delay-1">
          <Card className="border-zinc-800 bg-zinc-900 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Type
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Asset
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Amount
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Route
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        APY
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Costs
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Status
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((tx, idx) => {
                      const badge = typeBadge[tx.type] || typeBadge.deposit;
                      const status = statusBadge[tx.status] || statusBadge.completed;
                      const totalCost = tx.gasCost + tx.bridgeCost;

                      return (
                        <tr
                          key={tx.id}
                          className={`animate-fade-in-up delay-${idx + 2} border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30`}
                        >
                          {/* Type */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </td>

                          {/* Asset */}
                          <td className="px-4 py-3 font-mono text-sm font-semibold text-zinc-200">
                            {tx.asset}
                          </td>

                          {/* Amount */}
                          <td className="px-4 py-3 text-right font-mono text-sm text-zinc-200">
                            $
                            {tx.amount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          {/* Route (from -> to) */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-xs">
                              {tx.fromProtocol ? (
                                <span className="text-zinc-400">
                                  {tx.fromProtocol}
                                  <span className="text-zinc-600"> / {tx.fromChain}</span>
                                </span>
                              ) : (
                                <span className="text-zinc-600">Wallet</span>
                              )}
                              <ArrowRight className="h-3 w-3 text-zinc-600" />
                              <span className="text-zinc-300">
                                {tx.toProtocol}
                                <span className="text-zinc-500"> / {tx.toChain}</span>
                              </span>
                            </div>
                          </td>

                          {/* APY */}
                          <td className="px-4 py-3 text-right font-mono text-sm text-emerald-400">
                            {tx.apyAtTime.toFixed(2)}%
                          </td>

                          {/* Costs */}
                          <td className="px-4 py-3 text-right">
                            <span className="font-mono text-xs text-zinc-400">
                              ${totalCost.toFixed(2)}
                            </span>
                            <span className="block font-mono text-[10px] text-zinc-600">
                              gas ${tx.gasCost.toFixed(2)} + bridge ${tx.bridgeCost.toFixed(2)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                            {formatDate(tx.timestamp)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
