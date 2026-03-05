"use client";

import { Card } from "@/components/ui/card";

const endpoints = [
  {
    method: "GET",
    path: "/api/rates",
    description:
      "Returns current lending and borrowing rates across all supported protocols and chains. Supports optional query parameters for filtering by chain, asset, or protocol.",
    params: "?chain=ethereum&asset=USDC&protocol=aave-v3",
    response: `{
  "data": [
    {
      "protocol": "Aave V3",
      "chain": "Ethereum",
      "asset": "USDC",
      "supplyAPY": 4.12,
      "borrowAPY": 5.87,
      "tvl": 2450000000,
      "riskScore": "A+",
      "updatedAt": "2026-03-05T12:00:00Z"
    }
  ],
  "meta": { "total": 1, "page": 1 }
}`,
  },
  {
    method: "GET",
    path: "/api/rates/:asset",
    description:
      "Returns rates for a specific asset across all protocols and chains. Useful for comparing where to get the best yield for a particular token.",
    params: "",
    response: `{
  "asset": "USDC",
  "rates": [
    {
      "protocol": "Morpho Blue",
      "chain": "Base",
      "supplyAPY": 7.82,
      "borrowAPY": 9.14,
      "tvl": 890000000
    },
    {
      "protocol": "Aave V3",
      "chain": "Ethereum",
      "supplyAPY": 4.12,
      "borrowAPY": 5.87,
      "tvl": 2450000000
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/protocols",
    description:
      "Returns a list of all supported protocols with their metadata including supported chains, total TVL, audit status, and risk scores.",
    params: "",
    response: `{
  "protocols": [
    {
      "name": "Aave V3",
      "slug": "aave-v3",
      "chains": ["Ethereum", "Arbitrum", "Optimism", "Base"],
      "totalTVL": 12500000000,
      "riskScore": "A+",
      "audited": true,
      "website": "https://aave.com"
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/historical/:asset",
    description:
      "Returns historical APY data for a specific asset. Supports time range filtering. Default window is 30 days with daily granularity.",
    params: "?range=30d&granularity=daily&protocol=aave-v3",
    response: `{
  "asset": "USDC",
  "protocol": "Aave V3",
  "chain": "Ethereum",
  "history": [
    { "date": "2026-03-04", "supplyAPY": 4.08 },
    { "date": "2026-03-03", "supplyAPY": 4.15 },
    { "date": "2026-03-02", "supplyAPY": 3.98 }
  ]
}`,
  },
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up delay-1">
          <h1 className="text-2xl font-bold text-zinc-100">API Documentation</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Access real-time DeFi lending rates programmatically
          </p>
        </div>

        {/* Auth Section */}
        <Card className="animate-fade-in-up delay-2 mb-8 border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Authentication
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            All API requests require an API key passed via the{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
              Authorization
            </code>{" "}
            header.
          </p>
          <div className="rounded-lg bg-zinc-800 p-4">
            <pre className="font-mono text-sm text-zinc-300">
              <span className="text-zinc-500"># Example request</span>
              {"\n"}curl -H{" "}
              <span className="text-emerald-400">
                {'"'}Authorization: Bearer lr_live_your_api_key{'"'}
              </span>{" "}
              \{"\n"}
              {"  "}https://api.lendradar.io/api/rates
            </pre>
          </div>
          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="text-xs text-zinc-500">
              <span className="font-semibold text-zinc-400">Rate Limits:</span>{" "}
              Free: 100 req/day &middot; Pro: 10,000 req/mo &middot; Institutional: Unlimited
            </p>
          </div>
        </Card>

        {/* Base URL */}
        <Card className="animate-fade-in-up delay-2 mb-8 border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Base URL
            </span>
            <code className="rounded bg-zinc-800 px-3 py-1.5 font-mono text-sm text-zinc-200">
              https://api.lendradar.io
            </code>
          </div>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6">
          {endpoints.map((endpoint, i) => (
            <Card
              key={endpoint.path}
              className={`animate-fade-in-up delay-${i + 3} border-zinc-800 bg-zinc-900 p-6`}
            >
              {/* Method + Path */}
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400">
                  {endpoint.method}
                </span>
                <code className="font-mono text-sm text-zinc-100">{endpoint.path}</code>
                {endpoint.params && (
                  <code className="font-mono text-xs text-zinc-600">{endpoint.params}</code>
                )}
              </div>

              {/* Description */}
              <p className="mb-4 text-sm text-zinc-400">{endpoint.description}</p>

              {/* Response */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
                  Example Response
                </p>
                <div className="overflow-x-auto rounded-lg bg-zinc-800 p-4">
                  <pre className="font-mono text-xs leading-relaxed text-zinc-300">
                    {endpoint.response}
                  </pre>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 animate-fade-in-up delay-5 text-center">
          <p className="text-xs text-zinc-600">
            Need help? Contact{" "}
            <span className="text-zinc-400">api-support@lendradar.io</span> or join our{" "}
            <span className="text-emerald-500">Discord</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
