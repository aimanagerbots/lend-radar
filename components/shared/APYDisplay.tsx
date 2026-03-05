import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface APYDisplayProps {
  apy: number;
  change7d?: number;
  size?: "sm" | "md" | "lg";
  showTrend?: boolean;
  className?: string;
}

export function APYDisplay({ apy, change7d, size = "sm", showTrend = true, className }: APYDisplayProps) {
  const isPositiveChange = change7d !== undefined && change7d > 0;
  const isNegativeChange = change7d !== undefined && change7d < 0;

  return (
    <span className={cn("inline-flex items-center gap-1.5 font-mono", className)}>
      <span
        className={cn(
          "font-semibold",
          apy >= 5 ? "text-emerald-400" : "text-zinc-100",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-2xl"
        )}
      >
        {apy.toFixed(2)}%
      </span>
      {showTrend && change7d !== undefined && (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[10px]",
            isPositiveChange && "text-emerald-400",
            isNegativeChange && "text-red-400",
            !isPositiveChange && !isNegativeChange && "text-zinc-500"
          )}
        >
          {isPositiveChange && <TrendingUp className="h-3 w-3" />}
          {isNegativeChange && <TrendingDown className="h-3 w-3" />}
          {!isPositiveChange && !isNegativeChange && <Minus className="h-3 w-3" />}
          {change7d > 0 ? "+" : ""}{change7d.toFixed(2)}%
        </span>
      )}
    </span>
  );
}
