import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "A simple place to start building better habits.",
    features: ["Track income & expenses", "Basic reports", "1 financial goal", "Up to 2 bank accounts"],
    action: "Get started",
  },
  {
    name: "Pro",
    price: "499",
    description: "More insight and flexibility for your finances.",
    features: ["Everything in Free", "AI financial advisor", "Unlimited goals", "Subscription tracking", "Advanced analytics", "Priority support"],
    action: "Start free trial",
    popular: true,
  },
  {
    name: "Premium",
    price: "999",
    description: "A deeper toolkit for your money journey.",
    features: ["Everything in Pro", "Investment tracking", "Custom categories", "Export reports", "Dedicated support"],
    action: "Start free trial",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="landing-section scroll-mt-20">
      <div className="landing-container-pricing mx-auto">
        <div className="mb-10 text-center sm:mb-12">
          <p className="landing-eyebrow mb-3">Simple, transparent pricing</p>
          <h2 className="landing-section-title">Choose what works for you.</h2>
          <p className="landing-muted mt-3 text-sm sm:text-base">Start with the basics. Grow into more when you’re ready.</p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`pricing-card landing-surface relative flex flex-col rounded-[24px] border p-6 sm:p-7 ${plan.popular ? "pricing-card-popular lg:-translate-y-2" : "landing-border"}`}
            >
              {plan.popular && <span className="pricing-popular-badge absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]">Most popular</span>}
              <p className={`mb-1 text-sm font-semibold ${plan.popular ? "landing-accent-text" : ""}`}>{plan.name}</p>
              <p className="landing-muted min-h-10 text-xs leading-5">{plan.description}</p>
              <div className="my-5 flex items-baseline gap-1">
                <span className="text-xl font-medium">₹</span>
                <span className="text-4xl font-semibold tracking-[-0.06em]">{plan.price}</span>
                <span className="landing-muted ml-1 text-xs">/ month</span>
              </div>
              <div className="landing-border border-t pt-5">
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
                <Link
                  href="/sign-up"
                  className={`inline-flex h-11 w-full items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors ${plan.popular ? "landing-button" : "landing-outline-button border landing-border"}`}
                >
                  {plan.action}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
