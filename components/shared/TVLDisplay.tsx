import { cn } from "@/lib/utils";

function formatTVL(tvl: number): string {
  if (tvl >= 1_000_000_000) return `$${(tvl / 1_000_000_000).toFixed(1)}B`;
  if (tvl >= 1_000_000) return `$${(tvl / 1_000_000).toFixed(1)}M`;
  if (tvl >= 1_000) return `$${(tvl / 1_000).toFixed(1)}K`;
  return `$${tvl.toFixed(0)}`;
}

interface TVLDisplayProps {
  tvl: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TVLDisplay({ tvl, size = "sm", className }: TVLDisplayProps) {
  return (
    <span
      className={cn(
        "font-mono font-medium text-zinc-300",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-xl",
        className
      )}
    >
      {formatTVL(tvl)}
    </span>
  );
}

export { formatTVL };
