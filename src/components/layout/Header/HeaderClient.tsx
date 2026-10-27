"use client";

import {
  Bell,
  Bot,
  ChartColumn,
  House,
  LogOut,
  Menu,
  Plus,
  ReceiptText,
  Settings,
  Target,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { logout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";
import { usePersonalSettings } from "@/components/settings/SettingsProvider";

const pageDetails: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: "Dashboard",
    description: "Your money, organized at a glance.",
  },
  transaction: {
    title: "Transactions",
    description: "Track and manage your income and expenses.",
  },
  goals: {
    title: "Goals",
    description: "Small steps toward your next money goal.",
  },
  categories: {
    title: "Categories",
    description: "Organize spending in a way that makes sense.",
  },
  reports: {
    title: "Reports",
    description: "Understand where your money goes.",
  },
  settings: {
    title: "Settings",
    description: "Manage your account and preferences.",
  },
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Transactions", href: "/transaction", icon: ReceiptText },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Reports", href: "/reports", icon: ChartColumn },
  { label: "Settings", href: "/settings", icon: Settings },
];

import { SubscriptionTierType } from "@/lib/subscriptions/config";

interface HeaderClientProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
  tier?: SubscriptionTierType;
}

const HeaderClient = ({ user, tier = "FREE" }: HeaderClientProps) => {
  const pathname = usePathname();
  const { avatarImage, avatarCustomized } = usePersonalSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileMenuOpen]);

  const page = pathname.split("/")[1] || "dashboard";
  const details = pageDetails[page] ?? pageDetails.dashboard;
  const displayImage = avatarCustomized ? avatarImage : user?.image;

  return (
    <>
      <header className="sticky top-0 z-40 flex min-h-19 w-full items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-3 shadow-[0_8px_24px_-22px_rgba(15,23,42,0.6)] backdrop-blur-xl sm:px-5 md:z-50 md:px-8 2xl:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 size-10 shrink-0 rounded-xl text-slate-700 hover:bg-emerald-50 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="size-6" />
          </Button>

          <div className="min-w-0">
            <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 sm:block">
              Personal finance
            </p>
            <h1 className="truncate text-base font-bold tracking-tight text-slate-950 sm:text-lg">
              {details.title}
            </h1>
            <p className="hidden truncate text-xs text-slate-500 lg:block">
              {details.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <AddTransactionDialog>
            <Button
              size="sm"
              aria-label="Add transaction"
              className="h-9 w-9 rounded-xl px-0 shadow-sm sm:w-auto sm:gap-2 sm:px-3"
            >
              <Plus className="size-4" />
              <span className="sr-only sm:not-sr-only">Add transaction</span>
            </Button>
          </AddTransactionDialog>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              aria-haspopup="dialog"
              className="size-9 rounded-xl border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => setNotificationsOpen((open) => !open)}
            >
              <Bell className="size-4" />
            </Button>
            {notificationsOpen && (
              <div
                role="status"
                aria-label="Notifications"
                className="absolute -right-2 sm:right-0 top-11 z-50 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
              >
                <p className="text-sm font-bold text-slate-900">
                  You’re all caught up
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  New reminders and account updates will appear here.
                </p>
              </div>
            )}
          </div>

          {user && (
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Avatar className="size-9 shrink-0 ring-2 ring-emerald-100 sm:size-10">
                {displayImage && (
                  <AvatarImage src={displayImage} alt={user.name} />
                )}
                <AvatarFallback className="bg-emerald-50 font-bold text-emerald-800">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 sm:block">
                <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
                  {user.name}
                </p>
                <p className="max-w-40 truncate text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="fixed inset-y-0 left-0 z-[61] flex w-72 max-w-[85vw] flex-col justify-between overflow-y-auto border-r border-white/60 bg-[#fbfdfc]/95 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/95"
          >
            <div>
              <div className="flex h-16 items-center justify-between border-b border-slate-200/70 px-5">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900"
                >
                  <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-primary">
                    <Bot className="size-5" />
                  </span>
                  SaveMy<span className="text-primary">Money</span>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="size-5" />
                </Button>
              </div>

              <nav
                aria-label="Primary navigation"
                className="flex flex-col gap-1.5 p-4"
              >
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${isActive
                          ? "bg-emerald-700 text-white shadow-sm"
                          : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
                        }`}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto border-t border-slate-200 p-4">
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="mb-3 w-full justify-start gap-2 font-semibold text-slate-600 hover:bg-emerald-50"
                >
                  <LogOut className="size-5" />
                  Sign out
                </Button>
              </form>
              {user && (
                <div className="flex items-center gap-3 border-t border-slate-200 pt-3">
                  <Avatar className="size-9 ring-2 ring-emerald-100">
                    {displayImage && (
                      <AvatarImage src={displayImage} alt={user.name} />
                    )}
                    <AvatarFallback className="bg-emerald-50 font-bold text-emerald-800">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {tier === "PREMIUM"
                          ? "Premium"
                          : tier === "PRO"
                            ? "Pro"
                            : "Free"}
                      </span>
                    </div>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default HeaderClient;
