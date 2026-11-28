import test from "node:test";
import assert from "node:assert/strict";
import { getBaseRpcUrl } from "../src/networks.js";

test("uses the public RPC endpoint for each Base network by default", () => {
  assert.equal(getBaseRpcUrl("base"), "https://mainnet.base.org");
  assert.equal(getBaseRpcUrl("sepolia"), "https://sepolia.base.org");
});

test("uses the network-specific environment override", () => {
  assert.equal(
    getBaseRpcUrl("base", { BASE_MAINNET_RPC_URL: "https://rpc.example/mainnet" }),
    "https://rpc.example/mainnet",
  );
  assert.equal(
    getBaseRpcUrl("sepolia", { BASE_SEPOLIA_RPC_URL: "https://rpc.example/testnet" }),
    "https://rpc.example/testnet",
  );
});

test("ignores empty overrides and accepts local HTTP development endpoints", () => {
  assert.equal(getBaseRpcUrl("base", { BASE_MAINNET_RPC_URL: "  " }), "https://mainnet.base.org");
  assert.equal(
    getBaseRpcUrl("sepolia", { BASE_SEPOLIA_RPC_URL: "http://127.0.0.1:8545" }),
    "http://127.0.0.1:8545",
  );
});

test("rejects malformed, non-HTTP, and credential-bearing RPC URLs", () => {
  for (const value of ["not-a-url", "ftp://rpc.example", "https://user:secret@rpc.example"]) {
    assert.throws(
      () => getBaseRpcUrl("base", { BASE_MAINNET_RPC_URL: value }),
      /Base RPC URL/,
    );
  }
});

test("rejects unsupported network identifiers", () => {
  assert.throws(() => getBaseRpcUrl("ethereum"), /Unsupported Base network/);
});
