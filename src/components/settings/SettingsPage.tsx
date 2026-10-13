import type { User } from "@/types/auth";
import ProfileSection from "./Profile/ProfileSection";
import PreferencesSection from "./Preference/PreferencesSection";
import AppearanceSection from "./Appearance/AppearanceSection";
import SecuritySection from "./Security/SecuritySection";
import BillingSection from "./Billing/BillingSection";
import DangerZone from "./DangerZone/DangerZone";

interface SettingsPageProps {
  user: User;
}

const SettingsPage = ({ user }: SettingsPageProps) => {
  return (
    <main className="min-h-[calc(100dvh-68px)] w-full bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8 2xl:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="relative isolate overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/80 p-5 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.45)] dark:border-emerald-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/50 sm:p-7">
          <div className="pointer-events-none absolute -right-10 -top-24 size-64 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
                Your account, your way
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Settings
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Fine-tune your profile, subscription plan, money alerts, and workspace settings.
              </p>
            </div>
            <nav aria-label="Settings sections" className="flex flex-wrap gap-2">
              {[
                ["Profile", "#profile"],
                ["Subscription", "#billing"],
                ["Preferences", "#preferences"],
                ["Appearance", "#appearance"],
                ["Security", "#security"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex min-h-9 items-center rounded-full border border-slate-200 bg-white/80 px-3.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <div className="grid min-w-0 gap-5 lg:grid-cols-2 lg:gap-6">
          <div id="profile" className="scroll-mt-24 lg:col-span-2">
            <ProfileSection user={user} />
          </div>
          <div id="billing" className="scroll-mt-24 lg:col-span-2">
            <BillingSection />
          </div>
          <div id="preferences" className="scroll-mt-24">
            <PreferencesSection />
          </div>
          <div id="appearance" className="scroll-mt-24">
            <AppearanceSection />
          </div>
          <div id="security" className="scroll-mt-24 lg:col-span-2">
            <SecuritySection />
          </div>
          <div className="lg:col-span-2">
            <DangerZone />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
