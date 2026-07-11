"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

const ACTORS = [
  {
    name: "The agent",
    detail:
      "An ERC-4337 smart account registered in eERC. Its BabyJubJub key is derived from one owner signature; the owner EOA never holds gas. It builds proofs and signs UserOperations, nothing else.",
  },
  {
    name: "The facilitator",
    detail:
      "Verifies statically against live chain state, decrypts the auditor ciphertext to size the payment, then self-bundles settlement through the canonical EntryPoint. Holds the rotatable auditor key.",
  },
  {
    name: "The chain",
    detail:
      "Avalanche C-Chain stores ElGamal-encrypted balances and amounts. It enforces the zk proof and the msg.sender binding: it never learns a number.",
  },
];

export default function Architecture() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold tracking-tight">
        Three parties. <span className="text-ember">One secret.</span>
      </h2>

      <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
        {ACTORS.map((actor, i) => (
          <motion.div
            key={actor.name}
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease, delay: i * 0.12 }}
            className="bg-void p-8"
          >
            <h3 className="font-display text-xl font-semibold text-ember">
              {actor.name}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-fog">
              {actor.detail}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap gap-x-16 gap-y-10">
        <div>
          <div className="font-display text-5xl font-bold text-bone">9</div>
          <p className="mt-2 text-sm text-fog">static checks before settlement</p>
        </div>
        <div>
          <div className="font-display text-5xl font-bold text-bone">
            1.7<span className="text-2xl text-fog">s</span>
          </div>
          <p className="mt-2 text-sm text-fog">Groth16 transfer proof, laptop CPU</p>
        </div>
        <div>
          <div className="font-display text-5xl font-bold text-bone">0</div>
          <p className="mt-2 text-sm text-fog">AVAX the agent&apos;s owner ever holds</p>
        </div>
        <div>
          <div className="font-display text-5xl font-bold text-bone">32</div>
          <p className="mt-2 text-sm text-fog">public signals, zero of them the amount</p>
        </div>
      </div>
    </section>
  );
}
