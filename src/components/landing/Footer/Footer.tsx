import { ArrowRight, Bot } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="landing-footer border-t landing-border">
      <div className="landing-container mx-auto py-10 sm:py-14">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr] lg:gap-12">
          <div>
            <Link href="#top" className="landing-brand inline-flex items-center gap-2.5">
              <span className="landing-logo-mark flex size-10 items-center justify-center rounded-[14px]"><Bot className="size-6" /></span>
              <span className="text-lg font-bold tracking-[-0.04em]">SaveMy<span className="landing-accent-text">Money</span></span>
            </Link>
            <p className="landing-muted mt-4 max-w-[280px] text-sm leading-6">
              A little more clarity for the money decisions you make every day.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em]">Explore</p>
            <Link className="landing-footer-link" href="#features">Features</Link>
            <Link className="landing-footer-link" href="#howItWorks">Product</Link>
            <Link className="landing-footer-link" href="#pricing">Pricing</Link>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em]">Account</p>
            <Link className="landing-footer-link" href="/sign-up">Create an account</Link>
            <Link className="landing-footer-link" href="/sign-in">Sign in</Link>
            <Link className="landing-footer-link" href="#faq">FAQs</Link>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em]">Start with a clearer view</p>
            <p className="landing-muted mb-4 text-sm leading-6">Take the first step toward more confident money habits.</p>
            <Link href="/sign-up" className="landing-button inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold">
              Get started <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="landing-border landing-muted mt-10 flex flex-col gap-2 border-t pt-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} SaveMyMoney</span>
          <span>Make room for what matters.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
