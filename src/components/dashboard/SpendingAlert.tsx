"use client";

import Link from "next/link";
import { ArrowUpRight, CircleAlert } from "lucide-react";
import { usePersonalSettings } from "@/components/settings/SettingsProvider";

const formatRupees = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function SpendingAlert({ monthlyExpense }: { monthlyExpense: number }) {
  const { settings } = usePersonalSettings();
  if (!settings.monthlyExpenseAlerts || monthlyExpense < settings.monthlyExpenseLimit) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      className="flex min-w-0 flex-col gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white px-3.5 py-3.5 shadow-sm dark:border-amber-900/70 dark:from-amber-950/50 dark:to-slate-900 sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200">
          <CircleAlert className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-amber-950 dark:text-amber-100">Monthly spending limit reached</p>
          <p className="mt-0.5 text-xs leading-5 text-amber-900/80 dark:text-amber-200/80">
            You&apos;ve recorded {formatRupees(monthlyExpense)} in expenses this month, above your {formatRupees(settings.monthlyExpenseLimit)} alert limit.
          </p>
        </div>
      </div>
      <Link
        href="/transaction"
        className="inline-flex min-h-9 w-full shrink-0 items-center justify-center gap-1 rounded-xl border border-amber-300 bg-white px-3 text-xs font-bold text-amber-900 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-100 dark:hover:bg-amber-950 sm:w-auto"
      >
        Review expenses <ArrowUpRight className="size-3.5" aria-hidden="true" />
      </Link>
    </aside>
  );
}
