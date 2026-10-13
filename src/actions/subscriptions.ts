"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  getPlanConfig,
  getRazorpayPlanId,
} from "@/lib/subscriptions/config";
import {
  getUserEntitlements,
  isSubscriptionActive,
} from "@/lib/subscriptions/entitlements";
import {
  getRazorpayClient,
  verifySubscriptionPaymentSignature,
} from "@/lib/razorpay";

const checkoutSchema = z.object({
  tier: z.enum(["PRO", "PREMIUM"]),
});

const verificationSchema = z.object({
  razorpayPaymentId: z.string().min(1, "Payment ID is required"),
  razorpaySubscriptionId: z.string().min(1, "Subscription ID is required"),
  razorpaySignature: z.string().min(1, "Signature is required"),
  tier: z.enum(["PRO", "PREMIUM"]),
});

export type CheckoutResponse =
  | {
      success: true;
      subscriptionId: string;
      keyId: string;
      planName: string;
      amount: number;
      currency: string;
      userName: string;
      userEmail: string;
    }
  | {
      success: false;
      error: string;
      code?: "UNAUTHENTICATED" | "ALREADY_SUBSCRIBED" | "CONFIG_ERROR";
    };

/**
 * Creates a server-initiated Razorpay subscription session for authenticated users.
 */
export async function createCheckoutSession(
  inputTier: "PRO" | "PREMIUM"
): Promise<CheckoutResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "You must be signed in to subscribe.",
        code: "UNAUTHENTICATED",
      };
    }

    const validation = checkoutSchema.safeParse({ tier: inputTier });
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid plan selected.",
      };
    }

    const { tier } = validation.data;
    const plan = getPlanConfig(tier);

    // Check existing subscription
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (existingSub && isSubscriptionActive(existingSub)) {
      if (existingSub.tier === tier) {
        return {
          success: false,
          error: `You already have an active ${plan.name} subscription.`,
          code: "ALREADY_SUBSCRIBED",
        };
      }
    }

    const planId = getRazorpayPlanId(tier);
    const keyId = process.env.RAZORPAY_KEY_ID;

    if (!keyId || !process.env.RAZORPAY_KEY_SECRET) {
      return {
        success: false,
        error:
          "Payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.",
        code: "CONFIG_ERROR",
      };
    }

    if (!planId) {
      return {
        success: false,
        error: `Razorpay Plan ID for ${plan.name} is missing. Please set ${tier === "PRO" ? "RAZORPAY_PLAN_ID_PRO" : "RAZORPAY_PLAN_ID_PREMIUM"} in .env.`,
        code: "CONFIG_ERROR",
      };
    }

    const razorpay = getRazorpayClient();

    // Create subscription on Razorpay (12 monthly billing cycles)
    const razorpaySub = (await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: session.user.id,
        userEmail: session.user.email,
        tier,
      },
    })) as { id: string };

    // Record pending subscription in local DB linked to user
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        provider: "razorpay",
        providerSubscriptionId: razorpaySub.id,
        providerPlanId: planId,
        tier,
        status: "PENDING",
      },
      update: {
        provider: "razorpay",
        providerSubscriptionId: razorpaySub.id,
        providerPlanId: planId,
        tier,
        status: "PENDING",
        cancelAtPeriodEnd: false,
      },
    });

    return {
      success: true,
      subscriptionId: razorpaySub.id,
      keyId,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      userName: session.user.name,
      userEmail: session.user.email,
    };
  } catch (error) {
    console.error("Create Checkout Session Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to initialize checkout. Please try again.",
    };
  }
}

/**
 * Server-side payment verification for Razorpay Subscription checkout response.
 */
export async function verifySubscriptionPayment(payload: {
  razorpayPaymentId: string;
  razorpaySubscriptionId: string;
  razorpaySignature: string;
  tier: "PRO" | "PREMIUM";
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized request." };
    }

    const validation = verificationSchema.safeParse(payload);
    if (!validation.success) {
      return { success: false, error: "Invalid payment verification payload." };
    }

    const {
      razorpayPaymentId,
      razorpaySubscriptionId,
      razorpaySignature,
      tier,
    } = validation.data;

    // Verify cryptographic signature
    const isValidSignature = verifySubscriptionPaymentSignature({
      razorpayPaymentId,
      razorpaySubscriptionId,
      razorpaySignature,
    });

    if (!isValidSignature) {
      console.error(
        "Invalid Razorpay subscription signature for user:",
        session.user.id,
        razorpaySubscriptionId
      );
      return { success: false, error: "Payment verification failed. Invalid signature." };
    }

    // Verify subscription belongs to this user in DB
    const subRecord = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        providerSubscriptionId: razorpaySubscriptionId,
      },
    });

    if (!subRecord) {
      return {
        success: false,
        error: "Subscription record mismatch. Please contact support.",
      };
    }

    // Attempt to fetch fresh period start/end from Razorpay
    let periodStart = new Date();
    let periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    try {
      const razorpay = getRazorpayClient();
      const details = (await razorpay.subscriptions.fetch(
        razorpaySubscriptionId
      )) as {
        current_start?: number;
        current_end?: number;
      };

      if (details.current_start) {
        periodStart = new Date(details.current_start * 1000);
      }
      if (details.current_end) {
        periodEnd = new Date(details.current_end * 1000);
      }
    } catch (fetchErr) {
      console.warn("Could not fetch remote subscription period end, using 30d fallback:", fetchErr);
    }

    // Activate subscription in DB
    await prisma.subscription.update({
      where: { id: subRecord.id },
      data: {
        status: "ACTIVE",
        tier,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        cancelledAt: null,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/goals");
    revalidatePath("/reports");
    revalidatePath("/settings");

    return {
      success: true,
      message: `Congratulations! Your ${tier} subscription is now active.`,
    };
  } catch (error) {
    console.error("Verify Subscription Payment Error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while verifying your subscription.",
    };
  }
}

/**
 * Cancels a subscription at the end of the current billing cycle.
 */
export async function cancelSubscription() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized." };
    }

    const sub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!sub || !isSubscriptionActive(sub)) {
      return { success: false, error: "No active subscription found to cancel." };
    }

    if (sub.cancelAtPeriodEnd) {
      return {
        success: false,
        error: "Your subscription is already scheduled for cancellation at period end.",
      };
    }

    // Cancel in Razorpay at period end if subscription ID is present
    if (sub.providerSubscriptionId) {
      try {
        const razorpay = getRazorpayClient();
        await razorpay.subscriptions.cancel(sub.providerSubscriptionId, true); // cancel_at_cycle_end = true
      } catch (rzpErr) {
        console.error("Razorpay subscription cancel API warning:", rzpErr);
      }
    }

    // Update DB: flag cancellation at period end
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: true,
        cancelledAt: new Date(),
      },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");

    const formattedDate = sub.currentPeriodEnd
      ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(sub.currentPeriodEnd)
      : "the end of your billing cycle";

    return {
      success: true,
      message: `Your subscription has been cancelled. You retain full access until ${formattedDate}.`,
    };
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    return {
      success: false,
      error: "Failed to cancel subscription. Please try again or contact support.",
    };
  }
}

/**
 * Fetches the current user's subscription and entitlements for client components.
 */
export async function getCurrentUserSubscription() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      isAuthenticated: false,
      entitlements: null,
      subscription: null,
    };
  }

  const [entitlements, sub] = await Promise.all([
    getUserEntitlements(session.user.id),
    prisma.subscription.findUnique({
      where: { userId: session.user.id },
    }),
  ]);

  return {
    isAuthenticated: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    },
    entitlements,
    subscription: sub
      ? {
          id: sub.id,
          tier: sub.tier,
          status: sub.status,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
        }
      : null,
  };
}
