# x402 agent spending policy

AI agents should apply a local spending policy before authorizing an x402 payment. This toolkit includes a small, dependency-free preflight helper for Base Mainnet and Base Sepolia.

## Example

```js
import { evaluatePaymentPolicy } from "../src/payment-policy.js";

const decision = evaluatePaymentPolicy(
  {
    network: "base-sepolia",
    amount: "0.25",
    payTo: "0x1111111111111111111111111111111111111111",
  },
  {
    allowedNetworks: ["base-sepolia"],
    maxAmount: "1.00",
    allowedRecipients: ["0x1111111111111111111111111111111111111111"],
  },
);

if (!decision.allowed) {
  throw new Error(`Payment blocked: ${decision.reason}`);
}

// Only continue to your wallet / x402 client after the policy allows it.
console.log(decision.amountAtomic); // 250000n
```

## Policy behavior

- Requires an explicit network allowlist and maximum USDC amount.
- Uses the toolkit's exact six-decimal USDC parser; no floating-point comparisons.
- Rejects zero-value payments and malformed EVM recipient addresses.
- Optionally restricts recipients to an explicit address allowlist.
- Returns a structured denial reason instead of silently approving a payment.

## Important security boundary

This helper is a **preflight guard**, not an x402 implementation or a substitute for validating the final payment payload. It does not sign, verify, settle, or broadcast payments. Before signing, independently compare the actual x402 payment requirements and authorization against the policy; enforce limits again at the wallet/signing boundary. Never trust an agent-generated recipient or amount without checking it.

For the x402 protocol flow, see the [x402 facilitator documentation](https://github.com/x402-foundation/x402/blob/main/docs/core-concepts/facilitator.md). Use a facilitator that explicitly supports the selected network; the public development facilitator should not be assumed suitable for production.
