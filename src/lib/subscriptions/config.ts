export type SubscriptionTierType = "FREE" | "PRO" | "PREMIUM";

export interface PlanConfig {
  tier: SubscriptionTierType;
  name: string;
  price: number;
  currency: string;
  interval: "month";
  description: string;
  features: string[];
  limits: {
    maxGoals: number;
    hasAdvancedReports: boolean;
    hasExportReports: boolean;
    hasAiAdvisor: boolean;
    hasSubscriptionTracker: boolean;
  };
  envPlanIdKey?: string;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTierType, PlanConfig> = {
  FREE: {
    tier: "FREE",
    name: "Free",
    price: 0,
    currency: "INR",
    interval: "month",
    description: "A simple place to start building better habits.",
    features: [
      "Track income & expenses",
      "Basic reports (KPI overview)",
      "1 financial goal",
      "Up to 2 bank accounts",
    ],
    limits: {
      maxGoals: 1,
      hasAdvancedReports: false,
      hasExportReports: false,
      hasAiAdvisor: false,
      hasSubscriptionTracker: false,
    },
  },
  PRO: {
    tier: "PRO",
    name: "Pro",
    price: 499,
    currency: "INR",
    interval: "month",
    description: "More insight and flexibility for your finances.",
    features: [
      "Everything in Free",
      "Unlimited financial goals",
      "Full analytics & trends",
      "AI spending advisor & alerts",
      "Recurring subscription tracking",
      "Priority customer support",
    ],
    limits: {
      maxGoals: Infinity,
      hasAdvancedReports: true,
      hasExportReports: false,
      hasAiAdvisor: true,
      hasSubscriptionTracker: true,
    },
    envPlanIdKey: "RAZORPAY_PLAN_ID_PRO",
  },
  PREMIUM: {
    tier: "PREMIUM",
    name: "Premium",
    price: 999,
    currency: "INR",
    interval: "month",
    description: "A deeper toolkit for your money journey.",
    features: [
      "Everything in Pro",
      "Export reports (CSV / JSON data)",
      "Custom transaction categories",
      "Investment tracking",
      "Dedicated 1-on-1 support",
    ],
    limits: {
      maxGoals: Infinity,
      hasAdvancedReports: true,
      hasExportReports: true,
      hasAiAdvisor: true,
      hasSubscriptionTracker: true,
    },
    envPlanIdKey: "RAZORPAY_PLAN_ID_PREMIUM",
  },
};

export function getPlanConfig(tier: SubscriptionTierType): PlanConfig {
  return SUBSCRIPTION_PLANS[tier] ?? SUBSCRIPTION_PLANS.FREE;
}

export function getRazorpayPlanId(tier: "PRO" | "PREMIUM"): string | undefined {
  if (tier === "PRO") {
    return process.env.RAZORPAY_PLAN_ID_PRO;
  }
  if (tier === "PREMIUM") {
    return process.env.RAZORPAY_PLAN_ID_PREMIUM;
  }
  return undefined;
}
