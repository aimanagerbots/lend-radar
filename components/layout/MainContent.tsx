"use client";

import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-[padding-left] duration-200 ease-out",
        collapsed ? "pl-[64px]" : "pl-[240px]"
      )}
    >
      <TopBar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
