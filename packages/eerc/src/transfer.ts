import { encryptMessage } from "./vendor/jub.js";
import { processPoseidonEncryption } from "./vendor/poseidon.js";

/**
 * Transfer circuit public signal layout (32 signals). Order follows the
 * SIGNAL DECLARATION order in circom/transfer.circom (public inputs only),
 * NOT the `public [...]` list order. Cross-checked against the contract:
 * EncryptedERC._executePrivateTransfer reads sender key at [0,1], receiver
 * key at [10,11], auditor key at [23,24], auditor PCT at [25..31].
 */
export const TRANSFER_SIGNALS = {
  senderPublicKey: [0, 2],
  senderBalanceC1: [2, 4],
  senderBalanceC2: [4, 6],
  senderVTTC1: [6, 8],
  senderVTTC2: [8, 10],
  receiverPublicKey: [10, 12],
  receiverVTTC1: [12, 14],
  receiverVTTC2: [14, 16],
  receiverPCT: [16, 20],
  receiverPCTAuthKey: [20, 22],
  receiverPCTNonce: [22, 23],
  auditorPublicKey: [23, 25],
  auditorPCT: [25, 29],
  auditorPCTAuthKey: [29, 31],
  auditorPCTNonce: [31, 32],
} as const;

export const TRANSFER_SIGNAL_COUNT = 32;

export const signalSlice = (
  signals: bigint[],
  range: readonly [number, number],
): bigint[] => signals.slice(range[0], range[1]);

/** Registration circuit public signals: [pubX, pubY, address, chainId, registrationHash] */
export const REGISTRATION_SIGNAL_COUNT = 5;

export interface TransferInputParams {
  amount: bigint;
  senderFormattedKey: bigint;
  senderPublicKey: [bigint, bigint];
  /** decrypted current balance in eERC system units */
  senderBalance: bigint;
  /** current on-chain ElGamal balance ciphertext [c1x, c1y, c2x, c2y] */
  senderEncryptedBalance: [bigint, bigint, bigint, bigint];
  receiverPublicKey: [bigint, bigint];
  auditorPublicKey: [bigint, bigint];
}

export interface TransferWitness {
  circuitInput: Record<string, unknown>;
  /** sender's post-transfer balance PCT, passed alongside the proof */
  senderBalancePCT: bigint[];
}

/**
 * Builds the full witness input for the transfer circuit plus the sender's
 * new balance PCT. Mirrors test/helpers.ts privateTransfer in the eERC repo.
 */
export const buildTransferWitness = (
  params: TransferInputParams,
): TransferWitness => {
  const {
    amount,
    senderFormattedKey,
    senderPublicKey,
    senderBalance,
    senderEncryptedBalance,
    receiverPublicKey,
    auditorPublicKey,
  } = params;

  if (amount <= 0n) throw new Error("transfer amount must be positive");
  if (senderBalance < amount) {
    throw new Error(
      `insufficient encrypted balance: have ${senderBalance}, need ${amount}`,
    );
  }

  const senderNewBalance = senderBalance - amount;
  const { cipher: senderVTT } = encryptMessage(senderPublicKey, amount);
  const { cipher: receiverVTT, random: receiverVTTRandom } = encryptMessage(
    receiverPublicKey,
    amount,
  );
  const receiverPCT = processPoseidonEncryption([amount], receiverPublicKey);
  const auditorPCT = processPoseidonEncryption([amount], auditorPublicKey);
  const senderBalancePCT = processPoseidonEncryption(
    [senderNewBalance],
    senderPublicKey,
  );

  return {
    circuitInput: {
      ValueToTransfer: amount,
      SenderPrivateKey: senderFormattedKey,
      SenderPublicKey: senderPublicKey,
      SenderBalance: senderBalance,
      SenderBalanceC1: senderEncryptedBalance.slice(0, 2),
      SenderBalanceC2: senderEncryptedBalance.slice(2, 4),
      SenderVTTC1: senderVTT[0],
      SenderVTTC2: senderVTT[1],
      ReceiverPublicKey: receiverPublicKey,
      ReceiverVTTC1: receiverVTT[0],
      ReceiverVTTC2: receiverVTT[1],
      ReceiverVTTRandom: receiverVTTRandom,
      ReceiverPCT: receiverPCT.ciphertext,
      ReceiverPCTAuthKey: receiverPCT.authKey,
      ReceiverPCTNonce: receiverPCT.nonce,
      ReceiverPCTRandom: receiverPCT.encRandom,
      AuditorPublicKey: auditorPublicKey,
      AuditorPCT: auditorPCT.ciphertext,
      AuditorPCTAuthKey: auditorPCT.authKey,
      AuditorPCTNonce: auditorPCT.nonce,
      AuditorPCTRandom: auditorPCT.encRandom,
    },
    senderBalancePCT: pctToArray(senderBalancePCT),
  };
};

/** Flattens a processPoseidonEncryption result into the uint256[7] PCT layout. */
export const pctToArray = (pct: {
  ciphertext: bigint[];
  authKey: bigint[];
  nonce: bigint;
}): bigint[] => [...pct.ciphertext, ...pct.authKey, pct.nonce];

export interface RegistrationWitnessParams {
  formattedKey: bigint;
  publicKey: [bigint, bigint];
  account: string;
  chainId: bigint;
  registrationHash: bigint;
}

export const buildRegistrationWitness = (
  params: RegistrationWitnessParams,
): Record<string, unknown> => ({
  SenderPrivateKey: params.formattedKey,
  SenderPublicKey: params.publicKey,
  SenderAddress: BigInt(params.account),
  ChainID: params.chainId,
  RegistrationHash: params.registrationHash,
});
