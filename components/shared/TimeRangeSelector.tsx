"use client";

import { cn } from "@/lib/utils";

interface TimeRangeSelectorProps {
  options?: string[];
  selected: string;
  onSelect: (range: string) => void;
  className?: string;
}

export function TimeRangeSelector({
  options = ["7d", "30d", "90d", "1y"],
  selected,
  onSelect,
  className,
}: TimeRangeSelectorProps) {
  return (
    <div className={cn("inline-flex rounded-lg border border-zinc-800 bg-zinc-900 p-0.5", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          className={cn(
            "rounded-md px-3 py-1 font-mono text-xs font-medium transition-all duration-150",
            selected === opt
              ? "bg-zinc-800 text-zinc-100 shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
