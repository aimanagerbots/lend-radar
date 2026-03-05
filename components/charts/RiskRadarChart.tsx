"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { RiskFactor } from "@/lib/types";

const FACTOR_LABELS: Record<keyof RiskFactor, string> = {
  smartContractSecurity: "Smart Contract",
  tvlStability: "TVL Stability",
  teamReputation: "Team",
  auditCoverage: "Audit",
  oracleReliability: "Oracle",
  historicalPerformance: "History",
};

interface RiskRadarChartProps {
  factors: RiskFactor;
  comparisonFactors?: RiskFactor;
  comparisonLabel?: string;
  label?: string;
  height?: number;
  className?: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 shadow-xl">
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">{entry.name}</span>
          <span className="font-mono text-xs font-semibold text-zinc-100">
            {entry.value}/100
          </span>
        </div>
      ))}
    </div>
  );
}

export function RiskRadarChart({
  factors,
  comparisonFactors,
  label = "Score",
  comparisonLabel = "Comparison",
  height = 300,
  className,
}: RiskRadarChartProps) {
  const data = (Object.keys(FACTOR_LABELS) as Array<keyof RiskFactor>).map((key) => ({
    factor: FACTOR_LABELS[key],
    [label]: factors[key],
    ...(comparisonFactors ? { [comparisonLabel]: comparisonFactors[key] } : {}),
  }));

  return (
    <div className={className}>
      <div className="animate-fade-in-up delay-2">
        <ResponsiveContainer width="100%" height={height}>
          <RadarChart data={data} cx="50%" cy="50%">
            <PolarGrid stroke="#27272a" />
            <PolarAngleAxis
              dataKey="factor"
              tick={{ fill: "#71717a", fontSize: 10, fontFamily: "var(--font-mono)" }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#52525b", fontSize: 9, fontFamily: "var(--font-mono)" }}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name={label}
              dataKey={label}
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            {comparisonFactors && (
              <Radar
                name={comparisonLabel}
                dataKey={comparisonLabel}
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
