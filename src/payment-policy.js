import { getBaseNetwork } from "./networks.js";
import { parseUsdc, formatUsdc } from "./usdc.js";

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/;

/**
 * Evaluate an agent payment against an explicit spending policy.
 *
 * payment: { network, amount, payTo }
 * policy: { allowedNetworks, maxAmount, allowedRecipients? }
 *
 * This is a local preflight guard only. It does not verify an x402 payload,
 * sign an authorization, or guarantee that a later settlement matches it.
 */
export function evaluatePaymentPolicy(payment, policy) {
  if (!payment || typeof payment !== "object") {
    throw new TypeError("Payment must be an object");
  }
  if (!policy || typeof policy !== "object") {
    throw new TypeError("Policy must be an object");
  }
  if (!Array.isArray(policy.allowedNetworks) || policy.allowedNetworks.length === 0) {
    throw new Error("Policy must specify at least one allowed network");
  }
  if (policy.maxAmount === undefined || policy.maxAmount === null) {
    throw new Error("Policy must specify maxAmount in USDC");
  }

  const network = getBaseNetwork(payment.network);
  const allowedNetworks = policy.allowedNetworks.map((item) => getBaseNetwork(item).caip2);
  const amountAtomic = parseUsdc(payment.amount);
  const maxAmountAtomic = parseUsdc(policy.maxAmount);

  if (!allowedNetworks.includes(network.caip2)) {
    return { allowed: false, reason: "network_not_allowed" };
  }
  if (amountAtomic === 0n) {
    return { allowed: false, reason: "amount_must_be_positive" };
  }
  if (amountAtomic > maxAmountAtomic) {
    return {
      allowed: false,
      reason: "amount_exceeds_limit",
      maxAmount: formatUsdc(maxAmountAtomic),
    };
  }
  if (typeof payment.payTo !== "string" || !ADDRESS_PATTERN.test(payment.payTo)) {
    return { allowed: false, reason: "invalid_recipient" };
  }

  if (policy.allowedRecipients !== undefined) {
    if (!Array.isArray(policy.allowedRecipients) || policy.allowedRecipients.length === 0) {
      throw new Error("allowedRecipients must be a non-empty array when provided");
    }
    const recipients = policy.allowedRecipients.map((address) => {
      if (typeof address !== "string" || !ADDRESS_PATTERN.test(address)) {
        throw new Error("Policy contains an invalid recipient address");
      }
      return address.toLowerCase();
    });
    if (!recipients.includes(payment.payTo.toLowerCase())) {
      return { allowed: false, reason: "recipient_not_allowed" };
    }
  }

  return {
    allowed: true,
    network: network.caip2,
    amountAtomic,
    payTo: payment.payTo,
  };
}
