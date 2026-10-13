"use client";

import { useEffect, useState } from "react";
import { Check, Crown, CreditCard, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { cancelSubscription, getCurrentUserSubscription } from "@/actions/subscriptions";
import { SUBSCRIPTION_PLANS, SubscriptionTierType } from "@/lib/subscriptions/config";
import { Button } from "@/components/ui/button";

export default function BillingSection() {
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [subData, setSubData] = useState<{
    tier: SubscriptionTierType;
    isActive: boolean;
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  }>({
    tier: "FREE",
    isActive: false,
    status: "FREE",
    cancelAtPeriodEnd: false,
    currentPeriodEnd: null,
  });

  const loadSubscription = () => {
    getCurrentUserSubscription().then((res) => {
      if (res.isAuthenticated && res.entitlements) {
        setSubData({
          tier: res.entitlements.tier,
          isActive: res.entitlements.isActive,
          status: res.entitlements.status,
          cancelAtPeriodEnd: res.entitlements.cancelAtPeriodEnd,
          currentPeriodEnd: res.entitlements.currentPeriodEnd
            ? new Date(res.entitlements.currentPeriodEnd).toISOString()
            : null,
        });
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your recurring subscription? You will continue to have full access until the end of your current billing period."
    );
    if (!confirmed) return;

    try {
      setCancelling(true);
      const res = await cancelSubscription();
      if (res.success) {
        toast.success(res.message);
        loadSubscription();
      } else {
        toast.error(res.error || "Failed to cancel subscription.");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("An unexpected error occurred while cancelling.");
    } finally {
      setCancelling(false);
    }
  };

  const plan = SUBSCRIPTION_PLANS[subData.tier] || SUBSCRIPTION_PLANS.FREE;
  const formattedEndDate = subData.currentPeriodEnd
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(subData.currentPeriodEnd))
    : null;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111b16] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/70 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <CreditCard className="size-4" />
            </span>
            <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-slate-100">
              Subscription & Billing
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage your plan tier, billing cycle, and feature access.
          </p>
        </div>

        {subData.tier !== "FREE" && subData.isActive && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <Crown className="size-3.5" />
            Active {subData.tier} Member
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex h-36 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="mt-5 space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {plan.name} Plan
                </span>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-2xs dark:bg-slate-800 dark:text-slate-300">
                  {plan.price === 0 ? "Free forever" : `₹${plan.price} / month`}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                {plan.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {subData.tier === "FREE" ? (
                <Link
                  href="/pricing"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <Sparkles className="size-3.5" />
                  Upgrade Plan
                </Link>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/pricing"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Change Plan
                  </Link>

                  {!subData.cancelAtPeriodEnd ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="h-10 rounded-xl border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
                    >
                      {cancelling ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Cancelling…</span>
                        </>
                      ) : (
                        <span>Cancel Subscription</span>
                      )}
                    </Button>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {subData.cancelAtPeriodEnd && formattedEndDate && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
              <div>
                <p className="font-semibold">Cancellation Scheduled</p>
                <p className="mt-0.5 leading-5">
                  Your recurring subscription will end on <strong>{formattedEndDate}</strong>. You continue to have full access to your paid features until this date.
                </p>
              </div>
            </div>
          )}

          {subData.isActive && !subData.cancelAtPeriodEnd && formattedEndDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Check className="size-4 text-emerald-600" />
              <span>Next billing renewal: <strong>{formattedEndDate}</strong></span>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Your Current Entitlements
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {plan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 dark:bg-slate-900/50 dark:text-slate-300"
                >
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
