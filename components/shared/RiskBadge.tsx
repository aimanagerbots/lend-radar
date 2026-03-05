import { cn } from "@/lib/utils";

const riskColors: Record<string, string> = {
  "A+": "bg-emerald-500/15 text-emerald-400 ring-emerald-500/20",
  "A":  "bg-green-500/15 text-green-400 ring-green-500/20",
  "B+": "bg-yellow-500/15 text-yellow-400 ring-yellow-500/20",
  "B":  "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  "C":  "bg-red-500/15 text-red-400 ring-red-500/20",
};

interface RiskBadgeProps {
  score: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({ score, size = "sm", className }: RiskBadgeProps) {
  const colors = riskColors[score] || riskColors["C"];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-mono font-bold ring-1",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        colors,
        className
      )}
    >
      {score}
    </span>
  );
}
