"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { usePersonalSettings, type AppearanceMode } from "../SettingsProvider";

const options: {
  value: AppearanceMode;
  label: string;
  description: string;
  icon: typeof Sun;
}[] = [
  { value: "light", label: "Light", description: "Bright and clear", icon: Sun },
  { value: "dark", label: "Dark", description: "Easy on the eyes", icon: Moon },
  { value: "system", label: "System", description: "Follow your device", icon: Monitor },
];

const AppearanceSection = () => {
  const { settings, updateSettings } = usePersonalSettings();

  return (
    <section className="settings-surface min-w-0 rounded-[26px] border border-slate-200/80 bg-white p-5 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="mb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">Workspace</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 dark:text-white">Appearance</h2>
        <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">Choose a theme for your dashboard. Your choice is saved on this device.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map(({ value, label, description, icon: Icon }) => {
          const selected = settings.appearance === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              onClick={() => updateSettings({ appearance: value })}
              className={`relative flex min-h-28 min-w-0 flex-col items-start justify-between rounded-2xl border p-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                selected
                  ? "border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-[0_10px_25px_-20px_rgba(5,150,105,0.8)] dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"
              }`}
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className={`flex size-10 items-center justify-center rounded-xl ${selected ? "bg-white text-emerald-700 dark:bg-slate-900 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {selected && <Check className="size-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />}
              </span>
              <span className="mt-4">
                <span className="block text-sm font-bold">{label}</span>
                <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 rounded-xl bg-slate-50 px-3.5 py-3 text-xs leading-5 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        {settings.appearance === "system"
          ? "System mode updates automatically when your device theme changes."
          : `${settings.appearance === "dark" ? "Dark" : "Light"} mode is active across your signed-in workspace.`}
      </p>
    </section>
  );
};

export default AppearanceSection;
