"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

const routeLabels: Record<string, string> = {
  "/": "Rate Explorer",
  "/dashboard": "Dashboard",
  "/opportunities": "Opportunities",
  "/transactions": "Transactions",
  "/alerts": "Alerts",
  "/risk": "Risk Analytics",
  "/analytics": "Analytics",
  "/simulator": "Yield Simulator",
  "/auto-rebalance": "Auto-Rebalance",
  "/treasury": "Treasury Console",
  "/reports": "Reports",
  "/api-docs": "API Docs",
  "/settings": "Settings",
  "/pricing": "Pricing",
};

function getPageLabel(pathname: string): string[] {
  // Handle dynamic routes
  if (pathname.startsWith("/asset/")) {
    const symbol = pathname.split("/")[2]?.toUpperCase() || "Asset";
    return ["Assets", symbol];
  }
  if (pathname.startsWith("/protocol/")) {
    const name = pathname.split("/")[2]?.replace(/-/g, " ") || "Protocol";
    return ["Protocols", name.charAt(0).toUpperCase() + name.slice(1)];
  }
  if (pathname === "/move") return ["Portfolio", "Move Funds"];

  const label = routeLabels[pathname];
  return label ? [label] : ["LendRadar"];
}

export function TopBar() {
  const pathname = usePathname();
  const crumbs = getPageLabel(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-3 pl-14 backdrop-blur-sm md:px-6 md:pl-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 md:inline">
          LendRadar
        </span>
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span className="text-zinc-600">/</span>
            <span
              className={cn(
                "font-medium",
                i === crumbs.length - 1 ? "text-zinc-100" : "text-zinc-400"
              )}
            >
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button onClick={() => window.dispatchEvent(new Event("open-search"))} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-500 transition-colors duration-150 hover:border-zinc-700 hover:text-zinc-400">
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 sm:inline-block">
            <Command className="inline h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-zinc-400 transition-colors duration-150 hover:bg-zinc-800/50 hover:text-zinc-100">
          <Bell className="h-[18px] w-[18px]" />
          {/* Unread indicator */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
          </span>
        </button>

        {/* Wallet status (placeholder - will be replaced by RainbowKit) */}
        <div className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 sm:flex">
          <div className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="font-mono text-xs text-zinc-500">Not connected</span>
        </div>
      </div>
      <GlobalSearch />
    </header>
  );
}
