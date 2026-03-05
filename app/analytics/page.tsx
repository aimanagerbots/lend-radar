"use client";

import { useState, useMemo } from "react";
import {
  mockHistoricalData,
  historicalProtocols,
  historicalAssets,
  getMultiProtocolHistory,
} from "@/lib/mock/historical";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APYHistoryChart } from "@/components/charts/APYHistoryChart";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const [selectedAsset, setSelectedAsset] = useState("USDC");
  const [timeRange, setTimeRange] = useState("90d");

  const daysMap: Record<string, number> = {
    "7d": 7,
    "30d": 30,
    "90d": 90,
    "1y": 365,
  };
  const days = daysMap[timeRange] || 90;

  const chartData = useMemo(() => {
    return getMultiProtocolHistory(selectedAsset, historicalProtocols, days);
  }, [selectedAsset, days]);

  // Compute summary stats for the selected asset
  const stats = useMemo(() => {
    const assetData = mockHistoricalData[selectedAsset];
    if (!assetData) return [];

    return historicalProtocols.map((protocol) => {
      const data = assetData[protocol];
      if (!data || data.length === 0) return { protocol, current: 0, avg: 0, min: 0, max: 0 };
      const sliced = days >= 90 ? data : data.slice(-days);
      const values = sliced.map((d) => d.apy);
      const current = values[values.length - 1];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      return { protocol, current, avg, min, max };
    });
  }, [selectedAsset, days]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Historical APY trends across protocols and assets.
          </p>
        </div>

        {/* Controls */}
        <div className="animate-fade-in-up delay-1 mb-6 flex flex-wrap items-center gap-4">
          {/* Asset Selector Tabs */}
          <div className="inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
            {historicalAssets.map((asset) => (
              <button
                key={asset}
                onClick={() => setSelectedAsset(asset)}
                className={`rounded-md px-4 py-1.5 font-mono text-xs font-medium transition-all duration-150 ${
                  selectedAsset === asset
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {asset}
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <TimeRangeSelector
            selected={timeRange}
            onSelect={setTimeRange}
            options={["7d", "30d", "90d"]}
          />
        </div>

        {/* Chart */}
        <div className="animate-fade-in-up delay-2 mb-6">
          <Card className="border-zinc-800 bg-zinc-900">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <CardTitle className="font-mono text-sm text-zinc-300">
                  {selectedAsset} APY History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <APYHistoryChart protocols={chartData} height={400} />
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats Table */}
        <div className="animate-fade-in-up delay-3">
          <Card className="border-zinc-800 bg-zinc-900 overflow-hidden">
            <CardHeader>
              <CardTitle className="font-mono text-sm text-zinc-300">
                {selectedAsset} Rate Summary ({timeRange})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                        Protocol
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Current APY
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Avg APY
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Min
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Max
                      </th>
                      <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                        Range
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s) => (
                      <tr
                        key={s.protocol}
                        className="border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30"
                      >
                        <td className="px-4 py-3 font-mono text-sm font-semibold text-zinc-200">
                          {s.protocol}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-emerald-400">
                          {s.current.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-zinc-300">
                          {s.avg.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-zinc-500">
                          {s.min.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-zinc-500">
                          {s.max.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-zinc-600">
                          {(s.max - s.min).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
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
