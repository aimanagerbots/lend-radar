"use client";

import { useState } from "react";
import { mockRiskScores } from "@/lib/mock/risk-scores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { RiskRadarChart } from "@/components/charts/RiskRadarChart";
import { Shield, CheckCircle, XCircle } from "lucide-react";

function formatTVL(tvl: number): string {
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(0)}M`;
  return `$${tvl.toLocaleString()}`;
}

export default function RiskPage() {
  const [selectedProtocol, setSelectedProtocol] = useState(0);
  const protocols = mockRiskScores.protocols;
  const selected = protocols[selectedProtocol];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="animate-fade-in-up mb-8">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
            Risk Analytics
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Compare protocol risk scores, audit status, and security factors across all tracked protocols.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Protocol Comparison Table */}
          <div className="animate-fade-in-up delay-1 lg:col-span-2">
            <Card className="border-zinc-800 bg-zinc-900 overflow-hidden">
              <CardHeader>
                <CardTitle className="font-mono text-sm text-zinc-300">
                  Protocol Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Protocol
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Score
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                          Numeric
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                          TVL
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                          TVL 30d
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 text-right">
                          Chains
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Insurance
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Time
                        </th>
                        <th className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          Audit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {protocols.map((protocol, idx) => (
                        <tr
                          key={protocol.name}
                          onClick={() => setSelectedProtocol(idx)}
                          className={`cursor-pointer border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30 ${
                            selectedProtocol === idx ? "bg-zinc-800/50" : ""
                          }`}
                        >
                          <td className="px-4 py-3 font-mono text-sm font-semibold text-zinc-200">
                            {protocol.name}
                          </td>
                          <td className="px-4 py-3">
                            <RiskBadge score={protocol.overallScore} size="sm" />
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm text-zinc-300">
                            {protocol.numericScore}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm text-zinc-300">
                            {formatTVL(protocol.tvl)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`font-mono text-sm ${
                                protocol.tvlTrend30d >= 0
                                  ? "text-emerald-400"
                                  : "text-red-400"
                              }`}
                            >
                              {protocol.tvlTrend30d >= 0 ? "+" : ""}
                              {protocol.tvlTrend30d.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm text-zinc-400">
                            {protocol.chains.length}
                          </td>
                          <td className="px-4 py-3">
                            {protocol.insuranceAvailable ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-zinc-600" />
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                            {protocol.timeInMarket}
                          </td>
                          <td className="px-4 py-3 text-xs text-zinc-500 max-w-[200px] truncate">
                            {protocol.auditStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart for Selected Protocol */}
          <div className="animate-fade-in-up delay-2">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <CardTitle className="font-mono text-sm text-zinc-300">
                    {selected.name} Risk Profile
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <RiskBadge score={selected.overallScore} size="md" />
                  <span className="font-mono text-lg font-bold text-zinc-200">
                    {selected.numericScore}/100
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <RiskRadarChart
                  factors={selected.factors}
                  label={selected.name}
                  height={280}
                />

                {/* Protocol details */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">TVL</span>
                    <span className="font-mono text-zinc-300">
                      {formatTVL(selected.tvl)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Chains</span>
                    <span className="font-mono text-zinc-300">
                      {selected.chains.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Oracle</span>
                    <span className="font-mono text-zinc-300">
                      {selected.oracleDependency}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Gov Token</span>
                    <span className="font-mono text-zinc-300">
                      {selected.governanceToken}
                    </span>
                  </div>
                  {selected.exploitHistory.length > 0 && (
                    <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1">
                        Exploit History
                      </p>
                      {selected.exploitHistory.map((exploit, i) => (
                        <p key={i} className="text-xs text-red-300/70">
                          {exploit.date}: {exploit.description} ($
                          {(exploit.amountLost / 1e6).toFixed(0)}M
                          {exploit.recovered ? " - recovered" : " - not recovered"})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
