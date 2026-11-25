const NETWORKS = {
  "base-mainnet": {
    name: "Base",
    network: "base-mainnet",
    chainId: 8453,
    caip2: "eip155:8453",
    rpcEnv: "BASE_MAINNET_RPC_URL",
    explorerUrl: "https://basescan.org",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
  "base-sepolia": {
    name: "Base Sepolia",
    network: "base-sepolia",
    chainId: 84532,
    caip2: "eip155:84532",
    rpcEnv: "BASE_SEPOLIA_RPC_URL",
    explorerUrl: "https://sepolia.basescan.org",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
};

const ALIASES = new Map([
  ["base", "base-mainnet"],
  ["mainnet", "base-mainnet"],
  ["8453", "base-mainnet"],
  ["eip155:8453", "base-mainnet"],
  ["base-mainnet", "base-mainnet"],
  ["sepolia", "base-sepolia"],
  ["84532", "base-sepolia"],
  ["eip155:84532", "base-sepolia"],
  ["base-sepolia", "base-sepolia"],
]);

/** Resolve a Base network from a name, chain ID, or CAIP-2 identifier. */
export function getBaseNetwork(input) {
  const key = String(input ?? "").toLowerCase();
  const canonical = ALIASES.get(key);
  if (!canonical) {
    throw new Error(`Unsupported Base network: ${String(input)}`);
  }
  return Object.freeze({ ...NETWORKS[canonical] });
}

/** Build a Basescan URL for a transaction or address. */
export function getExplorerUrl(network, value, type = "tx") {
  if (type !== "tx" && type !== "address") {
    throw new Error('Explorer type must be "tx" or "address"');
  }
  if (typeof value !== "string" || !/^0x[a-fA-F0-9]{40}$|^0x[a-fA-F0-9]{64}$/.test(value)) {
    throw new Error("Expected a valid EVM address or transaction hash");
  }
  const base = getBaseNetwork(network).explorerUrl;
  return `${base}/${type}/${value}`;
}
