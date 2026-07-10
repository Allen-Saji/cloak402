import { processPoseidonDecryption } from "./vendor/poseidon.js";

export interface AmountPCT {
  pct: bigint[];
  index: bigint;
}

export interface EncryptedBalanceView {
  /** [c1x, c1y, c2x, c2y] */
  eGCT: [bigint, bigint, bigint, bigint];
  amountPCTs: AmountPCT[];
  balancePCT: bigint[];
}

const isZeroPCT = (pct: bigint[]): boolean => pct.every((x) => x === 0n);

/** Decrypts a uint256[7] PCT (ciphertext[4], authKey[2], nonce) to its value. */
export const decryptPCT = (pct: bigint[], rawKey: bigint): bigint => {
  const [decrypted] = processPoseidonDecryption(
    pct.slice(0, 4),
    [pct[4], pct[5]],
    pct[6],
    rawKey,
    1,
  );
  return decrypted;
};

/**
 * Recovers the plaintext balance from a balanceOf() view: the balance PCT
 * snapshot (written on transfer/withdraw) plus any amount PCTs appended by
 * deposits since. The contract prunes stale amount PCTs when the snapshot
 * advances, so the sum of what remains is the current balance.
 */
export const recoverBalance = (
  view: EncryptedBalanceView,
  rawKey: bigint,
): bigint => {
  let total = 0n;
  if (!isZeroPCT(view.balancePCT)) {
    total += decryptPCT(view.balancePCT, rawKey);
  }
  for (const { pct } of view.amountPCTs) {
    if (!isZeroPCT(pct)) total += decryptPCT(pct, rawKey);
  }
  return total;
};

/** Normalizes the ethers balanceOf() tuple into an EncryptedBalanceView. */
export const toBalanceView = (result: {
  eGCT: { c1: { x: bigint; y: bigint }; c2: { x: bigint; y: bigint } };
  amountPCTs: readonly { pct: readonly bigint[]; index: bigint }[];
  balancePCT: readonly bigint[];
}): EncryptedBalanceView => ({
  eGCT: [
    BigInt(result.eGCT.c1.x),
    BigInt(result.eGCT.c1.y),
    BigInt(result.eGCT.c2.x),
    BigInt(result.eGCT.c2.y),
  ],
  amountPCTs: result.amountPCTs.map((a) => ({
    pct: a.pct.map((x) => BigInt(x)),
    index: BigInt(a.index),
  })),
  balancePCT: result.balancePCT.map((x) => BigInt(x)),
});
