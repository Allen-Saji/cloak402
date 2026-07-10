import * as snarkjs from "snarkjs";

export interface ProofPoints {
  a: [bigint, bigint];
  b: [[bigint, bigint], [bigint, bigint]];
  c: [bigint, bigint];
}

export interface CircuitArtifacts {
  wasm: string;
  zkey: string;
}

/** snarkjs groth16 proof -> the verifier's expected calldata layout (b swapped) */
export const toProofPoints = (proof: snarkjs.Groth16Proof): ProofPoints => ({
  a: [BigInt(proof.pi_a[0]), BigInt(proof.pi_a[1])],
  b: [
    [BigInt(proof.pi_b[0][1]), BigInt(proof.pi_b[0][0])],
    [BigInt(proof.pi_b[1][1]), BigInt(proof.pi_b[1][0])],
  ],
  c: [BigInt(proof.pi_c[0]), BigInt(proof.pi_c[1])],
});

export interface GeneratedProof {
  proofPoints: ProofPoints;
  publicSignals: bigint[];
}

export const prove = async (
  artifacts: CircuitArtifacts,
  input: Record<string, unknown>,
): Promise<GeneratedProof> => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input as snarkjs.CircuitSignals,
    artifacts.wasm,
    artifacts.zkey,
  );
  return {
    proofPoints: toProofPoints(proof),
    publicSignals: publicSignals.map((s) => BigInt(s)),
  };
};
