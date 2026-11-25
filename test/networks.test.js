import test from "node:test";
import assert from "node:assert/strict";
import { getBaseNetwork, getExplorerUrl } from "../src/networks.js";

test("resolves Base Mainnet aliases", () => {
  for (const alias of ["base", "mainnet", "8453", "eip155:8453"]) {
    assert.equal(getBaseNetwork(alias).chainId, 8453);
  }
});

test("resolves Base Sepolia aliases", () => {
  for (const alias of ["sepolia", "84532", "eip155:84532"]) {
    assert.equal(getBaseNetwork(alias).chainId, 84532);
  }
});

test("returns official USDC addresses for both networks", () => {
  assert.equal(getBaseNetwork("base").usdc, "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
  assert.equal(getBaseNetwork("sepolia").usdc, "0x036CbD53842c5426634e7929541eC2318f3dCF7e");
});

test("rejects networks outside Base", () => {
  assert.throws(() => getBaseNetwork("ethereum"), /Unsupported Base network/);
});

test("builds correct Basescan transaction and address URLs", () => {
  const hash = "0x" + "a".repeat(64);
  const address = "0x" + "b".repeat(40);
  assert.equal(getExplorerUrl("base", hash), `https://basescan.org/tx/${hash}`);
  assert.equal(getExplorerUrl("sepolia", address, "address"), `https://sepolia.basescan.org/address/${address}`);
});

test("rejects invalid explorer values and types", () => {
  assert.throws(() => getExplorerUrl("base", "not-a-hash"), /valid EVM/);
  assert.throws(() => getExplorerUrl("base", "0x" + "a".repeat(64), "block"), /Explorer type/);
});
