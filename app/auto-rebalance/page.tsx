"use client";

import { useState } from "react";
import { mockTransactions } from "@/lib/mock/transactions";
import { Card } from "@/components/ui/card";
import { ChainBadge } from "@/components/shared/ChainBadge";

const chains = ["Ethereum", "Arbitrum", "Base", "Optimism", "Polygon", "BSC", "Avalanche"];

export default function AutoRebalancePage() {
  const [enabled, setEnabled] = useState(false);
  const [strategy, setStrategy] = useState("balanced");
  const [minAPYImprovement, setMinAPYImprovement] = useState(50);
  const [gasLimit, setGasLimit] = useState("50");
  const [frequency, setFrequency] = useState("weekly");
  const [chainWhitelist, setChainWhitelist] = useState<string[]>([
    "Ethereum",
    "Arbitrum",
    "Base",
  ]);

  const rebalanceTxs = mockTransactions.filter((tx) => tx.type === "rebalance");

  const toggleChain = (chain: string) => {
    setChainWhitelist((prev) =>
      prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold text-zinc-100">Auto-Rebalance</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Configure automatic yield optimization across your positions
          </p>
        </div>

        {/* Master Toggle */}
        <Card className="animate-fade-in-up delay-2 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Auto-Rebalance</h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                Automatically move funds to higher-yielding protocols when conditions are met
              </p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                enabled ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
                  enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          {enabled && (
            <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs text-emerald-400">
                Auto-rebalance is active. Funds will be moved according to your strategy settings.
              </p>
            </div>
          )}
        </Card>

        {/* Strategy Selector */}
        <Card className="animate-fade-in-up delay-3 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Strategy
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                id: "conservative",
                label: "Conservative",
                desc: "Low risk. Only A+ rated protocols. Minimal rebalancing.",
              },
              {
                id: "balanced",
                label: "Balanced",
                desc: "Moderate risk. A/A+ protocols. Weekly rebalancing.",
              },
              {
                id: "aggressive",
                label: "Aggressive",
                desc: "Higher risk. All protocols. Frequent rebalancing.",
              },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  strategy === s.id
                    ? "border-emerald-500 bg-emerald-500/5"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    strategy === s.id ? "text-emerald-400" : "text-zinc-200"
                  }`}
                >
                  {s.label}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{s.desc}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Parameters */}
        <Card className="animate-fade-in-up delay-4 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Parameters
          </h2>
          <div className="space-y-5">
            {/* Min APY Improvement */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-500">
                  Min APY Improvement Threshold
                </label>
                <span className="font-mono text-sm font-semibold text-emerald-400">
                  {(minAPYImprovement / 100).toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                value={minAPYImprovement}
                onChange={(e) => setMinAPYImprovement(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-emerald-500 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                <span>0.10%</span>
                <span>1.00%</span>
                <span>2.00%</span>
              </div>
            </div>

            {/* Gas Limit */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Max Gas Cost per Rebalance (USD)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">$</span>
                <input
                  type="text"
                  value={gasLimit}
                  onChange={(e) => setGasLimit(e.target.value)}
                  className="w-32 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
                />
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Rebalance Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Chain Whitelist */}
        <Card className="animate-fade-in-up delay-4 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Chain Whitelist
          </h2>
          <p className="mb-3 text-xs text-zinc-500">
            Only rebalance to protocols on these chains
          </p>
          <div className="flex flex-wrap gap-2">
            {chains.map((chain) => {
              const active = chainWhitelist.includes(chain);
              return (
                <button
                  key={chain}
                  onClick={() => toggleChain(chain)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    active
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <ChainBadge chain={chain} showLabel={false} />
                  {chain}
                  {active && (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Recent Rebalances */}
        <Card className="animate-fade-in-up delay-5 border-zinc-800 bg-zinc-900 p-0 overflow-hidden">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-100">Recent Rebalances</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium">From</th>
                  <th className="px-5 py-3 font-medium">To</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium text-right">APY Change</th>
                  <th className="px-5 py-3 font-medium text-right">Cost</th>
                  <th className="px-5 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {rebalanceTxs.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                  >
                    <td className="px-5 py-3 text-xs text-zinc-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-mono font-semibold text-zinc-100">
                      {tx.asset}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-xs text-zinc-300">{tx.fromProtocol}</div>
                      <div className="text-[10px] text-zinc-600">{tx.fromChain}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-xs text-zinc-300">{tx.toProtocol}</div>
                      <div className="text-[10px] text-zinc-600">{tx.toChain}</div>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-zinc-100">
                      ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-mono text-xs text-zinc-500">
                        {"previousAPY" in tx ? `${(tx as Record<string, unknown>).previousAPY}%` : ""}
                      </span>
                      <span className="mx-1 text-zinc-600">&rarr;</span>
                      <span className="font-mono text-xs text-emerald-400">
                        {tx.apyAtTime}%
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-zinc-400">
                      ${(tx.gasCost + tx.bridgeCost).toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Save Button */}
        <div className="mt-6 animate-fade-in-up delay-5 flex justify-end">
          <button className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
