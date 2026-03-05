"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChainBadge } from "@/components/shared/ChainBadge";

const protocols = [
  { name: "Aave V3", chains: ["Ethereum", "Arbitrum", "Optimism", "Base"], apy: { USDC: 4.12, ETH: 2.85, DAI: 3.94 } },
  { name: "Morpho Blue", chains: ["Ethereum", "Base"], apy: { USDC: 7.82, ETH: 4.21, DAI: 6.15 } },
  { name: "Compound V3", chains: ["Ethereum", "Arbitrum", "Base"], apy: { USDC: 5.58, ETH: 3.12, DAI: 4.45 } },
  { name: "Spark", chains: ["Ethereum"], apy: { USDC: 5.21, ETH: 3.67, DAI: 5.21 } },
  { name: "Venus", chains: ["BSC"], apy: { USDC: 9.12, ETH: 5.44, DAI: 8.31 } },
];

const assets = ["USDC", "ETH", "DAI"];

const steps = ["Select Source", "Select Destination", "Confirm"];

export default function MoveFundsPage() {
  const [step, setStep] = useState(0);
  const [sourceProtocol, setSourceProtocol] = useState("");
  const [sourceChain, setSourceChain] = useState("");
  const [sourceAsset, setSourceAsset] = useState("USDC");
  const [amount, setAmount] = useState("50000");
  const [destProtocol, setDestProtocol] = useState("");
  const [destChain, setDestChain] = useState("");

  const sourceProto = protocols.find((p) => p.name === sourceProtocol);
  const destProto = protocols.find((p) => p.name === destProtocol);
  const sourceAPY = sourceProto?.apy[sourceAsset as keyof typeof sourceProto.apy] ?? 0;
  const destAPY = destProto?.apy[sourceAsset as keyof typeof destProto.apy] ?? 0;
  const apyDiff = destAPY - sourceAPY;
  const estimatedGas = sourceChain === destChain ? 12.5 : 18.5;
  const bridgeCost = sourceChain === destChain ? 0 : 4.2;

  const canProceedStep1 = sourceProtocol && sourceChain && sourceAsset && amount;
  const canProceedStep2 = destProtocol && destChain;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold text-zinc-100">Move Funds</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Transfer positions between protocols and chains
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in-up delay-2">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                      i <= step
                        ? "bg-emerald-500 text-zinc-950"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {i < step ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={`mt-1.5 text-[10px] font-medium ${
                      i <= step ? "text-emerald-400" : "text-zinc-600"
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`mx-3 h-0.5 w-16 sm:w-24 md:w-32 transition-colors ${
                      i < step ? "bg-emerald-500" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Source */}
        {step === 0 && (
          <Card className="animate-fade-in-up delay-3 border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Step 1: Select Source
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                  Source Protocol
                </label>
                <select
                  value={sourceProtocol}
                  onChange={(e) => {
                    setSourceProtocol(e.target.value);
                    setSourceChain("");
                  }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="">Select protocol...</option>
                  {protocols.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {sourceProtocol && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                    Source Chain
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sourceProto?.chains.map((chain) => (
                      <button
                        key={chain}
                        onClick={() => setSourceChain(chain)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          sourceChain === chain
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <ChainBadge chain={chain} showLabel={false} />
                        {chain}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                  Asset
                </label>
                <div className="flex gap-2">
                  {assets.map((asset) => (
                    <button
                      key={asset}
                      onClick={() => setSourceAsset(asset)}
                      className={`rounded-lg border px-4 py-2 font-mono text-sm font-semibold transition-colors ${
                        sourceAsset === asset
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      {asset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                  Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-500">$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 font-mono text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {sourceProtocol && sourceChain && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-xs text-zinc-500">Current APY:</span>
                  <span className="ml-2 font-mono text-sm font-semibold text-emerald-400">
                    {sourceAPY.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => canProceedStep1 && setStep(1)}
                disabled={!canProceedStep1}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
                  canProceedStep1
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </Card>
        )}

        {/* Step 2: Select Destination */}
        {step === 1 && (
          <Card className="animate-fade-in-up delay-3 border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Step 2: Select Destination
            </h2>

            {/* Source summary */}
            <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-xs text-zinc-500">
                Moving{" "}
                <span className="font-mono font-semibold text-zinc-300">
                  ${Number(amount).toLocaleString()} {sourceAsset}
                </span>{" "}
                from{" "}
                <span className="font-semibold text-zinc-300">
                  {sourceProtocol}
                </span>{" "}
                on{" "}
                <span className="text-zinc-300">{sourceChain}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                  Destination Protocol
                </label>
                <select
                  value={destProtocol}
                  onChange={(e) => {
                    setDestProtocol(e.target.value);
                    setDestChain("");
                  }}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
                >
                  <option value="">Select protocol...</option>
                  {protocols
                    .filter((p) => p.name !== sourceProtocol || true)
                    .map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>

              {destProtocol && (
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                    Destination Chain
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {destProto?.chains.map((chain) => (
                      <button
                        key={chain}
                        onClick={() => setDestChain(chain)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                          destChain === chain
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                            : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <ChainBadge chain={chain} showLabel={false} />
                        {chain}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {destProtocol && destChain && (
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Destination APY:</span>
                    <span className="font-mono text-sm font-semibold text-emerald-400">
                      {destAPY.toFixed(2)}%
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">APY Change:</span>
                    <span
                      className={`font-mono text-sm font-semibold ${
                        apyDiff >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {apyDiff >= 0 ? "+" : ""}
                      {apyDiff.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(0)}
                className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
              >
                Back
              </button>
              <button
                onClick={() => canProceedStep2 && setStep(2)}
                disabled={!canProceedStep2}
                className={`rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors ${
                  canProceedStep2
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 2 && (
          <Card className="animate-fade-in-up delay-3 border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Step 3: Confirm Transaction
            </h2>

            <div className="space-y-4">
              {/* Transfer Summary */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      From
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">{sourceProtocol}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <ChainBadge chain={sourceChain} size="sm" />
                    </div>
                    <p className="mt-1 font-mono text-xs text-zinc-500">
                      APY: {sourceAPY.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      To
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-200">{destProtocol}</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <ChainBadge chain={destChain} size="sm" />
                    </div>
                    <p className="mt-1 font-mono text-xs text-emerald-400">
                      APY: {destAPY.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4">
                <span className="text-xs text-zinc-500">Amount</span>
                <span className="font-mono text-lg font-bold text-zinc-100">
                  ${Number(amount).toLocaleString()} {sourceAsset}
                </span>
              </div>

              {/* Costs */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Estimated Gas</span>
                  <span className="font-mono text-sm text-zinc-300">
                    ${estimatedGas.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Bridge Cost</span>
                  <span className="font-mono text-sm text-zinc-300">
                    ${bridgeCost.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-zinc-800" />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Total Cost</span>
                  <span className="font-mono text-sm font-semibold text-zinc-100">
                    ${(estimatedGas + bridgeCost).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* APY Change */}
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <span className="text-xs font-semibold text-zinc-400">APY Change</span>
                <div className="text-right">
                  <span className="font-mono text-sm text-zinc-500">{sourceAPY.toFixed(2)}%</span>
                  <span className="mx-2 text-zinc-600">&rarr;</span>
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {destAPY.toFixed(2)}%
                  </span>
                  <span
                    className={`ml-2 font-mono text-xs ${
                      apyDiff >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    ({apyDiff >= 0 ? "+" : ""}
                    {apyDiff.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300"
              >
                Back
              </button>
              <button className="rounded-lg bg-emerald-600 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500">
                Confirm &amp; Execute
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
