import prisma from "@/lib/prisma";
import {
  SUBSCRIPTION_PLANS,
  SubscriptionTierType,
} from "./config";

export interface UserEntitlements {
  tier: SubscriptionTierType;
  isActive: boolean;
  status: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: Date | null;
  limits: {
    maxGoals: number;
    hasAdvancedReports: boolean;
    hasExportReports: boolean;
    hasAiAdvisor: boolean;
    hasSubscriptionTracker: boolean;
  };
}

export type FeatureKey =
  | "unlimited_goals"
  | "advanced_reports"
  | "export_reports"
  | "ai_advisor"
  | "subscription_tracker";

/**
 * Returns the resolved subscription record from the database for the given user.
 */
export async function getUserSubscription(userId: string) {
  if (!userId) return null;

  return await prisma.subscription.findUnique({
    where: { userId },
  });
}

/**
 * Evaluates whether a subscription grants paid access based on status and period end.
 */
export function isSubscriptionActive(sub: {
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
} | null): boolean {
  if (!sub) return false;

  const now = new Date();

  // Active or Authenticated with a valid period or active status
  if (sub.status === "ACTIVE" || sub.status === "AUTHENTICATED") {
    if (!sub.currentPeriodEnd) return true;
    return sub.currentPeriodEnd > now;
  }

  // Cancelled or pending cancellation: preserve access until currentPeriodEnd has lapsed
  if (sub.cancelAtPeriodEnd || sub.status === "CANCELLED") {
    if (sub.currentPeriodEnd && sub.currentPeriodEnd > now) {
      return true;
    }
  }

  return false;
}

/**
 * Retrieves the effective entitlements for a user based on verified database state.
 * Never trusts client headers or client-provided parameters.
 */
export async function getUserEntitlements(userId: string): Promise<UserEntitlements> {
  const sub = await getUserSubscription(userId);

  const active = isSubscriptionActive(sub);
  const effectiveTier: SubscriptionTierType = active && sub ? (sub.tier as SubscriptionTierType) : "FREE";
  const plan = SUBSCRIPTION_PLANS[effectiveTier] ?? SUBSCRIPTION_PLANS.FREE;

  return {
    tier: effectiveTier,
    isActive: active,
    status: sub?.status ?? "FREE",
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd ?? false,
    currentPeriodEnd: sub?.currentPeriodEnd ?? null,
    limits: plan.limits,
  };
}

/**
 * Server-side guard that throws or returns a rejected entitlement result if unauthorized.
 */
export async function requireEntitlement(
  userId: string,
  feature: FeatureKey
): Promise<{ allowed: boolean; reason?: string }> {
  const entitlements = await getUserEntitlements(userId);

  switch (feature) {
    case "unlimited_goals":
      if (entitlements.limits.maxGoals === Infinity) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Free tier is limited to 1 goal. Upgrade to Pro for unlimited goals.",
      };

    case "advanced_reports":
      if (entitlements.limits.hasAdvancedReports) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Advanced analytics and detailed trends require a Pro or Premium subscription.",
      };

    case "export_reports":
      if (entitlements.limits.hasExportReports) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Exporting reports is an exclusive feature of the Premium plan.",
      };

    case "ai_advisor":
      if (entitlements.limits.hasAiAdvisor) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "AI financial advisor is included with Pro and Premium subscriptions.",
      };

    case "subscription_tracker":
      if (entitlements.limits.hasSubscriptionTracker) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Subscription tracking requires a Pro subscription.",
      };

    default:
      return { allowed: false, reason: "Feature requires an upgraded plan." };
  }
}

/**
 * Validates whether the user can create a new goal based on their current goal count and plan limit.
 */
export async function canUserCreateGoal(userId: string): Promise<{
  allowed: boolean;
  currentCount: number;
  maxAllowed: number;
  message?: string;
}> {
  const entitlements = await getUserEntitlements(userId);
  const currentCount = await prisma.goal.count({
    where: { userId },
  });

  if (currentCount >= entitlements.limits.maxGoals) {
    return {
      allowed: false,
      currentCount,
      maxAllowed: entitlements.limits.maxGoals,
      message: `Your ${entitlements.tier === "FREE" ? "Free" : entitlements.tier} plan allows a maximum of ${entitlements.limits.maxGoals} goal${entitlements.limits.maxGoals > 1 ? "s" : ""}. Upgrade to Pro for unlimited goals.`,
    };
  }

  return {
    allowed: true,
    currentCount,
    maxAllowed: entitlements.limits.maxGoals,
  };
}
