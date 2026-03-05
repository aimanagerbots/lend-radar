# LEND RADAR — Front-End Build Blueprint

## Instructions for Claude Code

Read this entire document before creating your task plan. This is the architecture specification for LEND Radar, a DeFi lending rate intelligence platform. You are building the complete front-end with mock data and one live API integration (DefiLlama). There is NO backend to build — all data is either from the DefiLlama API or from local mock data files. Deploy as a static/SSR Next.js site.

---

## Tech Stack (Non-Negotiable)

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State/Data:** TanStack Query for API data, React context for app state
- **Charts:** Recharts
- **Wallet:** wagmi + viem (wallet connect for portfolio scanning — no actual transactions in MVP)
- **Icons:** lucide-react
- **Tables:** @tanstack/react-table
- **Deployment:** Vercel

---

## Live Data Source

**DefiLlama Yields API** — `https://yields.llama.fi/pools`
- Free, no API key required
- Returns ~10,000+ lending/yield pools across 119+ chains and 500+ protocols
- Fields: pool, chain, project, symbol, tvlUsd, apyBase, apyReward, apy, rewardTokens, poolMeta, url
- Updates hourly, cache client-side for 5 minutes
- Also use: `https://yields.llama.fi/chart/{pool}` for historical APY data per pool

Use this LIVE data for: Rate Explorer, Asset Deep Dives, Protocol Profiles (pool listings), Historical Charts.

Use MOCK data for: Portfolio Dashboard, Opportunities Feed, Transaction History, Risk Scores, Treasury Console, Reporting, all Pro/Institutional features.

---

## Mock Data Strategy

Create a `/lib/mock/` directory with the following mock data files. All mock data should feel realistic — real protocol names, real chain names, plausible numbers.

### mock/portfolio.ts
```typescript
export const mockPortfolio = {
  walletAddress: "0x1a2b...9f0e",
  totalValue: 284750.00,
  totalDailyYield: 47.82,
  totalWeeklyYield: 334.74,
  totalMonthlyYield: 1434.60,
  weightedAvgAPY: 6.04,
  positions: [
    {
      id: "pos-1",
      asset: "USDC",
      protocol: "Aave V3",
      chain: "Ethereum",
      chainIcon: "ethereum",
      deposited: 125000.00,
      currentValue: 125412.50,
      apy: 4.12,
      apyChange7d: -0.34,
      dailyYield: 14.11,
      riskScore: "A+",
      depositDate: "2025-11-15",
      daysActive: 110,
      totalEarned: 1552.50,
    },
    {
      id: "pos-2",
      asset: "USDC",
      protocol: "Morpho Blue",
      chain: "Base",
      chainIcon: "base",
      deposited: 75000.00,
      currentValue: 75891.25,
      apy: 7.82,
      apyChange7d: +1.21,
      dailyYield: 16.07,
      riskScore: "A",
      depositDate: "2025-12-01",
      daysActive: 94,
      totalEarned: 891.25,
    },
    {
      id: "pos-3",
      asset: "ETH",
      protocol: "Spark",
      chain: "Ethereum",
      chainIcon: "ethereum",
      deposited: 52000.00,
      currentValue: 52487.00,
      apy: 3.41,
      apyChange7d: -0.08,
      dailyYield: 4.86,
      riskScore: "A+",
      depositDate: "2026-01-10",
      daysActive: 54,
      totalEarned: 487.00,
    },
    {
      id: "pos-4",
      asset: "WBTC",
      protocol: "Compound V3",
      chain: "Arbitrum",
      chainIcon: "arbitrum",
      deposited: 32750.00,
      currentValue: 33109.80,
      apy: 5.58,
      apyChange7d: +0.42,
      dailyYield: 5.01,
      riskScore: "A",
      depositDate: "2026-01-22",
      daysActive: 42,
      totalEarned: 359.80,
    },
    {
      id: "pos-5",
      asset: "DAI",
      protocol: "Venus",
      chain: "BSC",
      chainIcon: "bsc",
      deposited: 0,
      currentValue: 7850.45,
      apy: 8.94,
      apyChange7d: +2.15,
      dailyYield: 7.77,
      riskScore: "B+",
      depositDate: "2026-02-14",
      daysActive: 19,
      totalEarned: 50.45,
    },
  ],
};
```

### mock/opportunities.ts
```typescript
export const mockOpportunities = [
  {
    id: "opp-1",
    type: "rate_improvement",
    severity: "high",
    asset: "USDC",
    currentProtocol: "Aave V3",
    currentChain: "Ethereum",
    currentAPY: 4.12,
    suggestedProtocol: "Morpho Blue",
    suggestedChain: "Base",
    suggestedAPY: 7.82,
    riskScore: "A",
    estimatedAnnualGain: 2775.00,
    estimatedGasCost: 12.50,
    estimatedBridgeCost: 3.20,
    netGainYear1: 2759.30,
    affectedAmount: 75000.00,
    confidence: 0.92,
    reasoning: "Morpho Blue on Base has maintained 7%+ APY for 45 consecutive days with growing TVL. Smart contract audited by Spearbit. Base bridge costs under $5.",
    timestamp: "2026-03-05T08:30:00Z",
  },
  {
    id: "opp-2",
    type: "risk_alert",
    severity: "medium",
    asset: "DAI",
    currentProtocol: "Venus",
    currentChain: "BSC",
    currentAPY: 8.94,
    suggestedProtocol: "Spark",
    suggestedChain: "Ethereum",
    suggestedAPY: 5.21,
    riskScore: "A+",
    estimatedAnnualGain: -292.65,
    estimatedGasCost: 8.00,
    estimatedBridgeCost: 5.50,
    netGainYear1: -306.15,
    affectedAmount: 7850.45,
    confidence: 0.78,
    reasoning: "Venus BSC TVL has dropped 18% in 14 days. The elevated APY may indicate depositor flight. Consider moving to a higher-rated protocol even at lower yield.",
    timestamp: "2026-03-05T06:15:00Z",
  },
  {
    id: "opp-3",
    type: "new_opportunity",
    severity: "low",
    asset: "ETH",
    currentProtocol: null,
    currentChain: null,
    currentAPY: null,
    suggestedProtocol: "Kamino",
    suggestedChain: "Solana",
    suggestedAPY: 6.45,
    riskScore: "B+",
    estimatedAnnualGain: null,
    estimatedGasCost: 0.50,
    estimatedBridgeCost: 8.00,
    netGainYear1: null,
    affectedAmount: null,
    confidence: 0.65,
    reasoning: "Kamino on Solana is offering 6.45% on ETH deposits — significantly above the Ethereum mainnet average of 3.2%. Higher risk but interesting for diversification.",
    timestamp: "2026-03-04T22:00:00Z",
  },
];
```

### mock/transactions.ts
```typescript
export const mockTransactions = [
  {
    id: "tx-1",
    type: "deposit",
    asset: "USDC",
    amount: 125000.00,
    fromChain: null,
    fromProtocol: null,
    toChain: "Ethereum",
    toProtocol: "Aave V3",
    apyAtTime: 4.45,
    gasCost: 18.50,
    bridgeCost: 0,
    status: "completed",
    timestamp: "2025-11-15T14:22:00Z",
    txHash: "0xabc123...def456",
  },
  {
    id: "tx-2",
    type: "rebalance",
    asset: "USDC",
    amount: 75000.00,
    fromChain: "Ethereum",
    fromProtocol: "Compound V3",
    toChain: "Base",
    toProtocol: "Morpho Blue",
    apyAtTime: 7.82,
    previousAPY: 3.91,
    gasCost: 14.20,
    bridgeCost: 3.80,
    status: "completed",
    timestamp: "2025-12-01T09:45:00Z",
    txHash: "0x789abc...123def",
  },
  {
    id: "tx-3",
    type: "rebalance",
    asset: "WBTC",
    amount: 32750.00,
    fromChain: "Ethereum",
    fromProtocol: "Aave V3",
    toChain: "Arbitrum",
    toProtocol: "Compound V3",
    apyAtTime: 5.58,
    previousAPY: 2.10,
    gasCost: 11.00,
    bridgeCost: 4.50,
    status: "completed",
    timestamp: "2026-01-22T16:30:00Z",
    txHash: "0xdef789...abc012",
  },
  {
    id: "tx-4",
    type: "deposit",
    asset: "DAI",
    amount: 7800.00,
    fromChain: null,
    fromProtocol: null,
    toChain: "BSC",
    toProtocol: "Venus",
    apyAtTime: 9.12,
    gasCost: 2.10,
    bridgeCost: 1.50,
    status: "completed",
    timestamp: "2026-02-14T11:15:00Z",
    txHash: "0x012345...6789ab",
  },
];
```

### mock/risk-scores.ts
```typescript
export const mockRiskScores = {
  protocols: [
    {
      name: "Aave V3",
      overallScore: "A+",
      numericScore: 95,
      auditStatus: "Multiple audits (Trail of Bits, OpenZeppelin, Certora)",
      lastAudit: "2025-09-15",
      exploitHistory: [],
      tvl: 12400000000,
      tvlTrend30d: +2.3,
      chains: ["Ethereum", "Arbitrum", "Optimism", "Polygon", "Avalanche", "Base"],
      insuranceAvailable: true,
      governanceToken: "AAVE",
      timeInMarket: "4+ years",
      oracleDependency: "Chainlink",
      factors: {
        smartContractSecurity: 98,
        tvlStability: 94,
        teamReputation: 97,
        auditCoverage: 96,
        oracleReliability: 95,
        historicalPerformance: 92,
      },
    },
    {
      name: "Morpho Blue",
      overallScore: "A",
      numericScore: 88,
      auditStatus: "Audited (Spearbit, Cantina)",
      lastAudit: "2025-07-20",
      exploitHistory: [],
      tvl: 3200000000,
      tvlTrend30d: +8.7,
      chains: ["Ethereum", "Base"],
      insuranceAvailable: true,
      governanceToken: "MORPHO",
      timeInMarket: "2 years",
      oracleDependency: "Chainlink + Morpho Oracle",
      factors: {
        smartContractSecurity: 90,
        tvlStability: 85,
        teamReputation: 91,
        auditCoverage: 88,
        oracleReliability: 89,
        historicalPerformance: 87,
      },
    },
    {
      name: "Compound V3",
      overallScore: "A",
      numericScore: 90,
      auditStatus: "Multiple audits (OpenZeppelin, Trail of Bits)",
      lastAudit: "2025-06-10",
      exploitHistory: [
        { date: "2021-09-30", description: "COMP token distribution bug", amountLost: 80000000, recovered: true },
      ],
      tvl: 5600000000,
      tvlTrend30d: -1.2,
      chains: ["Ethereum", "Arbitrum", "Base", "Polygon"],
      insuranceAvailable: true,
      governanceToken: "COMP",
      timeInMarket: "5+ years",
      oracleDependency: "Chainlink",
      factors: {
        smartContractSecurity: 91,
        tvlStability: 92,
        teamReputation: 94,
        auditCoverage: 90,
        oracleReliability: 93,
        historicalPerformance: 85,
      },
    },
    {
      name: "Venus",
      overallScore: "B+",
      numericScore: 74,
      auditStatus: "Audited (Certik, Peckshield)",
      lastAudit: "2025-04-01",
      exploitHistory: [
        { date: "2021-05-19", description: "XVS price manipulation", amountLost: 200000000, recovered: false },
      ],
      tvl: 1800000000,
      tvlTrend30d: -18.4,
      chains: ["BSC"],
      insuranceAvailable: false,
      governanceToken: "XVS",
      timeInMarket: "3+ years",
      oracleDependency: "Chainlink + Binance Oracle",
      factors: {
        smartContractSecurity: 75,
        tvlStability: 62,
        teamReputation: 72,
        auditCoverage: 78,
        oracleReliability: 80,
        historicalPerformance: 68,
      },
    },
    {
      name: "Spark",
      overallScore: "A+",
      numericScore: 93,
      auditStatus: "Multiple audits (ChainSecurity, ABDK)",
      lastAudit: "2025-08-25",
      exploitHistory: [],
      tvl: 8900000000,
      tvlTrend30d: +4.1,
      chains: ["Ethereum"],
      insuranceAvailable: true,
      governanceToken: "SPK",
      timeInMarket: "2+ years (MakerDAO lineage 7+ years)",
      oracleDependency: "Chronicle",
      factors: {
        smartContractSecurity: 94,
        tvlStability: 96,
        teamReputation: 95,
        auditCoverage: 92,
        oracleReliability: 90,
        historicalPerformance: 93,
      },
    },
    {
      name: "Kamino",
      overallScore: "B+",
      numericScore: 76,
      auditStatus: "Audited (OtterSec, Neodyme)",
      lastAudit: "2025-05-15",
      exploitHistory: [],
      tvl: 1200000000,
      tvlTrend30d: +12.5,
      chains: ["Solana"],
      insuranceAvailable: false,
      governanceToken: "KMNO",
      timeInMarket: "1.5 years",
      oracleDependency: "Pyth + Switchboard",
      factors: {
        smartContractSecurity: 78,
        tvlStability: 72,
        teamReputation: 77,
        auditCoverage: 75,
        oracleReliability: 76,
        historicalPerformance: 80,
      },
    },
  ],
};
```

### mock/alerts.ts
```typescript
export const mockAlerts = [
  {
    id: "alert-1",
    type: "rate_drop",
    active: true,
    asset: "USDC",
    condition: "APY drops below 4.0%",
    protocol: "Aave V3",
    chain: "Ethereum",
    channel: "email",
    createdAt: "2026-01-15T10:00:00Z",
    lastTriggered: "2026-03-02T08:12:00Z",
    triggerCount: 3,
  },
  {
    id: "alert-2",
    type: "rate_spike",
    active: true,
    asset: "USDC",
    condition: "APY exceeds 10.0% on any A-rated protocol",
    protocol: null,
    chain: null,
    channel: "telegram",
    createdAt: "2026-02-01T14:00:00Z",
    lastTriggered: null,
    triggerCount: 0,
  },
  {
    id: "alert-3",
    type: "tvl_drop",
    active: true,
    asset: null,
    condition: "TVL drops more than 15% in 7 days",
    protocol: "Venus",
    chain: "BSC",
    channel: "email",
    createdAt: "2026-02-20T09:00:00Z",
    lastTriggered: "2026-03-04T06:00:00Z",
    triggerCount: 1,
  },
  {
    id: "alert-4",
    type: "new_opportunity",
    active: false,
    asset: "ETH",
    condition: "New lending pool with APY > 5% and risk score A or higher",
    protocol: null,
    chain: null,
    channel: "email",
    createdAt: "2026-01-30T16:00:00Z",
    lastTriggered: null,
    triggerCount: 0,
  },
];
```

### mock/treasury.ts
```typescript
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
```

---

## Page Specifications — Phased Build Order

### PHASE 1: The Free Public Layer (Ship first — this drives all traffic)

---

#### Page 1: Rate Explorer (Homepage) — `/`

**Data source:** LIVE DefiLlama API

**Purpose:** The front door. Anyone lands here and immediately sees the best lending rates across all of DeFi. This is the page that ranks on Google, gets shared on Twitter, and pulls in every other user.

**Layout:**
- Top: LEND Radar logo + tagline ("Find the best DeFi lending rates across every chain") + Connect Wallet button (top right)
- Stats bar: Total protocols tracked, total chains, total TVL across all lending pools, last data refresh timestamp
- Filter row: Asset search input, Chain multi-select dropdown, Protocol multi-select dropdown, Min TVL slider, Sort dropdown (APY desc, TVL desc, APY change 7d)
- Main content: Data table using @tanstack/react-table with columns:
  - Asset (token symbol + icon)
  - Chain (chain name + colored dot/icon)
  - Protocol (protocol name)
  - Supply APY (green text, with "BEST" badge on highest per asset)
  - Base APY vs Reward APY breakdown (smaller text)
  - TVL (formatted as $X.XB or $X.XM)
  - 7d APY trend (small sparkline or +/- indicator — use mock trend data appended to live data)
  - Action button ("View Details" → links to protocol profile or asset deep dive)
- Row click expands an inline detail panel showing: pool metadata, link to protocol, historical APY mini-chart (use DefiLlama chart endpoint if available, else mock)
- Bottom: pagination, "Showing X of Y pools" count
- Footer: "Data from DefiLlama • Updates every 5 minutes • 119+ chains supported"

**Filtering logic for lending protocols only:**
Filter DefiLlama results where `project` matches known lending protocols: Aave, Morpho, Compound, Venus, Spark, Solend, Kamino, Radiant, Benqi, JustLend, Silo, Euler, Fluid, Seamless, Moonwell, Lido (for staking yield comparison). Also filter where `apy > 0` and `tvlUsd > 100000` to remove dead pools.

**Key interactions:**
- Typing in asset filter instantly filters the table (debounced 200ms)
- Clicking column headers sorts
- "BEST" badge dynamically highlights the highest APY row for each unique asset symbol
- URL params update with filters so links are shareable: `/?asset=USDC&chain=Base&sort=apy`

---

#### Page 2: Asset Deep Dive — `/asset/[symbol]`

**Data source:** LIVE DefiLlama API (filtered by symbol) + mock historical data

**Purpose:** Everything about lending a single asset. User clicks "USDC" anywhere in the app and lands here.

**Layout:**
- Header: Asset name + icon, current best rate (big number), best protocol + chain for that rate
- Summary cards row: Number of pools available, Average APY, Highest APY, Total TVL across all pools
- Section 1 — "Rate Comparison Table": Same table structure as homepage but pre-filtered to this asset only. All chains, all protocols. Sorted by APY desc.
- Section 2 — "APY History" (mock data): Recharts line chart showing APY over 90 days for the top 3-5 protocols for this asset. Each protocol is a different colored line. Toggleable time range: 7d, 30d, 90d, 1y.
- Section 3 — "TVL Flows" (mock data): Area chart showing TVL movement between protocols over 30 days. Shows which protocols are gaining/losing deposits.
- Section 4 — "Where should I deposit?" — a simple recommendation card: "For maximum yield: [Protocol] on [Chain] at [APY]% (Risk: [Score]). For maximum safety: [Protocol] on [Chain] at [APY]% (Risk: A+)."

**Dynamic routes:** Generate pages for at minimum: USDC, USDT, ETH, WBTC, DAI, WETH, wstETH, cbETH. Use a catch-all route that works for any symbol found in DefiLlama data.

---

#### Page 3: Protocol Profile — `/protocol/[name]`

**Data source:** LIVE DefiLlama API (filtered by project) + mock risk data

**Layout:**
- Header: Protocol name + logo placeholder, overall risk score badge (from mock), total TVL, number of chains supported
- Info section: Description (mock 2-3 sentences per protocol), website link, governance token, launch date
- Risk Score Card (mock data): Overall letter grade with numeric score, radar chart showing the 6 risk factors (smart contract security, TVL stability, team reputation, audit coverage, oracle reliability, historical performance)
- Section — "Available Pools": Table of all pools on this protocol from DefiLlama, grouped by chain. Columns: Asset, Chain, APY, TVL.
- Section — "Audit History" (mock): Timeline showing audit dates, auditor names, links
- Section — "Exploit History" (mock): Either "No known exploits" (green) or a list of past incidents with dates, descriptions, amounts
- Section — "TVL History" (mock): Line chart showing protocol TVL over 90 days

**Dynamic routes:** Generate for at minimum: aave-v3, morpho-blue, compound-v3, venus, spark, kamino, radiant-v2, benqi, solend, moonwell.

---

#### Page 4: Rate Alerts — `/alerts`

**Data source:** Mock alerts data

**Purpose:** Let users configure notifications. In MVP this is UI-only — no actual notification sending.

**Layout:**
- Header: "Rate Alerts" + "Create Alert" button
- Active alerts list: Card for each alert showing the condition, asset, protocol/chain scope, notification channel, last triggered date, trigger count, active/paused toggle
- Create Alert modal/drawer: Form with fields:
  - Alert type dropdown: Rate Drop, Rate Spike, TVL Drop, New Opportunity
  - Asset selector (optional — "any" option)
  - Protocol selector (optional — "any" option)
  - Chain selector (optional — "any" option)
  - Condition threshold (e.g., "APY drops below [input]%")
  - Minimum risk score filter (for new opportunity alerts)
  - Notification channel: Email, Telegram, Webhook (show as options, all mock)
- Empty state for new users: "Set up your first alert to never miss a rate change"
- Banner at top: "Pro users get SMS alerts, webhook integrations, and compound conditions → Upgrade"

---

### PHASE 2: The Authenticated User Experience (requires wallet connect)

---

#### Page 5: Portfolio Dashboard — `/dashboard`

**Data source:** Mock portfolio data (show mock data always; when wallet connected, show as if scanning)

**Purpose:** This is the "home base" for logged-in users. Shows everything they own across all chains and protocols.

**Layout:**
- Top section — Portfolio Summary Cards:
  - Total Portfolio Value (big number)
  - Total Daily Yield
  - Weighted Average APY
  - Total Earned All-Time
- Performance chart: Recharts area chart showing portfolio value over 30/90 days (mock timeseries)
- Yield breakdown: Small donut chart showing yield by asset (USDC: 58%, ETH: 12%, WBTC: 18%, DAI: 12%)
- Main section — "Your Positions" table:
  - Asset + icon
  - Protocol + chain
  - Deposited amount
  - Current value
  - Current APY (with 7d change arrow)
  - Risk Score badge
  - Daily yield
  - Days active
  - Total earned
  - "Manage" dropdown (View Details, Move Funds, Withdraw — all just open modals/dialogs, no real transactions)
- Below table: link to "See Opportunities →" and "Transaction History →"

**Wallet connect flow:** When no wallet is connected, show a hero section: "Connect your wallet to scan your DeFi lending positions across all chains" with a Connect Wallet button. After connecting, show a brief "Scanning chains..." loading animation (2-3 seconds, mock) then reveal the dashboard with mock data.

---

#### Page 6: Opportunities Feed — `/opportunities`

**Data source:** Mock opportunities data

**Purpose:** Personalized recommendations to earn more yield or reduce risk.

**Layout:**
- Header: "Opportunities" + filter tabs: All, Rate Improvements, Risk Alerts, New Opportunities
- Each opportunity is a card:
  - Severity indicator (high = green pulse for gains, orange/red for risk alerts)
  - Title: e.g., "Move USDC from Aave → Morpho for +3.70% APY"
  - Current position summary: "You have $75,000 USDC earning 4.12% on Aave Ethereum"
  - Suggested action: "Move to Morpho Blue on Base for 7.82%"
  - Financials: Estimated annual gain, gas cost, bridge cost, net gain after fees
  - Risk comparison: Current risk score vs suggested risk score
  - Confidence indicator: "92% confidence" with explanation tooltip
  - Reasoning paragraph (the `reasoning` field from mock data)
  - Action buttons: "Move Funds" (opens wizard), "Dismiss", "Remind me later"
- Empty state: "No new opportunities right now. We're scanning 119 chains for you — check back soon."

---

#### Page 7: Move Funds Wizard — `/move` (modal or dedicated page)

**Data source:** Mock — no real transactions

**Purpose:** Step-by-step guide to move funds between protocols/chains.

**Layout — multi-step wizard:**
- Step 1 — "From": Shows current position (protocol, chain, asset, amount, current APY). "Withdraw" button (mock).
- Step 2 — "Bridge" (if cross-chain): Shows bridge options with estimated cost, time, and bridge name (Across, Stargate, official bridge). Selecting one shows the path visually (Chain A icon → arrow → Bridge name → arrow → Chain B icon).
- Step 3 — "To": Shows destination protocol, chain, expected APY, risk score. "Deposit" button (mock).
- Step 4 — "Review": Full summary — from, to, amounts, costs, net APY gain, estimated annual improvement. "Confirm & Execute" button.
- Step 5 — "Complete": Success state with confetti or checkmark animation. "Back to Dashboard" button.

In MVP, all buttons show a toast: "Transaction simulation — live execution coming soon." The UI should be fully built and interactive, just no real blockchain calls.

---

#### Page 8: Transaction History — `/transactions`

**Data source:** Mock transactions data

**Layout:**
- Header: "Transaction History" + date range picker + export CSV button
- Summary cards: Total transactions, Total gas spent, Total bridge fees, Net yield gained from rebalances
- Table:
  - Date
  - Type (Deposit, Withdraw, Rebalance) with colored badge
  - Asset + amount
  - From (protocol + chain) → To (protocol + chain)
  - APY at time of move (and previous APY for rebalances)
  - Gas cost + bridge cost
  - Status badge (completed, pending, failed)
  - TX hash (truncated, clickable → opens block explorer in new tab, use mock etherscan link)
- Each row expandable to show full transaction details

---

### PHASE 3: Pro Features (behind a "Pro" badge — UI built, gated with upgrade prompt)

---

#### Page 9: Risk Analytics — `/risk`

**Data source:** Mock risk scores data

**Layout:**
- Header: "Protocol Risk Analysis" + Pro badge
- Overview: Grid of protocol cards, each showing: name, letter grade, numeric score, TVL, 30d TVL trend. Click any card to expand or navigate to full protocol profile.
- Sort/filter: By risk score, by TVL, by chain
- Comparison mode: User can select 2-3 protocols and see them side-by-side in a comparison table showing all risk factors
- Detailed view (when clicking a protocol): Full radar chart of 6 risk factors, audit timeline, exploit history, insurance info, oracle dependency info

**Pro gate:** Show the first 3 protocols fully, blur/overlay the rest with "Upgrade to Pro to see all protocol risk scores"

---

#### Page 10: Historical Analytics — `/analytics`

**Data source:** Mix of DefiLlama historical endpoint + mock data

**Layout:**
- Header: "Yield Analytics" + Pro badge
- Main chart area: Large Recharts chart (800px+ tall) with:
  - Y-axis: APY %
  - X-axis: Time
  - Multiple toggleable lines (one per protocol)
  - Time range selector: 7d, 30d, 90d, 6m, 1y
  - Asset selector: Pick which asset to chart
- Below chart: "Rate Statistics" table showing for each protocol: Current APY, 7d avg, 30d avg, 90d avg, min (90d), max (90d), volatility
- Section: "Market Insights" (mock) — 3-4 bullet-point style cards with observations like "USDC rates across A-rated protocols have averaged 5.2% over 90 days, up from 3.8% in Q4 2025"

**Pro gate:** 7d chart is free. 30d+ requires Pro. Show blurred chart area with upgrade prompt.

---

#### Page 11: Yield Simulator — `/simulator`

**Data source:** Mock calculations

**Layout:**
- Header: "Yield Simulator" + Pro badge
- Input panel (left side or top):
  - Asset selector
  - Deposit amount input
  - Protocol selector (or "Best Available")
  - Chain selector (or "Any")
  - Time horizon: 3m, 6m, 1y, 2y
  - Rate assumption: Current rate, 90d average, custom input
  - Rebalancing strategy: None, Monthly, Weekly
- Output panel (right side or bottom):
  - Projected value at end of period (big number)
  - Total yield earned
  - Recharts line chart showing projected value over time
  - Comparison: "If you kept this in a savings account at 4.5% APY: $X. With LEND Radar optimization: $Y. Difference: $Z"
  - Breakdown: principal, base yield, reward tokens, estimated rebalancing gains, minus estimated gas/bridge costs

---

#### Page 12: Auto-Rebalance Settings — `/auto-rebalance`

**Data source:** Mock — no real automation

**Layout:**
- Header: "Auto-Rebalance" + Pro badge + "Beta" badge
- Strategy builder form:
  - Asset scope: All assets or select specific ones
  - Protocol whitelist: Only rebalance into these protocols
  - Chain whitelist: Only these chains
  - Minimum APY improvement threshold: "Only move if new rate is [X]% higher"
  - Maximum rebalance frequency: Daily, Weekly, Bi-weekly, Monthly
  - Risk floor: "Never deposit into anything below [risk score]"
  - Max gas budget per rebalance: $X
  - Max single-protocol exposure: X%
- Preview section: Based on current settings and current rates, shows what the system WOULD do today: "Would move $75K USDC from Aave ETH to Morpho Base (APY gain: +3.7%, cost: $15.70)"
- Save button (mock — shows toast "Settings saved. Auto-rebalance will begin with your next deposit.")
- History: Table of past auto-rebalances (mock — same format as transaction history, filtered to auto-rebalance type)

---

### PHASE 4: Institutional / Treasury (behind highest tier gate)

---

#### Page 13: Treasury Console — `/treasury`

**Data source:** Mock treasury data

**Layout:**
- Header: "Treasury Management" + org name ("Horizon DAO") + Institutional badge
- Summary row: Total AUM, Monthly Yield, Weighted APY, Number of active positions
- Policy compliance cards: Green checkmarks or red warnings for each policy rule. E.g., "Max single protocol: 35.1% (limit: 30%) ⚠️ OVER LIMIT" — this should show one violation to demonstrate the feature.
- Allocation table: Protocol, Chain, Asset, Amount, APY, Risk Score, % of Total. Each row has a mini progress bar showing % of total portfolio.
- Allocation pie chart: Recharts pie chart showing distribution by protocol
- Signers section: List of authorized wallets with names, roles, last active date
- Policy rules summary: Editable form (mock) showing current treasury policies
- "Generate Report" button → opens reporting page

---

#### Page 14: Reporting & Export — `/reports`

**Data source:** Mock treasury data

**Layout:**
- Header: "Treasury Reports" + Institutional badge
- Report type selector: Monthly Summary, Quarterly Review, Custom Date Range
- Preview area: Shows a formatted report preview with:
  - Period header (e.g., "February 2026 Treasury Report")
  - Executive summary: Total yield earned, average APY, number of rebalances
  - Position breakdown table
  - Protocol exposure chart
  - Risk score summary
  - Compliance status
- Export buttons: "Download PDF" (mock — show toast), "Download CSV" (actually generate a CSV from mock data), "Copy to Clipboard"
- Report history: Table of previously generated reports (mock) with download links

---

#### Page 15: API Documentation — `/api-docs`

**Data source:** Static content

**Purpose:** Show institutional users what API access looks like in the paid tier.

**Layout:**
- Styled API documentation page (similar to Stripe's docs aesthetic)
- Sections:
  - Authentication (API key management — mock UI)
  - Endpoints:
    - GET /api/v1/rates — Current lending rates
    - GET /api/v1/rates/{asset} — Rates for specific asset
    - GET /api/v1/risk/{protocol} — Risk scores
    - GET /api/v1/portfolio/{address} — Portfolio positions
    - POST /api/v1/alerts — Create alert
    - GET /api/v1/history/{pool} — Historical rates
  - Each endpoint shows: description, parameters, example request (curl), example response (JSON)
  - Rate limits: Free (100 req/day), Pro (10,000 req/day), Institutional (unlimited)
- "Request API Access" button (mock form)

---

### PHASE 5: Global Components (build alongside Phase 1)

---

#### Global: App Layout & Navigation

**Sidebar navigation (collapsible):**
- Logo: "LEND RADAR" with a radar/signal icon
- Section: EXPLORE
  - Rate Explorer (home icon)
  - Assets (coins icon)
  - Protocols (shield icon)
- Section: MY PORTFOLIO (only after wallet connect)
  - Dashboard (layout icon)
  - Opportunities (trending-up icon)
  - Transaction History (history icon)
  - Alerts (bell icon)
- Section: PRO TOOLS (with Pro badge)
  - Risk Analytics (shield-alert icon)
  - Analytics (bar-chart icon)
  - Yield Simulator (calculator icon)
  - Auto-Rebalance (refresh icon)
- Section: INSTITUTIONAL (with badge)
  - Treasury Console (building icon)
  - Reports (file-text icon)
  - API Docs (code icon)
- Bottom: Settings, Dark/Light toggle (default dark), Connect Wallet button

**Top bar:**
- Breadcrumb
- Global search (Cmd+K) — searches assets, protocols, chains
- Notification bell (mock — shows 2-3 unread alerts)
- Wallet connection status (address truncated, chain indicator, balance)

---

#### Global: Connect Wallet Flow

Use wagmi + RainbowKit or custom modal:
- Support: MetaMask, WalletConnect, Coinbase Wallet, Injected
- After connecting: briefly show "Scanning your positions across 7 chains..." with a progress animation, then redirect to Dashboard with mock data
- Wallet state persists across pages via React context

---

#### Global: Settings — `/settings`

- Profile section: Display name (optional), email (for alerts — mock)
- Notification preferences: Email, Telegram, SMS (Pro), Webhook (Pro)
- Default filters: Preferred chains, minimum TVL threshold, risk tolerance (Conservative / Moderate / Aggressive)
- Display preferences: Currency (USD/EUR/GBP), APY format (annual / monthly / daily)
- Pro subscription management: Current plan, upgrade button, billing (all mock)
- Danger zone: Disconnect wallet, delete all alerts, reset preferences

---

#### Global: Pricing Page — `/pricing`

- Three tier cards:
  - **Free**: Rate Explorer, 3 alerts, basic protocol profiles, asset deep dives
  - **Pro ($39/month)**: Everything free + Portfolio dashboard, Opportunities feed, Risk analytics, Historical analytics (full range), Yield simulator, Auto-rebalance, Advanced alerts (SMS + webhooks), Priority data refresh (1 min vs 5 min)
  - **Institutional ($499/month)**: Everything Pro + Treasury console, Reporting & export, API access, Multi-sig support, Custom risk policies, Dedicated support, Custom integrations
- Annual discount toggle (20% off)
- FAQ section below
- "Start Free" and "Contact Sales" CTAs

---

## Design Direction

**Overall aesthetic:** Dark mode default (zinc-950 background). Financial terminal feel but modern — think Linear meets Bloomberg. Clean, data-dense but not cluttered.

**Color system:**
- Background: zinc-950 (#09090b)
- Card surfaces: zinc-900 (#18181b)
- Borders: zinc-800 (#27272a)
- Primary text: zinc-100
- Secondary text: zinc-400
- Accent/brand: emerald-500 (#10b981) — used for positive APY, "best" badges, CTAs
- Danger/risk: amber-500 for warnings, red-500 for critical alerts
- Protocol chain colors: Each chain gets a consistent color dot (Ethereum = blue, Arbitrum = light blue, Base = blue-white, Optimism = red, Polygon = purple, BSC = yellow, Solana = gradient purple-green, Avalanche = red)

**Typography:**
- Headings: JetBrains Mono or IBM Plex Mono (for the terminal/data feel)
- Body: Inter or system font stack
- Numbers/Data: JetBrains Mono (monospace for aligned columns)

**Component patterns:**
- Cards with subtle border, no heavy shadows
- Tables with alternating row tinting (very subtle)
- Badges: Rounded-full, small, color-coded (risk scores: A+ = emerald, A = green, B+ = yellow, B = amber, C = red)
- Tooltips for any abbreviated or complex data
- Loading states: Skeleton components from shadcn, not spinners
- Empty states: Illustration + helpful text + CTA for every empty view

---

## File Structure

```
lendradar/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar + providers
│   ├── page.tsx                      # Rate Explorer (homepage)
│   ├── asset/
│   │   └── [symbol]/
│   │       └── page.tsx              # Asset Deep Dive
│   ├── protocol/
│   │   └── [name]/
│   │       └── page.tsx              # Protocol Profile
│   ├── alerts/
│   │   └── page.tsx                  # Rate Alerts
│   ├── dashboard/
│   │   └── page.tsx                  # Portfolio Dashboard
│   ├── opportunities/
│   │   └── page.tsx                  # Opportunities Feed
│   ├── move/
│   │   └── page.tsx                  # Move Funds Wizard
│   ├── transactions/
│   │   └── page.tsx                  # Transaction History
│   ├── risk/
│   │   └── page.tsx                  # Risk Analytics
│   ├── analytics/
│   │   └── page.tsx                  # Historical Analytics
│   ├── simulator/
│   │   └── page.tsx                  # Yield Simulator
│   ├── auto-rebalance/
│   │   └── page.tsx                  # Auto-Rebalance Settings
│   ├── treasury/
│   │   └── page.tsx                  # Treasury Console
│   ├── reports/
│   │   └── page.tsx                  # Reporting & Export
│   ├── api-docs/
│   │   └── page.tsx                  # API Documentation
│   ├── pricing/
│   │   └── page.tsx                  # Pricing Page
│   ├── settings/
│   │   └── page.tsx                  # Settings
│   ├── providers.tsx                 # TanStack Query + wagmi providers
│   └── globals.css                   # Tailwind base + custom vars
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── GlobalSearch.tsx
│   │   └── ConnectWallet.tsx
│   ├── shared/
│   │   ├── RiskBadge.tsx             # Reusable A+/A/B+/B/C badge
│   │   ├── ChainBadge.tsx            # Chain icon + name with color
│   │   ├── APYDisplay.tsx            # Formatted APY with trend arrow
│   │   ├── TVLDisplay.tsx            # Formatted TVL ($X.XB/$X.XM)
│   │   ├── DataTable.tsx             # Wrapper around tanstack table
│   │   ├── TimeRangeSelector.tsx     # 7d/30d/90d/1y toggle
│   │   ├── ProGate.tsx              # Blur overlay + upgrade CTA
│   │   └── EmptyState.tsx            # Reusable empty state component
│   ├── charts/
│   │   ├── APYHistoryChart.tsx
│   │   ├── TVLFlowChart.tsx
│   │   ├── PortfolioValueChart.tsx
│   │   ├── RiskRadarChart.tsx
│   │   ├── AllocationPieChart.tsx
│   │   └── YieldProjectionChart.tsx
│   └── ui/                           # shadcn components (auto-generated)
├── lib/
│   ├── api.ts                        # DefiLlama API functions
│   ├── types.ts                      # All TypeScript interfaces
│   ├── utils.ts                      # Formatting, helpers
│   ├── constants.ts                  # Chain configs, protocol lists, colors
│   ├── hooks/
│   │   ├── useDefiLlamaData.ts       # TanStack Query hook for pool data
│   │   ├── usePortfolio.ts           # Portfolio context/hook
│   │   └── useWalletState.ts         # Wallet connection state
│   └── mock/
│       ├── portfolio.ts
│       ├── opportunities.ts
│       ├── transactions.ts
│       ├── risk-scores.ts
│       ├── alerts.ts
│       ├── treasury.ts
│       └── historical.ts             # Mock timeseries data for charts
├── wagmi.ts                          # Wagmi config
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Build Sequence for Claude Code

**Batch 1 (Foundation):**
1. Project scaffolding — Next.js + all dependencies + shadcn init
2. Global layout — Sidebar, TopBar, providers, dark theme, CSS variables
3. All mock data files
4. Shared components — RiskBadge, ChainBadge, APYDisplay, TVLDisplay, ProGate, EmptyState
5. DefiLlama API integration + useDefiLlamaData hook
6. Types file with all interfaces

**Batch 2 (Phase 1 pages — public/free):**
7. Rate Explorer homepage (live data)
8. Asset Deep Dive pages (live data + mock charts)
9. Protocol Profile pages (live data + mock risk)
10. Rate Alerts page (mock)
11. Pricing page (static)

**Batch 3 (Phase 2 pages — authenticated):**
12. Connect Wallet flow + wallet state management
13. Portfolio Dashboard (mock data)
14. Opportunities Feed (mock data)
15. Move Funds Wizard (mock, multi-step)
16. Transaction History (mock data)

**Batch 4 (Phase 3 pages — Pro):**
17. Risk Analytics (mock + pro gate)
18. Historical Analytics (live partial + mock + pro gate)
19. Yield Simulator (mock calculations)
20. Auto-Rebalance Settings (mock)

**Batch 5 (Phase 4 pages — Institutional):**
21. Treasury Console (mock)
22. Reporting & Export (mock + real CSV export)
23. API Documentation (static)

**Batch 6 (Polish):**
24. Settings page
25. Global search (Cmd+K)
26. Loading/skeleton states for every page
27. Empty states for every page
28. Responsive design pass (mobile sidebar → bottom nav)
29. SEO meta tags for public pages
30. Deploy to Vercel

---

## Deployment Notes

- Deploy to Vercel — zero config for Next.js
- Environment variables needed: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (free from cloud.walletconnect.com)
- No other API keys needed — DefiLlama is free and unauthenticated
- All mock data is client-side, no database needed for MVP
- Domain: Configure when ready (lendradar.xyz, lendradar.io, or similar)

---

## Success Criteria

The deployed MVP should:
1. Load the homepage and display live DeFi lending rates from DefiLlama within 3 seconds
2. Allow filtering by asset, chain, and protocol with instant response
3. Navigate to any asset deep dive or protocol profile with real data + mock enrichment
4. Connect a wallet and show the mock portfolio dashboard
5. Display opportunities, transaction history, risk analytics, and all other pages with realistic mock data
6. Have working navigation across all 18+ pages with no dead links
7. Look like a professional SaaS product, not a weekend hackathon project
8. Be deployed and accessible via a public Vercel URL
