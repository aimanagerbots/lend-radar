"use client";

import { mockPortfolio } from "@/lib/mock/portfolio";
import { AllocationPieChart } from "@/components/charts/AllocationPieChart";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { ChainBadge } from "@/components/shared/ChainBadge";
import { Card } from "@/components/ui/card";

const ALLOCATION_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function DashboardPage() {
  const { totalValue, totalDailyYield, weightedAvgAPY, totalMonthlyYield, positions } =
    mockPortfolio;

  const stats = [
    {
      label: "Total Value",
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Daily Yield",
      value: `$${totalDailyYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Weighted Avg APY",
      value: `${weightedAvgAPY.toFixed(2)}%`,
    },
    {
      label: "Monthly Yield",
      value: `$${totalMonthlyYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  ];

  const allocationData = positions.map((pos, i) => ({
    name: `${pos.asset} - ${pos.protocol}`,
    value: pos.currentValue,
    color: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
  }));

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100">Portfolio Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Wallet: <span className="font-mono text-zinc-400">{mockPortfolio.walletAddress}</span>
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

        {/* Main Content: Table + Chart */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Positions Table */}
          <div className="lg:col-span-2">
            <Card className="border-zinc-800 bg-zinc-900 p-0 overflow-hidden">
              <div className="border-b border-zinc-800 px-5 py-4">
                <h2 className="text-sm font-semibold text-zinc-100">Active Positions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                      <th className="px-5 py-3 font-medium">Asset</th>
                      <th className="px-5 py-3 font-medium">Protocol</th>
                      <th className="px-5 py-3 font-medium">Chain</th>
                      <th className="px-5 py-3 font-medium text-right">Deposited</th>
                      <th className="px-5 py-3 font-medium text-right">Current Value</th>
                      <th className="px-5 py-3 font-medium text-right">APY</th>
                      <th className="px-5 py-3 font-medium text-right">Daily Yield</th>
                      <th className="px-5 py-3 font-medium text-center">Risk</th>
                      <th className="px-5 py-3 font-medium text-right">Total Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => (
                      <tr
                        key={pos.id}
                        className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                      >
                        <td className="px-5 py-3 font-mono font-semibold text-zinc-100">
                          {pos.asset}
                        </td>
                        <td className="px-5 py-3 text-zinc-300">{pos.protocol}</td>
                        <td className="px-5 py-3">
                          <ChainBadge chain={pos.chain} />
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-zinc-300">
                          ${pos.deposited.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-zinc-100">
                          ${pos.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span className="font-mono text-emerald-500">{pos.apy.toFixed(2)}%</span>
                          <span
                            className={`ml-1.5 text-xs font-mono ${
                              pos.apyChange7d >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {pos.apyChange7d >= 0 ? "+" : ""}
                            {pos.apyChange7d.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-zinc-300">
                          ${pos.dailyYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <RiskBadge score={pos.riskScore} />
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-emerald-400">
                          +${pos.totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Allocation Chart */}
          <div className="lg:col-span-1">
            <Card className="border-zinc-800 bg-zinc-900 p-5">
              <h2 className="mb-4 text-sm font-semibold text-zinc-100">Portfolio Allocation</h2>
              <AllocationPieChart
                data={allocationData}
                height={280}
                centerLabel={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
