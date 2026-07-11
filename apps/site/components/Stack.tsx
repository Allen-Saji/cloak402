"use client";

import LogoLoop from "./bits/LogoLoop";

const ITEMS = [
  "Avalanche C-Chain",
  "eERC",
  "x402 v2",
  "ERC-4337",
  "Groth16",
  "BabyJubJub",
  "EntryPoint v0.7",
  "snarkjs",
].map((label) => ({
  node: (
    <span className="font-display text-lg font-semibold text-fog transition-colors hover:text-bone">
      {label}
    </span>
  ),
  title: label,
}));

export default function Stack() {
  return (
    <section className="border-y border-white/5 py-10">
      <LogoLoop
        logos={ITEMS}
        speed={60}
        gap={64}
        fadeOut
        fadeOutColor="oklch(0.13 0.008 285)"
        ariaLabel="Built on"
      />
    </section>
  );
}
