export const mockTreasury = {
  orgName: "Horizon DAO",
  totalAUM: 14250000.00,
  totalMonthlyYield: 71250.00,
  weightedAvgAPY: 6.00,
  signers: [
    { address: "0xaaa...111", name: "Treasury Lead", role: "admin" },
    { address: "0xbbb...222", name: "Finance Council", role: "manager" },
    { address: "0xccc...333", name: "Community Multisig", role: "signer" },
  ],
  policies: {
    maxSingleProtocolExposure: 0.30,
    minRiskScore: "B+",
    minTVL: 500000000,
    rebalanceFrequency: "weekly",
    requiredSignatures: 2,
  },
  allocations: [
    { protocol: "Aave V3", chain: "Ethereum", asset: "USDC", amount: 5000000, apy: 4.12, riskScore: "A+", percentOfTotal: 35.1 },
    { protocol: "Morpho Blue", chain: "Base", asset: "USDC", amount: 3500000, apy: 7.82, riskScore: "A", percentOfTotal: 24.6 },
    { protocol: "Spark", chain: "Ethereum", asset: "DAI", amount: 2750000, apy: 5.21, riskScore: "A+", percentOfTotal: 19.3 },
    { protocol: "Compound V3", chain: "Arbitrum", asset: "USDC", amount: 2000000, apy: 5.58, riskScore: "A", percentOfTotal: 14.0 },
    { protocol: "Aave V3", chain: "Optimism", asset: "ETH", amount: 1000000, apy: 3.41, riskScore: "A+", percentOfTotal: 7.0 },
  ],
  monthlyReports: [
    { month: "2026-02", totalYield: 68400, avgAPY: 5.76, rebalances: 2, protocolsUsed: 5 },
    { month: "2026-01", totalYield: 62100, avgAPY: 5.23, rebalances: 3, protocolsUsed: 4 },
    { month: "2025-12", totalYield: 58900, avgAPY: 4.96, rebalances: 1, protocolsUsed: 4 },
  ],
};
