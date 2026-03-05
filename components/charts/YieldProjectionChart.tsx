"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface ProjectionPoint {
  date: string;
  projected: number;
  savings?: number;
}

interface YieldProjectionChartProps {
  data: ProjectionPoint[];
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
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function YieldProjectionChart({ data, height = 300, className }: YieldProjectionChartProps) {
  const hasComparison = data.some((d) => d.savings !== undefined);

  return (
    <div className={className}>
      <div className="animate-fade-in-up delay-1">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={{ stroke: "#27272a" }}
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            {data.length > 0 && (
              <ReferenceLine
                y={data[0].projected}
                stroke="#3f3f46"
                strokeDasharray="3 3"
                label={{ value: "Principal", fill: "#52525b", fontSize: 10, fontFamily: "var(--font-mono)" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="projected"
              name="DeFi Yield"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            {hasComparison && (
              <Line
                type="monotone"
                dataKey="savings"
                name="Savings Account"
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
