"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TimeRangeSelector } from "@/components/shared/TimeRangeSelector";

interface DataPoint {
  date: string;
  value: number;
}

interface PortfolioValueChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="font-mono text-[10px] text-zinc-500">{label}</p>
      <p className="font-mono text-sm font-semibold text-emerald-400">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export function PortfolioValueChart({ data, height = 280, className }: PortfolioValueChartProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
  const days = daysMap[timeRange] || 30;
  const sliced = data.slice(-days);

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-mono text-sm font-semibold text-zinc-200">Portfolio Value</h3>
        <TimeRangeSelector options={["7d", "30d", "90d"]} selected={timeRange} onSelect={setTimeRange} />
      </div>
      <div className="animate-fade-in-up delay-1">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={sliced} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
              domain={["dataMin - 1000", "dataMax + 1000"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
