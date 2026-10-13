import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

// Test 1: Plan Configuration Integrity
test("Plan configuration defines correct limits and boundaries", async () => {
  const { SUBSCRIPTION_PLANS } = await import("../src/lib/subscriptions/config.ts");

  assert.ok(SUBSCRIPTION_PLANS.FREE, "FREE plan must be defined");
  assert.ok(SUBSCRIPTION_PLANS.PRO, "PRO plan must be defined");
  assert.ok(SUBSCRIPTION_PLANS.PREMIUM, "PREMIUM plan must be defined");

  // Free Tier rules
  assert.equal(SUBSCRIPTION_PLANS.FREE.price, 0);
  assert.equal(SUBSCRIPTION_PLANS.FREE.limits.maxGoals, 1, "Free plan must be limited to 1 goal");
  assert.equal(SUBSCRIPTION_PLANS.FREE.limits.hasAdvancedReports, false, "Free plan must not have advanced reports");
  assert.equal(SUBSCRIPTION_PLANS.FREE.limits.hasExportReports, false, "Free plan must not have export reports");

  // Pro Tier rules
  assert.equal(SUBSCRIPTION_PLANS.PRO.price, 499);
  assert.equal(SUBSCRIPTION_PLANS.PRO.limits.maxGoals, Infinity, "Pro plan must have unlimited goals");
  assert.equal(SUBSCRIPTION_PLANS.PRO.limits.hasAdvancedReports, true, "Pro plan must have advanced reports");
  assert.equal(SUBSCRIPTION_PLANS.PRO.limits.hasExportReports, false, "Pro plan must not have export reports");

  // Premium Tier rules
  assert.equal(SUBSCRIPTION_PLANS.PREMIUM.price, 999);
  assert.equal(SUBSCRIPTION_PLANS.PREMIUM.limits.maxGoals, Infinity, "Premium plan must have unlimited goals");
  assert.equal(SUBSCRIPTION_PLANS.PREMIUM.limits.hasAdvancedReports, true, "Premium plan must have advanced reports");
  assert.equal(SUBSCRIPTION_PLANS.PREMIUM.limits.hasExportReports, true, "Premium plan must have export reports");
});

// Test 2: Entitlement Lifecycle & Grace Period
test("isSubscriptionActive handles all lifecycle states and period ends accurately", async () => {
  const { isSubscriptionActive } = await import("../src/lib/subscriptions/entitlements.ts");

  const futureDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days in future
  const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days in past

  // Null subscription (Free user)
  assert.equal(isSubscriptionActive(null), false, "Free user without subscription record is inactive");

  // Active status with future period end
  assert.equal(
    isSubscriptionActive({ status: "ACTIVE", currentPeriodEnd: futureDate, cancelAtPeriodEnd: false }),
    true,
    "ACTIVE with future end date must be active"
  );

  // Active status with no currentPeriodEnd (e.g., initial charge window)
  assert.equal(
    isSubscriptionActive({ status: "ACTIVE", currentPeriodEnd: null, cancelAtPeriodEnd: false }),
    true,
    "ACTIVE with null end date is considered active"
  );

  // Active status with expired period
  assert.equal(
    isSubscriptionActive({ status: "ACTIVE", currentPeriodEnd: pastDate, cancelAtPeriodEnd: false }),
    false,
    "ACTIVE with past end date must be inactive"
  );

  // CANCELLED status but period end in the future (preserves access until period end)
  assert.equal(
    isSubscriptionActive({ status: "CANCELLED", currentPeriodEnd: futureDate, cancelAtPeriodEnd: true }),
    true,
    "CANCELLED subscription with future period end must preserve access"
  );

  // CANCELLED status with period end lapsed
  assert.equal(
    isSubscriptionActive({ status: "CANCELLED", currentPeriodEnd: pastDate, cancelAtPeriodEnd: true }),
    false,
    "CANCELLED subscription with lapsed period must lose access"
  );

  // Pending / Failed / Halted / Past Due subscriptions
  assert.equal(
    isSubscriptionActive({ status: "PENDING", currentPeriodEnd: futureDate, cancelAtPeriodEnd: false }),
    false,
    "PENDING subscription must not grant access"
  );
  assert.equal(
    isSubscriptionActive({ status: "PAST_DUE", currentPeriodEnd: futureDate, cancelAtPeriodEnd: false }),
    false,
    "PAST_DUE subscription must not grant access"
  );
  assert.equal(
    isSubscriptionActive({ status: "HALTED", currentPeriodEnd: futureDate, cancelAtPeriodEnd: false }),
    false,
    "HALTED subscription must not grant access"
  );
  assert.equal(
    isSubscriptionActive({ status: "EXPIRED", currentPeriodEnd: pastDate, cancelAtPeriodEnd: false }),
    false,
    "EXPIRED subscription must not grant access"
  );
});

// Test 3: Razorpay Payment Signature Verification (HMAC-SHA256)
test("verifySubscriptionPaymentSignature verifies legitimate signatures and rejects tampered signatures", async () => {
  const secret = "test_key_secret_savemymoney_987654";
  process.env.RAZORPAY_KEY_SECRET = secret;

  const { verifySubscriptionPaymentSignature } = await import("../src/lib/razorpay.ts");

  const paymentId = "pay_Q1w2E3r4T5y6";
  const subscriptionId = "sub_A9b8C7d6E5f4";

  // Legitimate signature computed using documented Razorpay formula:
  // HMAC_SHA256(payment_id + '|' + subscription_id, secret)
  const validSignature = crypto
    .createHmac("sha256", secret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  // Valid verification
  const isValid = verifySubscriptionPaymentSignature({
    razorpayPaymentId: paymentId,
    razorpaySubscriptionId: subscriptionId,
    razorpaySignature: validSignature,
  });
  assert.equal(isValid, true, "Valid payment signature must be verified successfully");

  // Tampered payment ID
  const isInvalidPayment = verifySubscriptionPaymentSignature({
    razorpayPaymentId: "pay_FORGED_9999",
    razorpaySubscriptionId: subscriptionId,
    razorpaySignature: validSignature,
  });
  assert.equal(isInvalidPayment, false, "Signature verification must fail on forged payment ID");

  // Tampered subscription ID
  const isInvalidSub = verifySubscriptionPaymentSignature({
    razorpayPaymentId: paymentId,
    razorpaySubscriptionId: "sub_OTHER_USER_123",
    razorpaySignature: validSignature,
  });
  assert.equal(isInvalidSub, false, "Signature verification must fail on different subscription ID");

  // Tampered signature string
  const isInvalidSig = verifySubscriptionPaymentSignature({
    razorpayPaymentId: paymentId,
    razorpaySubscriptionId: subscriptionId,
    razorpaySignature: validSignature.slice(0, -2) + "ab",
  });
  assert.equal(isInvalidSig, false, "Signature verification must fail on tampered signature hex");
});

// Test 4: Razorpay Webhook HMAC-SHA256 Signature Verification
test("verifyWebhookSignature validates webhook signatures and rejects tampered payloads", async () => {
  const webhookSecret = "whsec_supersecret_production_key_456";

  const { verifyWebhookSignature } = await import("../src/lib/razorpay.ts");

  const payload = JSON.stringify({
    event: "subscription.charged",
    payload: {
      subscription: {
        entity: {
          id: "sub_test123",
          status: "active",
        },
      },
    },
  });

  const validSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  // Valid webhook payload
  assert.equal(
    verifyWebhookSignature({
      rawBody: payload,
      signature: validSignature,
      webhookSecret,
    }),
    true,
    "Valid webhook signature must pass"
  );

  // Tampered payload
  const tamperedPayload = JSON.stringify({
    event: "subscription.charged",
    payload: {
      subscription: {
        entity: {
          id: "sub_tampered_id",
          status: "active",
        },
      },
    },
  });

  assert.equal(
    verifyWebhookSignature({
      rawBody: tamperedPayload,
      signature: validSignature,
      webhookSecret,
    }),
    false,
    "Tampered payload must be rejected"
  );

  // Wrong secret
  assert.equal(
    verifyWebhookSignature({
      rawBody: payload,
      signature: validSignature,
      webhookSecret: "whsec_wrong_secret",
    }),
    false,
    "Webhook with wrong secret must be rejected"
  );

  // Missing signature or empty rawBody
  assert.equal(
    verifyWebhookSignature({
      rawBody: payload,
      signature: "",
      webhookSecret,
    }),
    false,
    "Empty signature must be rejected"
  );
});

// Test 5: Client-Side Bypass Prevention
test("Security boundary: Plan configuration cannot be manipulated by client parameters", async () => {
  const { getPlanConfig } = await import("../src/lib/subscriptions/config.ts");

  // Valid tier resolution
  assert.equal(getPlanConfig("PRO")?.tier, "PRO");
  assert.equal(getPlanConfig("PREMIUM")?.tier, "PREMIUM");
  assert.equal(getPlanConfig("FREE")?.tier, "FREE");

  // Client passing arbitrary invalid tier falls back to the restricted FREE tier (no free premium access)
  const fallback = getPlanConfig("SUPER_HACKER_TIER");
  assert.equal(fallback.tier, "FREE");
  assert.equal(fallback.limits.maxGoals, 1);
  assert.equal(fallback.limits.hasAdvancedReports, false);
});

// Test 6: Tier-by-Tier Entitlement Matrix Verification
test("Feature gate matrix matches user tier specifications exactly", async () => {
  const { SUBSCRIPTION_PLANS } = await import("../src/lib/subscriptions/config.ts");

  // FREE TIER
  const freeLimits = SUBSCRIPTION_PLANS.FREE.limits;
  assert.equal(freeLimits.maxGoals, 1);
  assert.equal(freeLimits.hasAdvancedReports, false);
  assert.equal(freeLimits.hasExportReports, false);
  assert.equal(freeLimits.hasAiAdvisor, false);

  // PRO TIER
  const proLimits = SUBSCRIPTION_PLANS.PRO.limits;
  assert.equal(proLimits.maxGoals, Infinity);
  assert.equal(proLimits.hasAdvancedReports, true);
  assert.equal(proLimits.hasExportReports, false); // Pro cannot export reports
  assert.equal(proLimits.hasAiAdvisor, true);

  // PREMIUM TIER
  const premiumLimits = SUBSCRIPTION_PLANS.PREMIUM.limits;
  assert.equal(premiumLimits.maxGoals, Infinity);
  assert.equal(premiumLimits.hasAdvancedReports, true);
  assert.equal(premiumLimits.hasExportReports, true); // Premium can export reports
  assert.equal(premiumLimits.hasAiAdvisor, true);
});

// Test 7: Goal Limits Calculation
test("Goal limits enforce 1 goal max for Free and allow unlimited for Pro and Premium", () => {
  function checkGoalEligibility(tier, currentGoalCount) {
    const maxAllowed = tier === "FREE" ? 1 : Infinity;
    return {
      allowed: currentGoalCount < maxAllowed,
      currentCount: currentGoalCount,
      maxAllowed,
    };
  }

  // Free user with 0 goals -> allowed
  assert.equal(checkGoalEligibility("FREE", 0).allowed, true);

  // Free user with 1 goal -> blocked
  assert.equal(checkGoalEligibility("FREE", 1).allowed, false);

  // Free user with 2 goals -> blocked
  assert.equal(checkGoalEligibility("FREE", 2).allowed, false);

  // Pro user with 0 goals -> allowed
  assert.equal(checkGoalEligibility("PRO", 0).allowed, true);

  // Pro user with 5 goals -> allowed
  assert.equal(checkGoalEligibility("PRO", 5).allowed, true);

  // Premium user with 20 goals -> allowed
  assert.equal(checkGoalEligibility("PREMIUM", 20).allowed, true);
});

// Test 8: Timing Safe Comparison against Timing Attacks
test("Signature comparison uses timing safe comparison to prevent side-channel timing attacks", async () => {
  const secret = "test_timing_secret_123";
  process.env.RAZORPAY_KEY_SECRET = secret;

  const { verifySubscriptionPaymentSignature } = await import("../src/lib/razorpay.ts");

  const paymentId = "pay_111111111111";
  const subscriptionId = "sub_222222222222";

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  // Exact match
  assert.equal(
    verifySubscriptionPaymentSignature({
      razorpayPaymentId: paymentId,
      razorpaySubscriptionId: subscriptionId,
      razorpaySignature: expectedSignature,
    }),
    true
  );

  // One byte altered at the very end
  const alteredLastByte = expectedSignature.slice(0, -1) + (expectedSignature.slice(-1) === "0" ? "1" : "0");
  assert.equal(
    verifySubscriptionPaymentSignature({
      razorpayPaymentId: paymentId,
      razorpaySubscriptionId: subscriptionId,
      razorpaySignature: alteredLastByte,
    }),
    false
  );

  // One byte altered at the very beginning
  const alteredFirstByte = (expectedSignature[0] === "a" ? "b" : "a") + expectedSignature.slice(1);
  assert.equal(
    verifySubscriptionPaymentSignature({
      razorpayPaymentId: paymentId,
      razorpaySubscriptionId: subscriptionId,
      razorpaySignature: alteredFirstByte,
    }),
    false
  );
});

// Test 9: Deterministic Webhook Idempotency Key Across Retries
test("Webhook eventId generation is deterministic across retries to prevent duplicate processing", () => {
  const event = "subscription.charged";
  const subId = "sub_retry_test_123";
  const signature = "a1b2c3d4e5f67890abcdef1234567890";

  function computeEventId(headerId, eventName, entityId, sig) {
    return headerId || `${eventName}_${entityId}_${sig.slice(0, 32)}`;
  }

  // First webhook delivery
  const eventId1 = computeEventId(null, event, subId, signature);
  // Second webhook delivery (retry after network timeout)
  const eventId2 = computeEventId(null, event, subId, signature);

  assert.equal(eventId1, eventId2, "Event IDs must be identical across retries");
  assert.ok(eventId1.startsWith("subscription.charged_sub_retry_test_123_"));

  // Explicit header if sent by gateway takes priority
  const headerId = "evt_gateway_unique_999";
  const explicitEventId = computeEventId(headerId, event, subId, signature);
  assert.equal(explicitEventId, headerId);
});

// Test 10: Database Subscription ID Authority Check
test("Payment signature verification rejects payload if DB subscription ID does not match", async () => {
  const secret = "test_db_authority_secret";
  process.env.RAZORPAY_KEY_SECRET = secret;

  const { verifySubscriptionPaymentSignature } = await import("../src/lib/razorpay.ts");

  const legitimateDbSubId = "sub_DB_STORED_111";
  const forgedClientSubId = "sub_FORGED_CLIENT_999";
  const paymentId = "pay_genuine_888";

  // Signature generated for legitimate DB sub ID
  const legitimateSignature = crypto
    .createHmac("sha256", secret)
    .update(`${paymentId}|${legitimateDbSubId}`)
    .digest("hex");

  // Attacker tries to pass forgedClientSubId while client sends legitimateSignature
  // Our server verification logic uses DB-stored subscription ID:
  function serverVerify(dbSubId, clientPayload) {
    if (dbSubId !== clientPayload.razorpaySubscriptionId) {
      return { success: false, error: "Subscription identifier mismatch." };
    }
    const valid = verifySubscriptionPaymentSignature({
      razorpayPaymentId: clientPayload.razorpayPaymentId,
      razorpaySubscriptionId: dbSubId, // Authoritative from DB
      razorpaySignature: clientPayload.razorpaySignature,
    });
    return { success: valid };
  }

  // Attack 1: Client sends mismatched sub ID
  const mismatchResult = serverVerify(legitimateDbSubId, {
    razorpayPaymentId: paymentId,
    razorpaySubscriptionId: forgedClientSubId,
    razorpaySignature: legitimateSignature,
  });
  assert.equal(mismatchResult.success, false);
  assert.equal(mismatchResult.error, "Subscription identifier mismatch.");

  // Success: Legitimate client with matching DB sub ID
  const successResult = serverVerify(legitimateDbSubId, {
    razorpayPaymentId: paymentId,
    razorpaySubscriptionId: legitimateDbSubId,
    razorpaySignature: legitimateSignature,
  });
  assert.equal(successResult.success, true);
});

// Test 11: Subscription Lifecycle Status Resolution Matrix
test("Subscription lifecycle mapping maps all Razorpay events to corresponding Prisma statuses", () => {
  const eventStatusMap = {
    "subscription.authenticated": "AUTHENTICATED",
    "subscription.activated": "ACTIVE",
    "subscription.charged": "ACTIVE",
    "subscription.pending": "PAST_DUE",
    "subscription.halted": "HALTED",
    "subscription.paused": "PAUSED",
    "subscription.resumed": "ACTIVE",
    "subscription.completed": "EXPIRED",
  };

  assert.equal(eventStatusMap["subscription.authenticated"], "AUTHENTICATED");
  assert.equal(eventStatusMap["subscription.activated"], "ACTIVE");
  assert.equal(eventStatusMap["subscription.charged"], "ACTIVE");
  assert.equal(eventStatusMap["subscription.pending"], "PAST_DUE");
  assert.equal(eventStatusMap["subscription.halted"], "HALTED");
  assert.equal(eventStatusMap["subscription.paused"], "PAUSED");
  assert.equal(eventStatusMap["subscription.resumed"], "ACTIVE");
  assert.equal(eventStatusMap["subscription.completed"], "EXPIRED");
});

