"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/lib/sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  Coins,
  Shield,
  LayoutDashboard,
  TrendingUp,
  History,
  Bell,
  ShieldAlert,
  BarChart3,
  Calculator,
  RefreshCw,
  Building2,
  FileText,
  Code2,
  Settings,
  Moon,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  badge?: "pro" | "institutional";
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "EXPLORE",
    items: [
      { label: "Rate Explorer", href: "/", icon: Home },
      { label: "Assets", href: "/asset/USDC", icon: Coins },
      { label: "Protocols", href: "/protocol/aave-v3", icon: Shield },
    ],
  },
  {
    title: "MY PORTFOLIO",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Opportunities", href: "/opportunities", icon: TrendingUp },
      { label: "Transactions", href: "/transactions", icon: History },
      { label: "Alerts", href: "/alerts", icon: Bell },
    ],
  },
  {
    title: "PRO TOOLS",
    badge: "pro",
    items: [
      { label: "Risk Analytics", href: "/risk", icon: ShieldAlert },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Yield Simulator", href: "/simulator", icon: Calculator },
      { label: "Auto-Rebalance", href: "/auto-rebalance", icon: RefreshCw },
    ],
  },
  {
    title: "INSTITUTIONAL",
    badge: "institutional",
    items: [
      { label: "Treasury Console", href: "/treasury", icon: Building2 },
      { label: "Reports", href: "/reports", icon: FileText },
      { label: "API Docs", href: "/api-docs", icon: Code2 },
    ],
  },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    const link = (
      <Link
        href={item.href}
        className={cn(
          "group relative mx-2 flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
          active
            ? "bg-emerald-500/8 text-zinc-50"
            : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
        )}
      >
        {/* Active accent bar */}
        {active && (
          <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
        )}
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 transition-colors duration-150",
            active
              ? "text-emerald-400"
              : "text-zinc-500 group-hover:text-zinc-300"
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={12}
            className="border-zinc-700 bg-zinc-800 text-zinc-100"
          >
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return link;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-zinc-800/80 bg-zinc-950 transition-[width] duration-200 ease-out",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-zinc-800/80",
          collapsed ? "justify-center px-2" : "gap-2.5 px-4"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <Zap className="h-4 w-4 text-emerald-400" />
        </div>
        {!collapsed && (
          <span className="font-mono text-sm font-bold tracking-tight">
            <span className="text-zinc-100">LEND</span>
            <span className="text-emerald-400">RADAR</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin">
        {navSections.map((section, si) => (
          <div key={section.title} className={cn(si > 0 && "mt-2")}>
            {/* Section header */}
            {!collapsed ? (
              <div className="mb-1 flex items-center gap-2 px-5 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-zinc-600">
                  {section.title}
                </span>
                {section.badge === "pro" && (
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-500">
                    Pro
                  </span>
                )}
                {section.badge === "institutional" && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-500">
                    Inst
                  </span>
                )}
              </div>
            ) : (
              si > 0 && <div className="mx-auto my-2 h-px w-6 bg-zinc-800/80" />
            )}

            {/* Items */}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-zinc-800/80 py-3">
        {/* Settings */}
        <NavLink item={{ label: "Settings", href: "/settings", icon: Settings }} />

        {/* Dark mode */}
        <button
          className={cn(
            "mx-2 mt-0.5 flex w-[calc(100%-16px)] items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium text-zinc-400 transition-colors duration-150 hover:bg-zinc-800/60 hover:text-zinc-200"
          )}
        >
          <Moon className="h-[18px] w-[18px] shrink-0 text-zinc-500" />
          {!collapsed && <span>Dark Mode</span>}
        </button>

        {/* Connect Wallet */}
        <div className="mx-2 mt-2">
          <button
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-2 text-[13px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition-all duration-150 hover:bg-emerald-500/15 hover:ring-emerald-500/30",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <Wallet className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Connect Wallet</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="mx-2 mt-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-md px-2.5 py-1.5 text-[13px] text-zinc-500 transition-colors duration-150 hover:bg-zinc-800/60 hover:text-zinc-300"
        >
          {collapsed ? (
            <ChevronRight className="h-[18px] w-[18px] shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-[18px] w-[18px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
