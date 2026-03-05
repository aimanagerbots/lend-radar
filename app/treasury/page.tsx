"use client";

import { mockTreasury } from "@/lib/mock/treasury";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ChainBadge } from "@/components/shared/ChainBadge";

export default function TreasuryPage() {
  const {
    orgName,
    totalAUM,
    totalMonthlyYield,
    weightedAvgAPY,
    allocations,
    monthlyReports,
    policies,
    signers,
  } = mockTreasury;

  const stats = [
    {
      label: "Assets Under Management",
      value: `$${totalAUM.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Monthly Yield",
      value: `$${totalMonthlyYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Weighted Avg APY",
      value: `${weightedAvgAPY.toFixed(2)}%`,
    },
    {
      label: "Active Allocations",
      value: allocations.length.toString(),
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-zinc-100">Treasury Console</h1>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              {orgName}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Manage organizational treasury allocations and yield strategy
          </p>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              className={`animate-fade-in-up border-zinc-800 bg-zinc-900 p-5 delay-${i + 1}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-emerald-500">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Allocations Table */}
        <Card className="animate-fade-in-up delay-3 mb-8 border-zinc-800 bg-zinc-900 p-0 overflow-hidden">
          <div className="border-b border-zinc-800 px-5 py-4">
            <h2 className="text-sm font-semibold text-zinc-100">Allocations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-5 py-3 font-medium">Protocol</th>
                  <th className="px-5 py-3 font-medium">Chain</th>
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-5 py-3 font-medium text-right">Amount</th>
                  <th className="px-5 py-3 font-medium text-right">APY</th>
                  <th className="px-5 py-3 font-medium text-center">Risk</th>
                  <th className="px-5 py-3 font-medium text-right">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc, i) => (
                  <tr
                    key={i}
                    className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                  >
                    <td className="px-5 py-3 font-medium text-zinc-200">{alloc.protocol}</td>
                    <td className="px-5 py-3">
                      <ChainBadge chain={alloc.chain} />
                    </td>
                    <td className="px-5 py-3 font-mono text-zinc-300">{alloc.asset}</td>
                    <td className="px-5 py-3 text-right font-mono text-zinc-100">
                      ${alloc.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-emerald-500">
                      {alloc.apy.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3 text-center">
                      <RiskBadge score={alloc.riskScore} />
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-zinc-400">
                      {alloc.percentOfTotal.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Monthly Reports */}
          <Card className="animate-fade-in-up delay-4 border-zinc-800 bg-zinc-900 p-0 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-100">Monthly Reports</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-5 py-3 font-medium">Month</th>
                    <th className="px-5 py-3 font-medium text-right">Total Yield</th>
                    <th className="px-5 py-3 font-medium text-right">Avg APY</th>
                    <th className="px-5 py-3 font-medium text-right">Rebalances</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyReports.map((report) => (
                    <tr
                      key={report.month}
                      className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                    >
                      <td className="px-5 py-3 font-medium text-zinc-200">{report.month}</td>
                      <td className="px-5 py-3 text-right font-mono text-emerald-400">
                        +${report.totalYield.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-zinc-300">
                        {report.avgAPY.toFixed(2)}%
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-zinc-400">
                        {report.rebalances}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Policy Summary & Signers */}
          <div className="space-y-6">
            {/* Policy Summary */}
            <Card className="animate-fade-in-up delay-4 border-zinc-800 bg-zinc-900 p-5">
              <h2 className="mb-4 text-sm font-semibold text-zinc-100">Policy Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Max Single Protocol Exposure</span>
                  <span className="font-mono text-sm text-zinc-300">
                    {(policies.maxSingleProtocolExposure * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="border-t border-zinc-800/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Min Risk Score</span>
                  <RiskBadge score={policies.minRiskScore} />
                </div>
                <div className="border-t border-zinc-800/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Min TVL Requirement</span>
                  <span className="font-mono text-sm text-zinc-300">
                    ${(policies.minTVL / 1e6).toFixed(0)}M
                  </span>
                </div>
                <div className="border-t border-zinc-800/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Rebalance Frequency</span>
                  <span className="text-sm capitalize text-zinc-300">
                    {policies.rebalanceFrequency}
                  </span>
                </div>
                <div className="border-t border-zinc-800/50" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Required Signatures</span>
                  <span className="font-mono text-sm text-zinc-300">
                    {policies.requiredSignatures} of {signers.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Signers */}
            <Card className="animate-fade-in-up delay-5 border-zinc-800 bg-zinc-900 p-5">
              <h2 className="mb-4 text-sm font-semibold text-zinc-100">Signers</h2>
              <div className="space-y-3">
                {signers.map((signer, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{signer.name}</p>
                      <p className="font-mono text-xs text-zinc-500">{signer.address}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        signer.role === "admin"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : signer.role === "manager"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-zinc-700/50 text-zinc-400"
                      }`}
                    >
                      {signer.role}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
