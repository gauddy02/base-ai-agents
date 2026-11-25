# Base AI Agents Toolkit

Small, dependency-free utilities for AI agents and applications built on Base.

## What's included

- **Base network metadata:** chain IDs, CAIP-2 identifiers, RPC environment-variable names, Basescan URLs, and official USDC contract addresses for Base Mainnet and Base Sepolia.
- **Network normalization:** resolve common aliases such as `base`, `mainnet`, `sepolia`, numeric chain IDs, and CAIP-2 identifiers.
- **Explorer links:** safely build Basescan transaction and address URLs.
- **Exact USDC math:** convert human-readable amounts to six-decimal atomic units using `BigInt`, avoiding floating-point rounding errors.

## Requirements

- Node.js 20 or newer
- npm

## Install and test

```bash
npm test
```

No third-party runtime dependencies are required.

## Quick start

```js
import { getBaseNetwork, getExplorerUrl } from "./src/networks.js";
import { parseUsdc, formatUsdc } from "./src/usdc.js";

const network = getBaseNetwork("eip155:84532");
console.log(network.name);       // Base Sepolia
console.log(network.chainId);    // 84532
console.log(network.usdc);       // Base Sepolia USDC contract

const paymentAmount = parseUsdc("0.025");
console.log(paymentAmount);      // 25000n (USDC atomic units)
console.log(formatUsdc(paymentAmount)); // "0.025"

const txHash = "0x" + "a".repeat(64);
console.log(getExplorerUrl("sepolia", txHash));
// https://sepolia.basescan.org/tx/0x...
```

## API

### `getBaseNetwork(input)`

Accepts `base`, `mainnet`, `8453`, `eip155:8453`, `base-mainnet`, `sepolia`, `84532`, `eip155:84532`, or `base-sepolia`. Returns a fresh network metadata object. Throws for unsupported networks.

### `getExplorerUrl(network, value, type = "tx")`

Builds a Basescan URL for a 32-byte transaction hash or 20-byte EVM address. The type must be `tx` or `address`.

### `parseUsdc(amount)`

Converts a non-negative decimal amount with up to six fractional digits into a `BigInt` atomic-unit value. Pass amounts as strings to preserve the exact input.

### `formatUsdc(atomicAmount)`

Converts a non-negative integer string or `BigInt` atomic-unit value into a trimmed decimal string.

## Safety notes

- These helpers do not connect to an RPC endpoint, sign transactions, or move funds.
- Never hardcode private keys or seed phrases.
- Use Base Sepolia while developing and verify network/token configuration before mainnet use.
- Treat values returned by external APIs as untrusted input.

## Network references

- [Base documentation](https://docs.base.org/)
- [Base Mainnet explorer](https://basescan.org/)
- [Base Sepolia explorer](https://sepolia.basescan.org/)
- [Circle USDC contract addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses)
