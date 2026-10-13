"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bell, IndianRupee, PiggyBank, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { usePersonalSettings } from "../SettingsProvider";

const formatRupees = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const PreferencesSection = () => {
  const { settings, updateSettings } = usePersonalSettings();
  const [limitDraft, setLimitDraft] = useState<string | null>(null);

  const saveLimit = () => {
    const amount = Number(limitDraft);
    if (!Number.isFinite(amount) || amount < 5_000 || amount > 100_000_000) {
      toast.error("Set a monthly alert between ₹5,000 and ₹10,00,00,000.");
      return;
    }
    const roundedAmount = Math.round(amount);
    updateSettings({ monthlyExpenseLimit: roundedAmount });
    setLimitDraft(null);
    toast.success(`Monthly alert set to ${formatRupees(roundedAmount)}.`);
  };

  return (
    <section className="settings-surface min-w-0 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">Money habits</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">Preferences</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">Set the alerts that help you stay on top of your money.</p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        <div className="flex min-w-0 items-start gap-3 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <IndianRupee className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Tracking currency</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">Your records use Indian Rupees. Amounts are not converted to another currency.</p>
          </div>
          <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">INR · ₹</span>
        </div>

        <div className="flex min-w-0 items-start gap-3 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Bell className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Monthly spending alert</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">Show an in-app alert when this month&apos;s expenses cross your limit.</p>
          </div>
          <Switch
            aria-label="Monthly spending alerts"
            checked={settings.monthlyExpenseAlerts}
            onCheckedChange={(checked) => updateSettings({ monthlyExpenseAlerts: checked })}
          />
        </div>

        {settings.monthlyExpenseAlerts && (
          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
                <WalletCards className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <label htmlFor="monthly-expense-limit" className="text-sm font-bold text-slate-900 dark:text-white">Alert me at</label>
                <p className="mt-0.5 text-xs leading-5 text-slate-600 dark:text-slate-400">Choose a monthly expense threshold from ₹5,000 to ₹10 crore.</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <Input
                      id="monthly-expense-limit"
                      type="number"
                      min={5000}
                      max={100_000_000}
                      step={1000}
                      inputMode="numeric"
                      value={limitDraft ?? String(settings.monthlyExpenseLimit)}
                      onChange={(event) => setLimitDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveLimit();
                        }
                      }}
                      className="h-10 rounded-xl border-emerald-200 bg-white pl-9 dark:border-emerald-900 dark:bg-slate-950"
                    />
                  </div>
                  <Button type="button" onClick={saveLimit} className="h-10 rounded-xl px-4">Save limit</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex min-w-0 items-start gap-3 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
            <PiggyBank className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Goal reminders</p>
            <p className="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">Highlight goals that are due within the next seven days.</p>
          </div>
          <Switch
            aria-label="Goal reminders"
            checked={settings.goalReminders}
            onCheckedChange={(checked) => updateSettings({ goalReminders: checked })}
          />
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-slate-400 dark:text-slate-500">Preferences are saved to this browser for your account.</p>
    </section>
  );
};

export default PreferencesSection;
