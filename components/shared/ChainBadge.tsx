import { cn } from "@/lib/utils";

const chainColors: Record<string, string> = {
  Ethereum:  "bg-blue-500",
  Arbitrum:  "bg-sky-400",
  Base:      "bg-blue-300",
  Optimism:  "bg-red-500",
  Polygon:   "bg-purple-500",
  BSC:       "bg-yellow-500",
  Solana:    "bg-gradient-to-r from-purple-500 to-green-400",
  Avalanche: "bg-red-600",
};

interface ChainBadgeProps {
  chain: string;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ChainBadge({ chain, showLabel = true, size = "sm", className }: ChainBadgeProps) {
  const dotColor = chainColors[chain] || "bg-zinc-500";
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "shrink-0 rounded-full",
          size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5",
          dotColor
        )}
      />
      {showLabel && (
        <span className={cn("text-zinc-300", size === "sm" ? "text-xs" : "text-sm")}>
          {chain}
        </span>
      )}
    </span>
  );
}
