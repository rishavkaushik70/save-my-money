"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createCheckoutSession,
  getCurrentUserSubscription,
  verifySubscriptionPayment,
} from "@/actions/subscriptions";
import { SUBSCRIPTION_PLANS, SubscriptionTierType } from "@/lib/subscriptions/config";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const planList: {
  tier: SubscriptionTierType;
  popular?: boolean;
}[] = [
  { tier: "FREE" },
  { tier: "PRO", popular: true },
  { tier: "PREMIUM" },
];

const Pricing = () => {
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<SubscriptionTierType | null>(null);
  const [userState, setUserState] = useState<{
    isAuthenticated: boolean;
    currentTier: SubscriptionTierType;
    isActive: boolean;
  }>({
    isAuthenticated: false,
    currentTier: "FREE",
    isActive: false,
  });

  useEffect(() => {
    let isMounted = true;
    getCurrentUserSubscription().then((data) => {
      if (!isMounted) return;
      if (data.isAuthenticated && data.entitlements) {
        setUserState({
          isAuthenticated: true,
          currentTier: data.entitlements.tier,
          isActive: data.entitlements.isActive,
        });
      } else {
        setUserState({
          isAuthenticated: false,
          currentTier: "FREE",
          isActive: false,
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = async (tier: "PRO" | "PREMIUM") => {
    if (!userState.isAuthenticated) {
      toast.info("Please sign in or create an account to start your subscription.");
      router.push("/sign-in?callbackUrl=/pricing");
      return;
    }

    if (userState.currentTier === tier && userState.isActive) {
      toast.info(`You are already subscribed to the ${tier} plan.`);
      return;
    }

    try {
      setLoadingTier(tier);
      const res = await createCheckoutSession(tier);

      if (!res.success) {
        toast.error(res.error);
        setLoadingTier(null);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay checkout script. Please check your internet connection.");
        setLoadingTier(null);
        return;
      }

      const options = {
        key: res.keyId,
        subscription_id: res.subscriptionId,
        name: "SaveMyMoney",
        description: `${res.planName} Monthly Subscription`,
        image: "/Wallet.svg",
        prefill: {
          name: res.userName,
          email: res.userEmail,
        },
        theme: {
          color: "#12824f",
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          const loadingToast = toast.loading("Verifying your subscription payment…");
          try {
            const verifyRes = await verifySubscriptionPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySubscriptionId: response.razorpay_subscription_id,
              razorpaySignature: response.razorpay_signature,
              tier,
            });

            toast.dismiss(loadingToast);

            if (verifyRes.success) {
              toast.success(verifyRes.message || "Subscription activated successfully!");
              setUserState({
                isAuthenticated: true,
                currentTier: tier,
                isActive: true,
              });
              router.refresh();
            } else {
              toast.error(verifyRes.error || "Payment verification failed.");
            }
          } catch (err) {
            toast.dismiss(loadingToast);
            console.error("Verification error:", err);
            toast.error("An unexpected error occurred while activating your plan.");
          } finally {
            setLoadingTier(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingTier(null);
            toast.info("Subscription checkout was closed.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Checkout initiation error:", err);
      toast.error("Failed to start checkout. Please try again.");
      setLoadingTier(null);
    }
  };

  return (
    <section id="pricing" className="landing-section scroll-mt-20">
      <div className="landing-container-pricing mx-auto">
        <div className="mb-10 text-center sm:mb-12">
          <p className="landing-eyebrow mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Simple, transparent pricing
          </p>
          <h2 className="landing-section-title">Choose what works for you.</h2>
          <p className="landing-muted mt-3 text-sm sm:text-base">
            Start free or upgrade for powerful AI insights, unlimited goals, and advanced analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
          {planList.map(({ tier, popular }) => {
            const plan = SUBSCRIPTION_PLANS[tier];
            const isCurrentPlan =
              userState.isAuthenticated &&
              userState.currentTier === tier &&
              (tier === "FREE" ? true : userState.isActive);

            const isProcessing = loadingTier === tier;

            return (
              <article
                key={plan.tier}
                className={`pricing-card landing-surface relative flex flex-col rounded-[26px] border p-6 sm:p-7 ${
                  popular ? "pricing-card-popular lg:-translate-y-2 ring-2 ring-emerald-500/20" : "landing-border"
                }`}
              >
                {popular && (
                  <span className="pricing-popular-badge absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-xs">
                    Most popular
                  </span>
                )}

                <div className="mb-1 flex items-center justify-between">
                  <p className={`text-base font-bold ${popular ? "landing-accent-text" : ""}`}>{plan.name}</p>
                  {isCurrentPlan && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      <Crown className="size-3" /> Current plan
                    </span>
                  )}
                </div>

                <p className="landing-muted min-h-10 text-xs leading-5">{plan.description}</p>

                <div className="my-5 flex items-baseline gap-1">
                  <span className="text-xl font-medium">₹</span>
                  <span className="text-4xl font-semibold tracking-[-0.06em]">{plan.price}</span>
                  <span className="landing-muted ml-1 text-xs">/ month</span>
                </div>

                <div className="landing-border border-t pt-5">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">Features included</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-[13px] leading-5">
                        <Check className="landing-accent-text mt-0.5 size-4 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-7">
                  {tier === "FREE" ? (
                    userState.isAuthenticated ? (
                      <Link
                        href="/dashboard"
                        className="landing-outline-button border landing-border inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors"
                      >
                        Go to Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/sign-up"
                        className="landing-outline-button border landing-border inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors"
                      >
                        Get started free
                      </Link>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubscribe(tier)}
                      disabled={isCurrentPlan || isProcessing}
                      className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors disabled:opacity-60 ${
                        popular ? "landing-button shadow-sm" : "landing-outline-button border landing-border"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Preparing checkout…</span>
                        </>
                      ) : isCurrentPlan ? (
                        <>
                          <Check className="size-4" />
                          <span>Active Subscription</span>
                        </>
                      ) : (
                        <span>Subscribe to {plan.name}</span>
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
