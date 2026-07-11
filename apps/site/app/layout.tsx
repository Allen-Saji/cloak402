import type { Metadata } from "next";
import { Chakra_Petch, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-chakra",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "cloak402 | confidential x402 payments on Avalanche",
  description:
    "Pay APIs per request with x402, settle in encrypted eERC. Amounts stay ciphertext on-chain; a rotatable auditor key keeps it compliance-grade. Built on Avalanche.",
  openGraph: {
    title: "cloak402",
    description: "Confidential x402 payments on Avalanche. Hide the numbers, keep the rails.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "cloak402",
    description: "Confidential x402 payments on Avalanche. Hide the numbers, keep the rails.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${chakra.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
