import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol.toUpperCase()} Lending Rates — LendRadar`,
    description: `Compare ${symbol.toUpperCase()} DeFi lending rates across all chains and protocols. Find the best APY.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
