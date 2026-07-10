import { ethers } from "ethers";

/** EntryPoint v0.7 packed user operation, as passed to handleOps. */
export interface PackedUserOperation {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  accountGasLimits: string;
  preVerificationGas: bigint;
  gasFees: string;
  paymasterAndData: string;
  signature: string;
}

/** JSON-safe wire form carried inside the x402 payment payload. */
export interface SerializedUserOperation {
  sender: string;
  nonce: string;
  initCode: string;
  callData: string;
  accountGasLimits: string;
  preVerificationGas: string;
  gasFees: string;
  paymasterAndData: string;
  signature: string;
}

export const packUint128Pair = (hi: bigint, lo: bigint): string =>
  ethers.solidityPacked(["uint128", "uint128"], [hi, lo]);

export const unpackUint128Pair = (packed: string): [bigint, bigint] => {
  const value = BigInt(packed);
  return [value >> 128n, value & ((1n << 128n) - 1n)];
};

export const serializeUserOp = (
  op: PackedUserOperation,
): SerializedUserOperation => ({
  ...op,
  nonce: op.nonce.toString(),
  preVerificationGas: op.preVerificationGas.toString(),
});

export const deserializeUserOp = (
  op: SerializedUserOperation,
): PackedUserOperation => {
  for (const field of [
    "sender",
    "initCode",
    "callData",
    "accountGasLimits",
    "gasFees",
    "paymasterAndData",
    "signature",
  ] as const) {
    if (!ethers.isHexString(op[field])) {
      throw new Error(`userOp.${field} is not a hex string`);
    }
  }
  return {
    sender: ethers.getAddress(op.sender),
    nonce: BigInt(op.nonce),
    initCode: op.initCode,
    callData: op.callData,
    accountGasLimits: op.accountGasLimits,
    preVerificationGas: BigInt(op.preVerificationGas),
    gasFees: op.gasFees,
    paymasterAndData: op.paymasterAndData,
    signature: op.signature,
  };
};

export interface UserOpGasOptions {
  verificationGas?: bigint;
  callGas?: bigint;
  preVerificationGas?: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}

/** Builds an unsigned PackedUserOperation with the given calldata. */
export const buildUserOp = (
  sender: string,
  nonce: bigint,
  callData: string,
  gas: UserOpGasOptions,
  initCode = "0x",
): PackedUserOperation => ({
  sender,
  nonce,
  initCode,
  callData,
  accountGasLimits: packUint128Pair(
    gas.verificationGas ?? 300_000n,
    gas.callGas ?? 500_000n,
  ),
  preVerificationGas: gas.preVerificationGas ?? 100_000n,
  gasFees: packUint128Pair(gas.maxPriorityFeePerGas, gas.maxFeePerGas),
  paymasterAndData: "0x",
  signature: "0x",
});
