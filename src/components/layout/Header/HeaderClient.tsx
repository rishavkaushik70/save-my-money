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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";
import { logout } from "@/actions/auth";

const pageTitles = {
  dashboard: "Dashboard",
  transaction: "Transaction",
  goals: "Goals",
  categories: "Categories",
  reports: "Reports",
  settings: "Settings",
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Transactions",
    href: "/transaction",
    icon: ReceiptText,
  },
  {
    label: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: ChartColumn,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface HeaderClientProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
}

const HeaderClient = ({ user }: HeaderClientProps) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const page = pathname.split("/")[1] || "dashboard";
  const title = pageTitles[page as keyof typeof pageTitles] || "Dashboard";

  return (
    <>
      <header className="flex w-full py-5 bg-white border-b px-4 md:px-10 h-17 justify-between items-center sticky top-0 z-40 md:z-50">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-1 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-6" />
          </Button>

          <div>
            <h1 className="font-bold text-lg md:text-xl">{title}</h1>

            {title === "Transaction" && (
              <p className="hidden sm:block text-sm text-gray-500 mt-0.5">
                Track and manage all your income and expenses.
              </p>
            )}

            {title === "Goals" && (
              <p className="hidden sm:block text-sm text-gray-500 mt-0.5">
                Track your progress and achieve your financial goals.
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Notification */}
          <div className="relative">
            <Bell className="text-primary" />

            <span className="absolute -top-3 -right-3 bg-primary rounded-full px-1.5 py-0.5 text-xs text-white flex justify-center items-center">
              0
            </span>
          </div>

          {/* USER */}
          {user && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.image ?? ""} alt={user.name} />

                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:block">
                <p className="font-medium text-sm">{user.name}</p>

                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Slide-over Drawer */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-50 shadow-xl flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b h-17">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary font-bold flex gap-1.5 items-center text-lg"
                >
                  <Bot className="size-6 -rotate-7" />
                  SaveMyMoney
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-gray-500 hover:text-gray-900"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="size-5" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start pl-4 py-5 gap-3 font-semibold ${
                          isActive
                            ? "bg-primary/15 text-primary hover:bg-primary/20"
                            : "text-muted-foreground hover:bg-primary/10"
                        }`}
                      >
                        <item.icon className="size-5" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Action: Add Transaction */}
              <div className="px-4 mt-4">
                <AddTransactionDialog>
                  <Button className="w-full gap-2">
                    <Plus className="size-4" />
                    Add Transaction
                  </Button>
                </AddTransactionDialog>
              </div>
            </div>

            {/* Bottom Drawer Section: User info & Logout */}
            <div className="p-4 border-t mt-auto">
              <form action={logout}>
                <Button
                  type="submit"
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:bg-primary/15 gap-2 font-semibold mb-3"
                >
                  <LogOut className="size-5" />
                  Logout
                </Button>
              </form>

              {user && (
                <div className="flex items-center gap-3 pt-3 border-t">
                  <Avatar className="size-9">
                    <AvatarImage src={user.image ?? ""} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">
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
