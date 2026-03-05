import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const displayName = name.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `${displayName} — Protocol Profile — LendRadar`,
    description: `${displayName} risk analysis, lending pools, audit history, and TVL data on LendRadar.`,
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
