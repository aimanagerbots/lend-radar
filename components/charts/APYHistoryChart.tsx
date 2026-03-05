"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";
import type { HistoricalDataPoint } from "@/lib/types";

const PROTOCOL_COLORS: Record<string, string> = {
  "Aave V3": "#3b82f6",
  "Morpho Blue": "#10b981",
  "Compound V3": "#f59e0b",
  "Spark": "#8b5cf6",
  "Venus": "#ef4444",
  "Kamino": "#06b6d4",
};

interface ProtocolData {
  protocol: string;
  data: HistoricalDataPoint[];
}

interface APYHistoryChartProps {
  protocols: ProtocolData[];
  height?: number;
  className?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="mb-1 font-mono text-[10px] text-zinc-500">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-zinc-400">{entry.name}</span>
          <span className="ml-auto font-mono text-xs font-semibold text-zinc-100">
            {entry.value.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function APYHistoryChart({ protocols, height = 350, className }: APYHistoryChartProps) {
  const [timeRange, setTimeRange] = useState("90d");

  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = daysMap[timeRange] || 90;

  // Merge data by date
  const mergedData: Record<string, Record<string, number>> = {};
  protocols.forEach(({ protocol, data }) => {
    const sliced = data.slice(-days);
    sliced.forEach(({ date, apy }) => {
      if (!mergedData[date]) mergedData[date] = {};
      mergedData[date][protocol] = apy;
    });
  });

  const chartData = Object.entries(mergedData)
    .map(([date, values]) => ({ date, ...values }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-zinc-200">APY History</h3>
        <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
      </div>
      <div className="animate-fade-in-up delay-1">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v}%`}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              iconType="circle"
              iconSize={6}
            />
            {protocols.map(({ protocol }) => (
              <Line
                key={protocol}
                type="monotone"
                dataKey={protocol}
                stroke={PROTOCOL_COLORS[protocol] || "#71717a"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
