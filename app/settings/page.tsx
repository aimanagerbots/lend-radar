"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        enabled ? "bg-emerald-500" : "bg-zinc-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [telegramNotifs, setTelegramNotifs] = useState(false);
  const [apyAlerts, setApyAlerts] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [defaultChain, setDefaultChain] = useState("all");
  const [defaultSort, setDefaultSort] = useState("apy-desc");
  const [currency, setCurrency] = useState("usd");

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold text-zinc-100">Settings</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your account preferences and configuration
          </p>
        </div>

        {/* Profile Section */}
        <Card className="animate-fade-in-up delay-2 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Connected Wallet
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-sm text-zinc-300">
                  0x7a16...f842e9
                </span>
                <span className="ml-auto rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  Connected
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter display name"
                defaultValue="anon_whale"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 outline-none transition-colors focus:border-emerald-500/50"
              />
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="animate-fade-in-up delay-3 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Email Notifications</p>
                <p className="text-xs text-zinc-500">Receive rate alerts and reports via email</p>
              </div>
              <Toggle enabled={emailNotifs} onToggle={() => setEmailNotifs(!emailNotifs)} />
            </div>
            <div className="border-t border-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Telegram Notifications</p>
                <p className="text-xs text-zinc-500">Get real-time alerts on Telegram</p>
              </div>
              <Toggle enabled={telegramNotifs} onToggle={() => setTelegramNotifs(!telegramNotifs)} />
            </div>
            <div className="border-t border-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">APY Change Alerts</p>
                <p className="text-xs text-zinc-500">Notify when APY moves more than 0.5%</p>
              </div>
              <Toggle enabled={apyAlerts} onToggle={() => setApyAlerts(!apyAlerts)} />
            </div>
            <div className="border-t border-zinc-800" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-200">Risk Score Alerts</p>
                <p className="text-xs text-zinc-500">Notify on risk score downgrades</p>
              </div>
              <Toggle enabled={riskAlerts} onToggle={() => setRiskAlerts(!riskAlerts)} />
            </div>
          </div>
        </Card>

        {/* Display Preferences */}
        <Card className="animate-fade-in-up delay-4 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Display Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Default Chain
              </label>
              <select
                value={defaultChain}
                onChange={(e) => setDefaultChain(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
              >
                <option value="all">All Chains</option>
                <option value="ethereum">Ethereum</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="base">Base</option>
                <option value="optimism">Optimism</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
                <option value="solana">Solana</option>
                <option value="avalanche">Avalanche</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Default Sort
              </label>
              <select
                value={defaultSort}
                onChange={(e) => setDefaultSort(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
              >
                <option value="apy-desc">APY (Highest First)</option>
                <option value="apy-asc">APY (Lowest First)</option>
                <option value="tvl-desc">TVL (Highest First)</option>
                <option value="risk-asc">Risk Score (Best First)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-500">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors focus:border-emerald-500/50"
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (&#8364;)</option>
                <option value="gbp">GBP (&#163;)</option>
                <option value="eth">ETH</option>
                <option value="btc">BTC</option>
              </select>
            </div>
          </div>
        </Card>

        {/* API Keys Section */}
        <Card className="animate-fade-in-up delay-5 mb-6 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            API Keys
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Production Key</p>
                  <p className="mt-1 font-mono text-sm text-zinc-300">lr_live_****************************a3f8</p>
                </div>
                <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300">
                  Reveal
                </button>
              </div>
              <p className="mt-2 text-[10px] text-zinc-600">Created Feb 14, 2026 &middot; Last used 2h ago</p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500">Test Key</p>
                  <p className="mt-1 font-mono text-sm text-zinc-300">lr_test_****************************9b2d</p>
                </div>
                <button className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300">
                  Reveal
                </button>
              </div>
              <p className="mt-2 text-[10px] text-zinc-600">Created Jan 03, 2026 &middot; Last used 5d ago</p>
            </div>
            <button className="w-full rounded-lg border border-dashed border-zinc-700 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:border-emerald-500/50 hover:text-emerald-400">
              + Generate New API Key
            </button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="animate-fade-in-up delay-5 flex justify-end">
          <button className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
