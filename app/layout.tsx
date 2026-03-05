import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SidebarProvider } from "@/lib/sidebar-context";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainContent } from "@/components/layout/MainContent";
import { TooltipProvider } from "@/components/ui/tooltip";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LendRadar — Best DeFi Lending Rates",
  description:
    "Real-time cross-chain DeFi lending rates across all major protocols. Compare APY across 119+ chains and 500+ protocols.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${plusJakarta.variable} ${jetbrainsMono.variable} bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <Providers>
          <TooltipProvider delayDuration={0}>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <MainContent>{children}</MainContent>
              </div>
            </SidebarProvider>
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
