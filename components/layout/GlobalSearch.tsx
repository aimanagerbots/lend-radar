"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Coins, Shield, FileText } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const assets = [
  { label: "USDC", href: "/asset/USDC" },
  { label: "USDT", href: "/asset/USDT" },
  { label: "ETH", href: "/asset/ETH" },
  { label: "WBTC", href: "/asset/WBTC" },
  { label: "DAI", href: "/asset/DAI" },
  { label: "WETH", href: "/asset/WETH" },
  { label: "wstETH", href: "/asset/wstETH" },
  { label: "cbETH", href: "/asset/cbETH" },
];

const protocols = [
  { label: "Aave V3", slug: "aave-v3" },
  { label: "Morpho Blue", slug: "morpho-blue" },
  { label: "Compound V3", slug: "compound-v3" },
  { label: "Spark", slug: "spark" },
  { label: "Venus", slug: "venus" },
  { label: "Kamino", slug: "kamino" },
];

const pages = [
  { label: "Rate Explorer", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Alerts", href: "/alerts" },
  { label: "Risk Analytics", href: "/risk" },
  { label: "Analytics", href: "/analytics" },
  { label: "Simulator", href: "/simulator" },
  { label: "Settings", href: "/settings" },
  { label: "Pricing", href: "/pricing" },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const openDialog = useCallback(() => setOpen(true), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-search", openDialog);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-search", openDialog);
    };
  }, [openDialog]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search assets, protocols, pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Assets">
          {assets.map((asset) => (
            <CommandItem
              key={asset.href}
              value={asset.label}
              onSelect={() => navigate(asset.href)}
            >
              <Coins className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
              {asset.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Protocols">
          {protocols.map((protocol) => (
            <CommandItem
              key={protocol.slug}
              value={protocol.label}
              onSelect={() => navigate(`/protocol/${protocol.slug}`)}
            >
              <Shield className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
              {protocol.label}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              value={page.label}
              onSelect={() => navigate(page.href)}
            >
              <FileText className="mr-2 h-4 w-4 shrink-0 text-zinc-400" />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
