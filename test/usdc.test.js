import test from "node:test";
import assert from "node:assert/strict";
import { parseUsdc, formatUsdc } from "../src/usdc.js";

test("converts whole and fractional USDC amounts exactly", () => {
  assert.equal(parseUsdc("1"), 1000000n);
  assert.equal(parseUsdc("0.25"), 250000n);
  assert.equal(parseUsdc("12.345678"), 12345678n);
});

test("round-trips USDC atomic units without floating point", () => {
  for (const value of ["0", "0.000001", "1", "1.2", "1000000.000001"]) {
    assert.equal(formatUsdc(parseUsdc(value)), value.replace(/\.0+$/, ""));
  }
});

test("accepts integer strings and bigints when formatting", () => {
  assert.equal(formatUsdc("1000000"), "1");
  assert.equal(formatUsdc(250000n), "0.25");
});

test("rejects negative, malformed, and over-precision values", () => {
  for (const value of ["-1", "1.0000001", "01", "1e-6", "1.2.3", ""]) {
    assert.throws(() => parseUsdc(value));
  }
});

test("rejects invalid atomic values", () => {
  for (const value of ["-1", "1.5", "01", null, 100]) {
    assert.throws(() => formatUsdc(value));
  }
});
