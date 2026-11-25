const DECIMALS = 6;
const UNIT = 10n ** BigInt(DECIMALS);

/**
 * Convert a human-readable USDC amount to atomic units without floating point.
 * Accepts at most six decimal places and rejects negative values.
 */
export function parseUsdc(amount) {
  if (typeof amount !== "string" && typeof amount !== "number") {
    throw new TypeError("USDC amount must be a string or number");
  }
  const value = String(amount);
  if (!/^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/.test(value)) {
    throw new Error("USDC amount must be non-negative with at most 6 decimals");
  }
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * UNIT + BigInt(fraction.padEnd(DECIMALS, "0") || "0");
}

/** Convert USDC atomic units (a bigint or integer string) to a decimal string. */
export function formatUsdc(atomicAmount) {
  if (
    (typeof atomicAmount !== "bigint" && typeof atomicAmount !== "string") ||
    !/^(0|[1-9][0-9]*)$/.test(String(atomicAmount))
  ) {
    throw new Error("Atomic USDC amount must be a non-negative integer");
  }
  const amount = BigInt(atomicAmount);
  const whole = amount / UNIT;
  const fraction = (amount % UNIT).toString().padStart(DECIMALS, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
