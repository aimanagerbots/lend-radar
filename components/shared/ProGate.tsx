import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import Link from "next/link";

interface ProGateProps {
  tier?: "pro" | "institutional";
  children: React.ReactNode;
  className?: string;
}

export function ProGate({ tier = "pro", children, className }: ProGateProps) {
  const label = tier === "pro" ? "Pro" : "Institutional";
  const price = tier === "pro" ? "$39/mo" : "$499/mo";

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-zinc-950/60 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 ring-1 ring-zinc-700">
            <Lock className="h-5 w-5 text-zinc-400" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold text-zinc-200">
              Upgrade to {label}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              Starting at {price}
            </p>
          </div>
          <Link
            href="/pricing"
            className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition-colors hover:bg-emerald-500/20"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
