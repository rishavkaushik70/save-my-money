"use client";

import {
  ChartColumn,
  House,
  ReceiptText,
  Settings,
  Target,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: House },
  { label: "Transactions", href: "/transaction", icon: ReceiptText },
  { label: "Goals", href: "/goals", icon: Target },
  { label: "Reports", href: "/reports", icon: ChartColumn },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1.5 px-1 pt-6">
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        Workspace
      </p>
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
              isActive
                ? "bg-emerald-700 text-white shadow-[0_8px_18px_-12px_rgba(4,120,87,0.8)]"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-900 dark:text-slate-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
            }`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-900/70 dark:group-hover:text-emerald-200"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="truncate">{label}</span>
            {isActive && (
              <span className="ml-auto size-1.5 rounded-full bg-emerald-200" aria-hidden="true" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
