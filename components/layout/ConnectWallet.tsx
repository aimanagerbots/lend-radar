"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectWalletProps {
  collapsed?: boolean;
}

export function ConnectWallet({ collapsed = false }: ConnectWalletProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none" as const,
                userSelect: "none" as const,
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/10 py-2 text-[13px] font-semibold text-emerald-400 ring-1 ring-emerald-500/20 transition-all duration-150 hover:bg-emerald-500/15 hover:ring-emerald-500/30",
                      collapsed ? "px-2" : "px-3"
                    )}
                  >
                    <Wallet className="h-[18px] w-[18px] shrink-0" />
                    {!collapsed && <span>Connect Wallet</span>}
                  </button>
                );
              }

              return (
                <div
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 transition-all duration-150",
                    collapsed ? "justify-center px-2 py-2" : "px-3 py-2"
                  )}
                >
                  {/* Chain indicator */}
                  <button
                    onClick={openChainModal}
                    className="flex shrink-0 items-center"
                    title={chain.name}
                  >
                    {chain.hasIcon ? (
                      <div
                        className="h-4 w-4 overflow-hidden rounded-full"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className="h-4 w-4"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                    )}
                  </button>

                  {!collapsed && (
                    <button
                      onClick={openAccountModal}
                      className="flex min-w-0 flex-1 items-center gap-2"
                    >
                      <span className="truncate font-mono text-xs text-zinc-300">
                        {account.displayName}
                      </span>
                      {account.displayBalance && (
                        <span className="shrink-0 text-[11px] text-zinc-500">
                          {account.displayBalance}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
