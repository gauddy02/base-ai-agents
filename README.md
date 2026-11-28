# Base AI Agents Toolkit

Small, dependency-free utilities for AI agents and applications built on Base.

## What's included

- **Base network metadata:** chain IDs, CAIP-2 identifiers, RPC environment-variable names, default RPC endpoints, Basescan URLs, and official USDC contract addresses for Base Mainnet and Base Sepolia.
- **RPC endpoint resolution:** select the correct public Base RPC endpoint or provide a network-specific custom endpoint.
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
import { getBaseNetwork, getBaseRpcUrl, getExplorerUrl } from "./src/networks.js";
import { parseUsdc, formatUsdc } from "./src/usdc.js";

const network = getBaseNetwork("eip155:84532");
console.log(network.name);       // Base Sepolia
console.log(network.chainId);    // 84532
console.log(network.usdc);       // Base Sepolia USDC contract

// Uses the public endpoint unless the matching environment variable is set.
const rpcUrl = getBaseRpcUrl("sepolia", process.env);
console.log(rpcUrl); // https://sepolia.base.org (by default)

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

### `getBaseRpcUrl(network, env = {})`

Returns the configured RPC URL for a supported Base network. It reads `BASE_MAINNET_RPC_URL` for Mainnet or `BASE_SEPOLIA_RPC_URL` for Sepolia from the optional environment-like object. If the value is missing or blank, it falls back to the public endpoint (`https://mainnet.base.org` or `https://sepolia.base.org`). Only absolute HTTP(S) URLs without embedded credentials are accepted. Pass `process.env` in Node.js to use environment variables.

### `getExplorerUrl(network, value, type = "tx")`

Builds a Basescan URL for a 32-byte transaction hash or 20-byte EVM address. The type must be `tx` or `address`.

### `parseUsdc(amount)`

Converts a non-negative decimal amount with up to six fractional digits into a `BigInt` atomic-unit value. Pass amounts as strings to preserve the exact input.

### `formatUsdc(atomicAmount)`

Converts a non-negative integer string or `BigInt` atomic-unit value into a trimmed decimal string.

## Safety notes

- The RPC URL helper only resolves configuration; it does not make RPC requests, sign transactions, or move funds.
- Public RPC endpoints may have rate limits. Use a provider endpoint for production workloads and keep provider credentials in environment variables.
- Never hardcode private keys or seed phrases.
- Use Base Sepolia while developing and verify network/token configuration before mainnet use.
- Treat values returned by external APIs as untrusted input.

## Network references

- [Base network information](https://docs.base.org/base-chain/network-information)
- [Base documentation](https://docs.base.org/)
- [Base Mainnet explorer](https://basescan.org/)
- [Base Sepolia explorer](https://sepolia.basescan.org/)
- [Circle USDC contract addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses)
