import Link from "next/link";
import { headers } from "next/headers";
import { ArrowLeft, Wallet } from "lucide-react";

import LandingThemeProvider from "@/components/landing/LandingThemeProvider";
import Pricing from "@/components/landing/Pricing/Pricing";
import Faq from "@/components/landing/Faq/Faq";
import Footer from "@/components/landing/Footer/Footer";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Pricing & Plans - SaveMyMoney",
  description:
    "Simple, transparent pricing for personal finance management. Upgrade to Pro or Premium for unlimited goals and advanced reports.",
};

export default async function PricingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <LandingThemeProvider>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#0c1410]/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={session ? "/dashboard" : "/"}
            className="inline-flex items-center gap-2"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
              <Wallet className="size-5" />
            </span>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              SaveMyMoney
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="size-3.5" />
                Back to Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in?callbackUrl=/pricing"
                className="inline-flex h-9 items-center rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-800"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="py-8 sm:py-12">
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </LandingThemeProvider>
  );
}
