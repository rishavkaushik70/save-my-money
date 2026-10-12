"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Bot,
  ChartNoAxesCombined,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
} from "lucide-react";
import { useLandingTheme } from "../landing/LandingThemeProvider";

type AuthLayoutProps = Readonly<{
  children: React.ReactNode;
  mode: "sign-in" | "sign-up";
}>;

const benefits = [
  {
    icon: ChartNoAxesCombined,
    title: "A clearer view",
    detail: "See your spending without the guesswork.",
  },
  {
    icon: Target,
    title: "Goals that feel doable",
    detail: "Turn small steps into steady progress.",
  },
  {
    icon: LockKeyhole,
    title: "Privacy comes first",
    detail: "Your financial details stay yours.",
  },
];

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  const { theme, toggleTheme } = useLandingTheme();
  const ThemeIcon = theme === "light" ? Moon : Sun;
  const themeAction = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <div className="auth-screen relative flex min-h-svh flex-col px-4 py-5 sm:px-7 sm:py-6 lg:px-10">
      <div className="auth-background-glow" aria-hidden="true" />

      <header className="auth-header relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" className="auth-brand inline-flex items-center gap-2.5" aria-label="SaveMyMoney home">
          <span className="auth-brand-mark flex size-10 items-center justify-center rounded-[14px]">
            <Bot className="size-6" strokeWidth={2.25} />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.04em] sm:text-lg">
            SaveMy<span className="auth-accent-text">Money</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="auth-header-note hidden text-xs font-medium sm:inline">
            Your money, in focus
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeAction}
            title={themeAction}
            className="auth-theme-toggle flex size-10 items-center justify-center rounded-full border"
          >
            <ThemeIcon className="size-[17px]" />
          </button>
        </div>
      </header>

      <main className="auth-main relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-10">
        <aside className="auth-story hidden min-h-[650px] flex-col justify-between gap-10 rounded-[32px] border p-9 xl:p-12 lg:flex">
          <div>
            <div className="auth-eyebrow inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em]">
              <Sparkles className="size-3.5" />
              Personal finance, made clearer
            </div>
            <h2 className="auth-story-title mt-7 max-w-[520px] text-5xl leading-[1.02] tracking-[-0.06em] xl:text-[3.7rem]">
              {mode === "sign-in" ? "Welcome back to a clearer view of " : "Build better money habits, "}
              <span>{mode === "sign-in" ? "your money." : "one step at a time."}</span>
            </h2>
            <p className="auth-story-copy mt-5 max-w-md text-base leading-7">
              Keep everyday spending, personal goals, and useful insights in one calm place.
            </p>

            <div className="mt-8 space-y-5">
              {benefits.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="auth-benefit flex items-center gap-3.5">
                  <span className="auth-benefit-icon flex size-11 shrink-0 items-center justify-center rounded-2xl">
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="auth-story-copy mt-0.5 block text-xs">{detail}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="auth-snapshot shrink-0 rounded-2xl border p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-xs font-semibold">
                <span className="auth-status-dot size-2 rounded-full" />
                Sample dashboard
              </span>
              <span className="auth-snapshot-label text-[10px] font-medium">Preview only</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <p className="auth-snapshot-label text-[11px]">Total balance</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">₹2,45,760</p>
              </div>
              <div>
                <p className="auth-snapshot-label text-[11px]">Savings rate</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">32.5%</p>
              </div>
            </div>
            <div className="auth-progress mt-4 h-1.5 overflow-hidden rounded-full">
              <span className="block h-full w-[68%] rounded-full" />
            </div>
            <p className="auth-snapshot-label mt-3 inline-flex items-center gap-1 text-[11px]">
              A little more clarity <ArrowUpRight className="size-3.5" />
            </p>
          </div>
        </aside>

        <section className="auth-panel mx-auto w-full max-w-[500px] rounded-[28px] border p-5 shadow-xl sm:p-8 lg:p-9">
          {children}
        </section>
      </main>

      <footer className="auth-footer relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center gap-2 pt-1 text-center text-[11px] sm:justify-between">
        <span className="hidden sm:inline">© {new Date().getFullYear()} SaveMyMoney</span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="size-3.5" />
          Your money stays yours
        </span>
      </footer>
    </div>
  );
}
