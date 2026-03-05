"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const PROTOCOL_COLORS: Record<string, string> = {
  "Aave V3": "#3b82f6",
  "Morpho Blue": "#10b981",
  "Compound V3": "#f59e0b",
  "Spark": "#8b5cf6",
  "Venus": "#ef4444",
  "Kamino": "#06b6d4",
};

interface TVLFlowChartProps {
  data: Array<Record<string, string | number>>;
  protocols: string[];
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
            ${(entry.value / 1e6).toFixed(0)}M
          </span>
        </div>
      ))}
    </div>
  );
}

export function TVLFlowChart({ data, protocols, height = 300, className }: TVLFlowChartProps) {
  return (
    <div className={className}>
      <div className="animate-fade-in-up delay-2">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
            />
            <YAxis
              tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1e9).toFixed(1)}B`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              iconType="circle"
              iconSize={6}
            />
            {protocols.map((protocol) => (
              <Area
                key={protocol}
                type="monotone"
                dataKey={protocol}
                stackId="1"
                stroke={PROTOCOL_COLORS[protocol] || "#71717a"}
                fill={PROTOCOL_COLORS[protocol] || "#71717a"}
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
