"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#ec4899"];

interface AllocationItem {
  name: string;
  value: number;
  percentage?: number;
}

interface AllocationPieChartProps {
  data: AllocationItem[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: AllocationItem }> }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400">{item.name}</p>
      <p className="font-mono text-sm font-semibold text-zinc-100">
        ${item.value.toLocaleString()}
      </p>
      {item.payload.percentage !== undefined && (
        <p className="font-mono text-[10px] text-zinc-500">{item.payload.percentage.toFixed(1)}%</p>
      )}
    </div>
  );
}

export function AllocationPieChart({
  data,
  height = 280,
  centerLabel,
  centerValue,
  className,
}: AllocationPieChartProps) {
  return (
    <div className={className}>
      <div className="animate-fade-in-up delay-2 relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
              iconType="circle"
              iconSize={6}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center" style={{ marginBottom: 30 }}>
            <span className="font-mono text-lg font-bold text-zinc-100">{centerValue}</span>
            <span className="text-[10px] text-zinc-500">{centerLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
