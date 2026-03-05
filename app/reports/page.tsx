"use client";

import { useState } from "react";
import { mockTreasury } from "@/lib/mock/treasury";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  const { monthlyReports } = mockTreasury;
  const [startDate, setStartDate] = useState("2025-12");
  const [endDate, setEndDate] = useState("2026-02");

  const filteredReports = monthlyReports.filter(
    (r) => r.month >= startDate && r.month <= endDate
  );

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold text-zinc-100">Reports</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Monthly yield performance reports and analytics
          </p>
        </div>

        {/* Date Range Filter */}
        <Card className="animate-fade-in-up delay-2 mb-8 border-zinc-800 bg-zinc-900 p-5">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Start Month
              </label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                End Month
              </label>
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50 [color-scheme:dark]"
              />
            </div>
            <button className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
              Apply Filter
            </button>
          </div>
        </Card>

        {/* Export Buttons */}
        <div className="animate-fade-in-up delay-2 mb-6 flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>

        {/* Report Cards */}
        <div className="space-y-4">
          {filteredReports.map((report, i) => (
            <Card
              key={report.month}
              className={`animate-fade-in-up delay-${i + 3} border-zinc-800 bg-zinc-900 p-6`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">{report.month}</h3>
                  <p className="mt-0.5 text-xs text-zinc-500">Monthly Performance Report</p>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
                    +${report.totalYield.toLocaleString()} yield
                  </span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    Total Yield
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-emerald-500">
                    ${report.totalYield.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    Avg APY
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-zinc-100">
                    {report.avgAPY.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    Rebalances
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-zinc-100">
                    {report.rebalances}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                    Protocols Used
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-zinc-100">
                    {report.protocolsUsed}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {filteredReports.length === 0 && (
            <Card className="animate-fade-in-up delay-3 border-zinc-800 bg-zinc-900 p-10 text-center">
              <p className="text-sm text-zinc-500">
                No reports found for the selected date range.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
