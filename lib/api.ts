import { DefiLlamaPool } from "./types";
import { LENDING_PROTOCOLS, MIN_TVL } from "./constants";

export async function fetchLendingPools(): Promise<DefiLlamaPool[]> {
  const res = await fetch("https://yields.llama.fi/pools");

  if (!res.ok) {
    throw new Error(`DefiLlama API error: ${res.status}`);
  }

  const json = await res.json();
  const pools: DefiLlamaPool[] = json.data;

  return pools.filter((p) => {
    const projectSlug = p.project?.toLowerCase() ?? "";
    return (
      LENDING_PROTOCOLS.has(projectSlug) &&
      p.tvlUsd >= MIN_TVL &&
      p.apy != null &&
      p.apy >= 0
    );
  });
}
