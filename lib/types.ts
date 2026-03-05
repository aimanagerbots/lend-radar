export interface DefiLlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number | null;
  apyReward: number | null;
  apy: number;
  rewardTokens: string[] | null;
  poolMeta: string | null;
  underlyingTokens: string[] | null;
  url: string;
}

// Portfolio types
export interface Position {
  id: string;
  asset: string;
  protocol: string;
  chain: string;
  chainIcon: string;
  deposited: number;
  currentValue: number;
  apy: number;
  apyChange7d: number;
  dailyYield: number;
  riskScore: string;
  depositDate: string;
  daysActive: number;
  totalEarned: number;
}

export interface Portfolio {
  walletAddress: string;
  totalValue: number;
  totalDailyYield: number;
  totalWeeklyYield: number;
  totalMonthlyYield: number;
  weightedAvgAPY: number;
  positions: Position[];
}

// Opportunity types
export interface Opportunity {
  id: string;
  type: "rate_improvement" | "risk_alert" | "new_opportunity";
  severity: "high" | "medium" | "low";
  asset: string;
  currentProtocol: string | null;
  currentChain: string | null;
  currentAPY: number | null;
  suggestedProtocol: string;
  suggestedChain: string;
  suggestedAPY: number;
  riskScore: string;
  estimatedAnnualGain: number | null;
  estimatedGasCost: number;
  estimatedBridgeCost: number;
  netGainYear1: number | null;
  affectedAmount: number | null;
  confidence: number;
  reasoning: string;
  timestamp: string;
}

// Transaction types
export interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "rebalance";
  asset: string;
  amount: number;
  fromChain: string | null;
  fromProtocol: string | null;
  toChain: string;
  toProtocol: string;
  apyAtTime: number;
  previousAPY?: number;
  gasCost: number;
  bridgeCost: number;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  txHash: string;
}

// Risk types
export interface RiskFactor {
  smartContractSecurity: number;
  tvlStability: number;
  teamReputation: number;
  auditCoverage: number;
  oracleReliability: number;
  historicalPerformance: number;
}

export interface ExploitRecord {
  date: string;
  description: string;
  amountLost: number;
  recovered: boolean;
}

export interface ProtocolRisk {
  name: string;
  overallScore: string;
  numericScore: number;
  auditStatus: string;
  lastAudit: string;
  exploitHistory: ExploitRecord[];
  tvl: number;
  tvlTrend30d: number;
  chains: string[];
  insuranceAvailable: boolean;
  governanceToken: string;
  timeInMarket: string;
  oracleDependency: string;
  factors: RiskFactor;
}

// Alert types
export interface Alert {
  id: string;
  type: "rate_drop" | "rate_spike" | "tvl_drop" | "new_opportunity";
  active: boolean;
  asset: string | null;
  condition: string;
  protocol: string | null;
  chain: string | null;
  channel: string;
  createdAt: string;
  lastTriggered: string | null;
  triggerCount: number;
}

// Treasury types
export interface TreasuryAllocation {
  protocol: string;
  chain: string;
  asset: string;
  amount: number;
  apy: number;
  riskScore: string;
  percentOfTotal: number;
}

export interface Treasury {
  orgName: string;
  totalAUM: number;
  totalMonthlyYield: number;
  weightedAvgAPY: number;
  signers: { address: string; name: string; role: string }[];
  policies: {
    maxSingleProtocolExposure: number;
    minRiskScore: string;
    minTVL: number;
    rebalanceFrequency: string;
    requiredSignatures: number;
  };
  allocations: TreasuryAllocation[];
  monthlyReports: {
    month: string;
    totalYield: number;
    avgAPY: number;
    rebalances: number;
    protocolsUsed: number;
  }[];
}

// Historical types
export interface HistoricalDataPoint {
  date: string;
  apy: number;
}
