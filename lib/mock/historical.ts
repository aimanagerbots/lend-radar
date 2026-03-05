// ============================================================
// Mock Historical APY Data — 90 days (2025-12-06 to 2026-03-05)
// Each protocol has a distinct curve shape with realistic noise
// ============================================================

export interface HistoricalDataPoint {
  date: string;
  apy: number;
}

export interface ProtocolHistoricalData {
  [protocol: string]: HistoricalDataPoint[];
}

export interface AssetHistoricalData {
  [asset: string]: ProtocolHistoricalData;
}

// Deterministic pseudo-random number generator (seeded)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate a smooth curve with noise
function generateCurve(
  days: number,
  baseValue: number,
  options: {
    trend?: number; // per-day linear trend
    variance?: number; // daily noise amplitude
    smoothing?: number; // 0-1, higher = smoother (momentum factor)
    seasonalAmplitude?: number; // amplitude of sine wave
    seasonalPeriod?: number; // period in days
    dips?: { day: number; depth: number; width: number }[]; // sudden dips
    minValue?: number;
    maxValue?: number;
  },
  seed: number
): number[] {
  const rng = seededRandom(seed);
  const {
    trend = 0,
    variance = 0.1,
    smoothing = 0.85,
    seasonalAmplitude = 0,
    seasonalPeriod = 30,
    dips = [],
    minValue = 0.5,
    maxValue = 15,
  } = options;

  const values: number[] = [];
  let current = baseValue;

  for (let i = 0; i < days; i++) {
    // Linear trend
    const trendComponent = trend * i;

    // Seasonal component
    const seasonalComponent =
      seasonalAmplitude * Math.sin((2 * Math.PI * i) / seasonalPeriod);

    // Random noise (gaussian-ish via Box-Muller)
    const u1 = rng();
    const u2 = rng();
    const gaussian = Math.sqrt(-2 * Math.log(u1 + 0.0001)) * Math.cos(2 * Math.PI * u2);
    const noise = gaussian * variance;

    // Dip component
    let dipComponent = 0;
    for (const dip of dips) {
      const dist = Math.abs(i - dip.day);
      if (dist < dip.width) {
        dipComponent -= dip.depth * Math.cos((Math.PI * dist) / dip.width) * 0.5;
        dipComponent -= dip.depth * 0.5;
      }
    }

    // Target value for this day
    const target =
      baseValue + trendComponent + seasonalComponent + noise + dipComponent;

    // Smooth toward target (momentum)
    current = current * smoothing + target * (1 - smoothing);

    // Clamp
    values.push(Math.min(maxValue, Math.max(minValue, parseFloat(current.toFixed(2)))));
  }

  return values;
}

// Generate date strings for 90 days: 2025-12-06 to 2026-03-05
function generateDates(days: number): string[] {
  const dates: string[] = [];
  const start = new Date("2025-12-06");
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const DAYS = 90;
const dates = generateDates(DAYS);

function toDataPoints(values: number[]): HistoricalDataPoint[] {
  return values.map((apy, i) => ({ date: dates[i], apy }));
}

// ─── USDC Rates ──────────────────────────────────────────────
// Aave V3: Stable, low variance (4-5% USDC, slow drift)
const aaveUSDC = generateCurve(
  DAYS, 4.5,
  { trend: 0.003, variance: 0.12, smoothing: 0.92, minValue: 3.5, maxValue: 5.5 },
  1001
);

// Morpho Blue: Trending UP (5% -> 8% USDC)
const morphoUSDC = generateCurve(
  DAYS, 5.0,
  { trend: 0.033, variance: 0.18, smoothing: 0.88, minValue: 4.0, maxValue: 9.0 },
  2002
);

// Compound V3: Moderate, seasonal (4-6% USDC)
const compoundUSDC = generateCurve(
  DAYS, 5.0,
  { trend: 0, variance: 0.15, smoothing: 0.85, seasonalAmplitude: 0.8, seasonalPeriod: 28, minValue: 3.5, maxValue: 7.0 },
  3003
);

// Spark: Very stable (5.0-5.5% USDC)
const sparkUSDC = generateCurve(
  DAYS, 5.2,
  { trend: 0.001, variance: 0.05, smoothing: 0.95, minValue: 4.8, maxValue: 5.7 },
  4004
);

// Venus: Volatile, high variance (4-10% USDC, big swings)
const venusUSDC = generateCurve(
  DAYS, 7.0,
  { trend: 0.01, variance: 0.6, smoothing: 0.75, seasonalAmplitude: 1.5, seasonalPeriod: 18, minValue: 3.5, maxValue: 11.0 },
  5005
);

// Kamino: Trending up with dips (3% -> 7% USDC)
const kaminoUSDC = generateCurve(
  DAYS, 3.5,
  {
    trend: 0.04,
    variance: 0.2,
    smoothing: 0.87,
    dips: [
      { day: 25, depth: 1.8, width: 6 },
      { day: 55, depth: 2.2, width: 5 },
      { day: 78, depth: 1.5, width: 4 },
    ],
    minValue: 2.0,
    maxValue: 8.5,
  },
  6006
);

// ─── ETH Rates (2-5%) ───────────────────────────────────────
const aaveETH = generateCurve(
  DAYS, 3.2,
  { trend: 0.002, variance: 0.08, smoothing: 0.92, minValue: 2.0, maxValue: 4.5 },
  1101
);

const morphoETH = generateCurve(
  DAYS, 3.0,
  { trend: 0.015, variance: 0.12, smoothing: 0.88, minValue: 2.0, maxValue: 5.0 },
  2102
);

const compoundETH = generateCurve(
  DAYS, 3.5,
  { trend: 0, variance: 0.1, smoothing: 0.85, seasonalAmplitude: 0.4, seasonalPeriod: 28, minValue: 2.0, maxValue: 5.0 },
  3103
);

const sparkETH = generateCurve(
  DAYS, 3.4,
  { trend: 0.001, variance: 0.04, smoothing: 0.95, minValue: 2.8, maxValue: 4.0 },
  4104
);

const venusETH = generateCurve(
  DAYS, 3.5,
  { trend: 0.005, variance: 0.35, smoothing: 0.78, seasonalAmplitude: 0.8, seasonalPeriod: 20, minValue: 1.5, maxValue: 6.0 },
  5105
);

const kaminoETH = generateCurve(
  DAYS, 2.5,
  {
    trend: 0.025,
    variance: 0.15,
    smoothing: 0.87,
    dips: [
      { day: 30, depth: 1.0, width: 5 },
      { day: 65, depth: 1.2, width: 4 },
    ],
    minValue: 1.5,
    maxValue: 5.5,
  },
  6106
);

// ─── WBTC Rates (1-4%) ──────────────────────────────────────
const aaveWBTC = generateCurve(
  DAYS, 2.0,
  { trend: 0.002, variance: 0.06, smoothing: 0.92, minValue: 1.0, maxValue: 3.5 },
  1201
);

const morphoWBTC = generateCurve(
  DAYS, 1.8,
  { trend: 0.015, variance: 0.1, smoothing: 0.88, minValue: 1.0, maxValue: 4.0 },
  2202
);

const compoundWBTC = generateCurve(
  DAYS, 2.5,
  { trend: 0, variance: 0.08, smoothing: 0.85, seasonalAmplitude: 0.3, seasonalPeriod: 28, minValue: 1.0, maxValue: 4.0 },
  3203
);

const sparkWBTC = generateCurve(
  DAYS, 2.2,
  { trend: 0.001, variance: 0.03, smoothing: 0.95, minValue: 1.8, maxValue: 2.8 },
  4204
);

const venusWBTC = generateCurve(
  DAYS, 2.5,
  { trend: 0.005, variance: 0.25, smoothing: 0.78, seasonalAmplitude: 0.6, seasonalPeriod: 20, minValue: 0.8, maxValue: 5.0 },
  5205
);

const kaminoWBTC = generateCurve(
  DAYS, 1.5,
  {
    trend: 0.02,
    variance: 0.12,
    smoothing: 0.87,
    dips: [
      { day: 28, depth: 0.8, width: 5 },
      { day: 60, depth: 1.0, width: 4 },
    ],
    minValue: 0.8,
    maxValue: 4.5,
  },
  6206
);

// ─── DAI Rates (3-7%) ───────────────────────────────────────
const aaveDAI = generateCurve(
  DAYS, 4.0,
  { trend: 0.003, variance: 0.1, smoothing: 0.92, minValue: 3.0, maxValue: 5.5 },
  1301
);

const morphoDAI = generateCurve(
  DAYS, 4.5,
  { trend: 0.025, variance: 0.15, smoothing: 0.88, minValue: 3.5, maxValue: 7.5 },
  2302
);

const compoundDAI = generateCurve(
  DAYS, 4.5,
  { trend: 0, variance: 0.12, smoothing: 0.85, seasonalAmplitude: 0.6, seasonalPeriod: 28, minValue: 3.0, maxValue: 6.5 },
  3303
);

const sparkDAI = generateCurve(
  DAYS, 5.0,
  { trend: 0.001, variance: 0.04, smoothing: 0.95, minValue: 4.5, maxValue: 5.5 },
  4304
);

const venusDAI = generateCurve(
  DAYS, 6.0,
  { trend: 0.01, variance: 0.5, smoothing: 0.78, seasonalAmplitude: 1.2, seasonalPeriod: 18, minValue: 3.0, maxValue: 10.0 },
  5305
);

const kaminoDAI = generateCurve(
  DAYS, 3.0,
  {
    trend: 0.035,
    variance: 0.18,
    smoothing: 0.87,
    dips: [
      { day: 22, depth: 1.5, width: 5 },
      { day: 52, depth: 1.8, width: 5 },
      { day: 80, depth: 1.2, width: 4 },
    ],
    minValue: 2.0,
    maxValue: 7.5,
  },
  6306
);

// ─── Exported Data ───────────────────────────────────────────

export const mockHistoricalData: AssetHistoricalData = {
  USDC: {
    "Aave V3": toDataPoints(aaveUSDC),
    "Morpho Blue": toDataPoints(morphoUSDC),
    "Compound V3": toDataPoints(compoundUSDC),
    "Spark": toDataPoints(sparkUSDC),
    "Venus": toDataPoints(venusUSDC),
    "Kamino": toDataPoints(kaminoUSDC),
  },
  ETH: {
    "Aave V3": toDataPoints(aaveETH),
    "Morpho Blue": toDataPoints(morphoETH),
    "Compound V3": toDataPoints(compoundETH),
    "Spark": toDataPoints(sparkETH),
    "Venus": toDataPoints(venusETH),
    "Kamino": toDataPoints(kaminoETH),
  },
  WBTC: {
    "Aave V3": toDataPoints(aaveWBTC),
    "Morpho Blue": toDataPoints(morphoWBTC),
    "Compound V3": toDataPoints(compoundWBTC),
    "Spark": toDataPoints(sparkWBTC),
    "Venus": toDataPoints(venusWBTC),
    "Kamino": toDataPoints(kaminoWBTC),
  },
  DAI: {
    "Aave V3": toDataPoints(aaveDAI),
    "Morpho Blue": toDataPoints(morphoDAI),
    "Compound V3": toDataPoints(compoundDAI),
    "Spark": toDataPoints(sparkDAI),
    "Venus": toDataPoints(venusDAI),
    "Kamino": toDataPoints(kaminoDAI),
  },
};

// Convenience accessors
export const historicalAssets = Object.keys(mockHistoricalData);
export const historicalProtocols = [
  "Aave V3",
  "Morpho Blue",
  "Compound V3",
  "Spark",
  "Venus",
  "Kamino",
];

export function getHistoricalData(
  asset: string,
  protocol: string,
  daysBack: number = 90
): HistoricalDataPoint[] {
  const data = mockHistoricalData[asset]?.[protocol];
  if (!data) return [];
  return daysBack >= 90 ? data : data.slice(-daysBack);
}

export function getMultiProtocolHistory(
  asset: string,
  protocols: string[],
  daysBack: number = 90
): { protocol: string; data: HistoricalDataPoint[] }[] {
  return protocols.map((protocol) => ({
    protocol,
    data: getHistoricalData(asset, protocol, daysBack),
  }));
}
