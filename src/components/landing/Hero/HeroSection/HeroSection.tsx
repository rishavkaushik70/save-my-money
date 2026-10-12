import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <div className="hero-copy flex flex-col items-start">
      <div className="landing-pill mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold sm:text-xs">
        <Sparkles className="size-3.5" />
        A calmer way to manage money
      </div>
      <h1 className="hero-title max-w-[650px] text-[clamp(3.1rem,6vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.075em]">
        Your money,
        <br />
        finally in <span className="landing-accent-text">focus.</span>
      </h1>
      <p className="landing-muted mt-6 max-w-[520px] text-base leading-7 sm:text-lg sm:leading-8">
        Track spending, build better habits, and grow your wealth with AI that works for you.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Link href="/sign-up" className="landing-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold">
          Start for free <ArrowRight className="size-4" />
        </Link>
        <Link href="#howItWorks" className="landing-outline-button inline-flex h-12 items-center justify-center gap-2 rounded-full border landing-border px-6 text-sm font-semibold">
          Explore the dashboard <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="landing-muted mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium sm:text-[13px]">
        <span className="inline-flex items-center gap-2"><Check className="landing-accent-text size-4" /> Free to get started</span>
        <span className="inline-flex items-center gap-2"><Check className="landing-accent-text size-4" /> Built around your goals</span>
      </div>
    </div>
  );
};

export default HeroSection;
