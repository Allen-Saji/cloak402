# The eerc-exact scheme

An x402 v2 payment scheme for confidential payments through eERC (Encrypted ERC) on Avalanche. Registered for `eip155:43113` (Fuji).

## Summary

| Field | Value |
|---|---|
| Scheme id | `eerc-exact` |
| Protocol | x402 v2 |
| Network | `eip155:43113` |
| Asset | the EncryptedERC contract address |
| Amount | eERC system units (6 decimals) |
| Settlement | ERC-4337 UserOperation self-bundled by the facilitator |

## PaymentRequirements

```json
{
  "scheme": "eerc-exact",
  "network": "eip155:43113",
  "amount": "100000",
  "asset": "0x2A60EF46E6D65580144c734592AA8D163A97EFdd",
  "payTo": "0xae43...229b",
  "maxTimeoutSeconds": 120,
  "extra": {
    "entryPoint": "0x0000000071727De22E5E9d8BAf0edAc6f37da032",
    "simpleAccountFactory": "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985",
    "registrar": "0xf851...CD9A",
    "encryptedERC": "0x2A60...EFdd",
    "erc20": "0xB7f1...Ebca",
    "auditorPublicKey": ["...", "..."],
    "decimals": 6
  }
}
```

`payTo` must be an address registered in the eERC Registrar. `extra` is advertised by the facilitator through `GET /supported` and merged into requirements by the resource server.

## PaymentPayload

The `X-PAYMENT` / `PAYMENT-SIGNATURE` header carries:

```json
{
  "x402Version": 2,
  "payload": {
    "userOp": {
      "sender": "0x...",
      "nonce": "3",
      "initCode": "0x",
      "callData": "0x...",
      "accountGasLimits": "0x...",
      "preVerificationGas": "100000",
      "gasFees": "0x...",
      "paymasterAndData": "0x",
      "signature": "0x..."
    }
  }
}
```

`userOp` is an EntryPoint v0.7 PackedUserOperation whose callData is
`SimpleAccount.execute(encryptedERC, 0, transfer(payTo, tokenId, proof, balancePCT))`,
where `proof` is a Groth16 transfer proof with 32 public signals. The proof commits to the sender's current balance ciphertext, the receiver, the amount, and the auditor ciphertext, so the payload is single-use and tamper-evident by construction. eERC binds `transfer` to `msg.sender`, which the EntryPoint sets to the smart account.

## Verification (facilitator)

All checks are static reads; verify never mutates chain state.

1. `requirements.scheme`, `network`, and `asset` match the deployment.
2. The UserOperation decodes to `execute(encryptedERC, 0, transfer(...))`.
3. `transfer.to == requirements.payTo` and the token id matches the converter's registered ERC20.
4. Payer and receiver are registered in the Registrar.
5. Public signals [0,1] equal the payer's registered BabyJubJub key; [10,11] equal the receiver's.
6. Public signals [2..5] equal the payer's live on-chain balance ciphertext (freshness: a spent or superseded proof cannot match).
7. Public signals [23,24] equal the facilitator's auditor key, and the auditor PCT [25..31] decrypts to exactly `requirements.amount`.
8. The Groth16 proof verifies against the audited on-chain TransferVerifier (staticcall).
9. The UserOperation nonce equals the account's current EntryPoint nonce.

The decrypted amount check is the confidential analogue of checking a USDC transfer value: only the auditor (the facilitator by default) can size the payment; the public chain cannot.

## Settlement (facilitator)

1. Re-verify.
2. Serialize per sender: proofs commit to the balance ciphertext, so concurrent settlements from one account would revert. Different senders settle in parallel.
3. Sponsor gas: top up the account's EntryPoint deposit when below a threshold. The agent's owner EOA never holds AVAX.
4. Self-bundle: `entryPoint.handleOps([userOp], facilitator)`. No external bundler or paymaster service.
5. Confirm the `UserOperationEvent.success` flag (handleOps itself succeeds even when the inner call reverts).

## Latency

Transfer proof generation is about 2.4s client side (reads, witness, Groth16 prove, sign). A full paid request (402, proof, verify, settle with on-chain inclusion, 200) measures about 8.7s against public Fuji RPC with settle-before-respond, down from about 14s before three optimizations: all independent chain reads in verify are issued in one tick so the provider batches them into a single RPC round trip (verify: 2.4s to 0.45s), receipt polling runs at 1s instead of the ethers 4s default to match Fuji's 2s blocks, and the client builds the payment UserOperation with batched reads plus a cached token id. The remaining floor is proof generation plus one block of inclusion time. Verify-only response with async settlement would cut this to roughly proof time plus one roundtrip, at the cost of serving the request before the transfer lands (and the response could no longer carry the settlement transaction hash).

## Transfer circuit public signal layout

Order follows the signal declaration order in `circom/transfer.circom` (public inputs only), cross-checked against `EncryptedERC._executePrivateTransfer`:

| Index | Signal |
|---|---|
| 0-1 | SenderPublicKey |
| 2-3 | SenderBalanceC1 |
| 4-5 | SenderBalanceC2 |
| 6-7 | SenderVTTC1 |
| 8-9 | SenderVTTC2 |
| 10-11 | ReceiverPublicKey |
| 12-13 | ReceiverVTTC1 |
| 14-15 | ReceiverVTTC2 |
| 16-19 | ReceiverPCT |
| 20-21 | ReceiverPCTAuthKey |
| 22 | ReceiverPCTNonce |
| 23-24 | AuditorPublicKey |
| 25-28 | AuditorPCT |
| 29-30 | AuditorPCTAuthKey |
| 31 | AuditorPCTNonce |
