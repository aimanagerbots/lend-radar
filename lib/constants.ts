/** Lending protocols to include from DefiLlama data */
export const LENDING_PROTOCOLS = new Set([
  "aave-v2",
  "aave-v3",
  "aave-v4",
  "morpho",
  "morpho-blue",
  "compound",
  "compound-v3",
  "venus",
  "venus-core-pool",
  "spark",
  "solend",
  "kamino",
  "kamino-lend",
  "benqi-lending",
  "radiant-v2",
  "silo",
  "silo-v2",
  "fluid",
  "euler",
  "euler-v2",
  "moonwell",
  "seamless-protocol",
  "ionic",
  "dforce",
  "justlend",
  "tectonic",
  "granary-finance",
  "maple",
  "clearpool",
]);

/** Minimum TVL to show (filters noise) */
export const MIN_TVL = 100_000;

/** How often to refetch data (ms) */
export const REFETCH_INTERVAL = 5 * 60 * 1000;
