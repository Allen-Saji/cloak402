# cloak402

Confidential x402 payments on Avalanche.

x402 lets clients and AI agents pay for HTTP APIs per request. Today every x402 payment on Avalanche settles as a plain USDC transfer: anyone watching the chain can see which services an agent uses, how often, and how much it spends. cloak402 keeps the rails and hides the numbers.

Payments settle through eERC (Encrypted ERC), AvaCloud's confidential token standard. Balances and transfer amounts stay encrypted on-chain under ElGamal + zk-SNARKs (Groth16). A rotatable auditor key gives compliance-grade visibility to exactly one designated party and nobody else.

## How it works

```
Agent (4337 smart account)          Facilitator                 API server
        |                                |                           |
        |--- GET /resource ------------------------------------------>
        |<-- 402 + eerc-exact requirements ---------------------------
        |                                |                           |
   generate transfer proof              |                           |
   (zk, client side, ~2s)               |                           |
        |                                |                           |
        |--- X-PAYMENT: UserOp --------->|                           |
        |                            verify proof                    |
        |                            settle via bundler              |
        |                            decrypt amount (auditor key)    |
        |                                |--- payment confirmed ---->|
        |<-- 200 + resource -------------------------------------------
```

- The agent's wallet is an ERC-4337 smart account. eERC binds transfers to msg.sender, so the account submits its own transfer through the EntryPoint while a paymaster covers gas. The agent never needs AVAX.
- The facilitator implements a custom x402 scheme, `eerc-exact`, registered for `eip155:43113` (Fuji). It verifies the zk proof, submits the UserOp through a bundler, and confirms the encrypted amount using the auditor key.
- Amounts are hidden from the public chain. The auditor role is held by the facilitator by default, or self-hosted by the API server for full privacy.

## Packages

| Package | Purpose |
|---|---|
| `packages/facilitator` | x402 facilitator with the `eerc-exact` scheme (verify + settle) |
| `packages/client` | Agent-side SDK: key derivation, transfer proof generation, 4337 UserOp construction |
| `packages/server-demo` | Demo paid API using the `eerc-exact` scheme |
| `vendor/EncryptedERC` | Pinned fork of ava-labs/EncryptedERC with Fuji deploy config |

## Status

Built for the Team1 India Speedrun: Privacy on Avalanche (July 2026). Testnet (Fuji) only. Not audited beyond the upstream eERC audit; do not use with real funds.

## Prior art

cloak402 ports the idea behind [px402](https://px402.allensaji.dev) (private x402 on Solana / MagicBlock private ephemeral rollups) to the Avalanche stack.

## License

MIT
