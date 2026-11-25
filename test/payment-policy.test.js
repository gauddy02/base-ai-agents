import test from "node:test";
import assert from "node:assert/strict";
import { evaluatePaymentPolicy } from "../src/payment-policy.js";

const recipient = "0x1111111111111111111111111111111111111111";
const otherRecipient = "0x2222222222222222222222222222222222222222";
const policy = {
  allowedNetworks: ["base-sepolia"],
  maxAmount: "2.50",
};

test("allows a payment within the configured network and amount cap", () => {
  const result = evaluatePaymentPolicy(
    { network: "eip155:84532", amount: "1.25", payTo: recipient },
    policy,
  );
  assert.equal(result.allowed, true);
  assert.equal(result.network, "eip155:84532");
  assert.equal(result.amountAtomic, 1250000n);
});

test("rejects a payment on a network outside the allowlist", () => {
  const result = evaluatePaymentPolicy(
    { network: "base", amount: "1", payTo: recipient },
    policy,
  );
  assert.deepEqual(result, { allowed: false, reason: "network_not_allowed" });
});

test("rejects amounts above the spending cap without floating point math", () => {
  const result = evaluatePaymentPolicy(
    { network: "sepolia", amount: "2.500001", payTo: recipient },
    policy,
  );
  assert.equal(result.allowed, false);
  assert.equal(result.reason, "amount_exceeds_limit");
  assert.equal(result.maxAmount, "2.5");
});

test("rejects zero-value payments", () => {
  const result = evaluatePaymentPolicy(
    { network: "sepolia", amount: "0", payTo: recipient },
    policy,
  );
  assert.equal(result.reason, "amount_must_be_positive");
});

test("rejects malformed recipients", () => {
  const result = evaluatePaymentPolicy(
    { network: "sepolia", amount: "1", payTo: "not-an-address" },
    policy,
  );
  assert.equal(result.reason, "invalid_recipient");
});

test("enforces an optional recipient allowlist case-insensitively", () => {
  const result = evaluatePaymentPolicy(
    { network: "sepolia", amount: "1", payTo: recipient.toUpperCase().replace("0X", "0x") },
    { ...policy, allowedRecipients: [recipient] },
  );
  assert.equal(result.allowed, true);

  const denied = evaluatePaymentPolicy(
    { network: "sepolia", amount: "1", payTo: otherRecipient },
    { ...policy, allowedRecipients: [recipient] },
  );
  assert.equal(denied.reason, "recipient_not_allowed");
});

test("requires explicit network and amount limits", () => {
  assert.throws(() => evaluatePaymentPolicy(
    { network: "sepolia", amount: "1", payTo: recipient },
    { maxAmount: "2" },
  ), /allowed network/);
  assert.throws(() => evaluatePaymentPolicy(
    { network: "sepolia", amount: "1", payTo: recipient },
    { allowedNetworks: ["sepolia"] },
  ), /maxAmount/);
});
