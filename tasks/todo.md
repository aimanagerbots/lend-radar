# LendRadar — Build Progress & Task List

Last updated: 2026-03-05

---

## Status Summary

| Category | Done | Total | % |
|----------|------|-------|---|
| Pages (routes) | 17 | 17 | 100% |
| Layout & Navigation | 3/5 | 5 | 60% |
| Shared Components | 8 | 8 | 100% |
| Chart Components | 6 | 6 | 100% |
| Mock Data Files | 7 | 7 | 100% |
| Types & API | 3 | 3 | 100% |
| Wallet Integration | 0 | 3 | 0% |
| Polish & QA | 1 | 8 | 12% |
| **Overall** | | | **~70%** |

---

## DONE — Foundation (Batch 1)

- [x] Project scaffolding (Next.js 16, Tailwind v4, shadcn/ui)
- [x] Global layout — Sidebar (collapsible, mobile swipe), TopBar (breadcrumb, search, notifications)
- [x] MainContent wrapper with sidebar-synced padding
- [x] Dark theme design tokens (zinc-950 bg, emerald-500 accent, CSS animations)
- [x] Typography: JetBrains Mono (headings/data) + Plus Jakarta Sans (body) via next/font
- [x] Staggered entrance animations (fadeInUp + delay utilities)
- [x] Emerald pulse animation for BEST badge
- [x] All 7 mock data files (portfolio, opportunities, transactions, risk-scores, alerts, treasury, historical)
- [x] Historical mock: 90 days realistic timeseries, 6 protocols x 4 assets, distinct curve shapes
- [x] TypeScript interfaces for all data types
- [x] DefiLlama API integration (lib/api.ts, lib/constants.ts — 32 lending protocols)
- [x] 8 shared components: RiskBadge, ChainBadge, APYDisplay, TVLDisplay, DataTable, TimeRangeSelector, ProGate, EmptyState
- [x] 6 chart components: APYHistoryChart, TVLFlowChart, PortfolioValueChart, RiskRadarChart, AllocationPieChart, YieldProjectionChart
- [x] 25 shadcn/ui components installed

## DONE — Pages (Batch 2-5)

### Phase 1: Public/Free Pages
- [x] Rate Explorer homepage `/` — live DefiLlama data, filters, BEST badge, stats bar
- [x] Asset Deep Dive `/asset/[symbol]` — live data + mock APY history chart + summary cards
- [x] Protocol Profile `/protocol/[name]` — risk radar, audit history, live pools, exploit timeline
- [x] Rate Alerts `/alerts` — alert cards with type icons, conditions, channels
- [x] Pricing `/pricing` — 3-tier cards, annual toggle, feature lists

### Phase 2: Authenticated Pages
- [x] Portfolio Dashboard `/dashboard` — stats cards, positions table, allocation pie chart
- [x] Opportunities Feed `/opportunities` — rate improvement/risk alert cards with reasoning
- [x] Move Funds Wizard `/move` — 3-step wizard UI with progress bar
- [x] Transaction History `/transactions` — type badges, from->to routes, status

### Phase 3: Pro Features
- [x] Risk Analytics `/risk` — protocol comparison table, radar chart sidebar
- [x] Historical Analytics `/analytics` — asset tabs, time range, APY history chart
- [x] Yield Simulator `/simulator` — interactive calculator, projection chart, savings comparison
- [x] Auto-Rebalance `/auto-rebalance` — strategy config, chain whitelist, recent activity

### Phase 4: Institutional
- [x] Treasury Console `/treasury` — AUM stats, allocations, policies, signers
- [x] Reports `/reports` — monthly reports, export buttons, date filter
- [x] API Documentation `/api-docs` — endpoint cards with examples, auth section

### Phase 5: Settings
- [x] Settings `/settings` — profile, notifications, display prefs, API keys

## DONE — Mobile & Responsive
- [x] Mobile sidebar: swipe gestures (right from edge = open, left = close)
- [x] Mobile sidebar drawer (220px) with overlay backdrop, body scroll lock
- [x] Hamburger menu button on mobile
- [x] TopBar responsive (hidden wallet on small screens, left padding for hamburger)
- [x] overflow-x-hidden on body to prevent horizontal scroll
- [x] Main content padding: p-4 on mobile, p-6 on desktop

---

## TODO — Remaining Work

### Wallet Integration (Priority: Medium)
- [ ] `wagmi.ts` config file (wagmi v2 + viem)
- [ ] `components/layout/ConnectWallet.tsx` — RainbowKit or custom modal
- [ ] `app/providers.tsx` — add WagmiProvider + RainbowKitProvider
- [ ] Wire "Connect Wallet" sidebar button to actual wallet connect
- [ ] Wallet state persists across pages via context
- [ ] Dashboard: "Connect wallet to scan positions" hero when disconnected
- [ ] Dashboard: "Scanning chains..." animation after connecting, then show mock data
- [ ] TopBar: show connected address + chain dot + balance when connected

### Rate Explorer Enhancements (Priority: High)
- [ ] URL params sync — filters sync to URL (`/?asset=USDC&chain=Base&sort=apy`) for shareable links
- [ ] Expandable row detail with mini APY chart (inline panel on row click)
- [ ] Pagination with "Showing X of Y pools" count
- [ ] Stats bar: total protocols tracked, chains, total TVL, last refresh timestamp
- [ ] Column header sorting (click to sort)
- [ ] "BEST" badge with emerald pulse animation on highest APY per asset
- [ ] 7d APY trend indicator (small +/- or sparkline)

### Global Search — Cmd+K (Priority: Medium)
- [ ] `components/layout/GlobalSearch.tsx` — command palette using shadcn Command component
- [ ] Search assets, protocols, chains
- [ ] Wire Cmd+K keyboard shortcut
- [ ] Wire search button in TopBar to open search

### Pro/Institutional Gating (Priority: Low)
- [ ] Risk page: show first 3 protocols, blur rest with ProGate overlay
- [ ] Analytics page: 7d free, 30d+ blurred with ProGate
- [ ] Apply ProGate to auto-rebalance, simulator
- [ ] Apply institutional gate to treasury, reports, API docs

### Page Polish & Missing Features (Priority: Medium)
- [ ] Rate Explorer: remove duplicate header (already has TopBar breadcrumb)
- [ ] Asset page: add TVL Flows chart section, "Where should I deposit?" recommendation card
- [ ] Protocol page: add description text (2-3 sentences per protocol)
- [ ] Alerts page: Create Alert modal/drawer with form (type, asset, condition, channel)
- [ ] Dashboard: "Manage" dropdown per position (View Details, Move Funds, Withdraw)
- [ ] Dashboard: portfolio performance area chart (mock timeseries)
- [ ] Opportunities: filter tabs (All, Rate Improvements, Risk Alerts, New)
- [ ] Move Funds: Step 4 (Review) + Step 5 (Success with animation)
- [ ] Transactions: date range picker, Export CSV button, summary cards
- [ ] Treasury: policy compliance warnings (e.g., "35.1% > 30% limit" warning)
- [ ] Reports: PDF/CSV download (CSV from mock data, PDF mock toast)
- [ ] Simulator: more inputs (asset selector, protocol selector, rebalancing strategy)
- [ ] Auto-Rebalance: preview section ("Would move $75K USDC...")

### Custom Hooks (Priority: Low)
- [ ] `lib/hooks/useDefiLlamaData.ts` — TanStack Query hook (currently inline in pages)
- [ ] `lib/hooks/usePortfolio.ts` — portfolio context/hook
- [ ] `lib/hooks/useWalletState.ts` — wallet connection state

### Loading & Empty States (Priority: Medium)
- [ ] Skeleton loading states for every page (currently only homepage has LoadingSkeleton)
- [ ] Empty states for: no alerts, no transactions, no opportunities, no positions
- [ ] Error states with retry buttons on all data-fetching pages

### SEO & Meta (Priority: Low)
- [ ] Page-specific `<title>` and `<meta description>` for all public pages
- [ ] Open Graph tags for social sharing (Rate Explorer, Asset pages, Protocol pages)
- [ ] Structured data for rate comparison (JSON-LD)

### Visual QA & Screenshots (Priority: High)
- [ ] Screenshot every page at desktop (1440px) and mobile (390px)
- [ ] Verify staggered animations are working on all pages
- [ ] Verify mono font on all numbers/data
- [ ] Check no horizontal overflow on any page at any viewport
- [ ] Verify sidebar active state highlights correct item on every page

### Deployment & Final (Priority: Medium)
- [ ] `npm run build` zero errors (DONE - currently passing)
- [ ] Console errors check on every page
- [ ] Homepage loads within 3 seconds
- [ ] Vercel deployment live and working (DONE - https://lend-radar.vercel.app)
- [ ] Environment variable: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

---

## Suggested Next Steps (in order)

1. **Rate Explorer enhancements** — URL params, expandable rows, pagination, stats bar (this is the front door)
2. **Global Search (Cmd+K)** — high-impact UX feature
3. **Visual QA pass** — screenshot every page, fix any issues
4. **Wallet integration** — wagmi + RainbowKit connect flow
5. **Page polish** — add missing features per blueprint spec
6. **Pro/Institutional gating** — blur overlays on gated content
7. **Loading/empty/error states** — polish for production feel
8. **SEO meta tags** — for public pages
