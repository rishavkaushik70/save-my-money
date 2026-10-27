"use client";

import { useState } from "react";
import {
  IndianRupee,
  ShoppingCart,
  Utensils,
  Bus,
  Film,
  Zap,
  User,
  Apple,
  EllipsisVertical,
  Pencil,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Key,
  RotateCcw,
  Gift,
  Wallet,
  Home,
  HeartPulse,
  GraduationCap,
  Plane,
  CreditCard,
  ShieldCheck,
  Receipt,
  ReceiptText,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";
import { Transaction } from "@/generated/prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";

const categoryIcons: Record<string, LucideIcon> = {
  // Canonical Expenses
  "Food & Dining": Utensils,
  Groceries: Apple,
  Transport: Bus,
  "Housing & Rent": Home,
  Utilities: Zap,
  Shopping: ShoppingCart,
  "Health & Medical": HeartPulse,
  Education: GraduationCap,
  Entertainment: Film,
  "Personal Care": User,
  Travel: Plane,
  "EMI & Loan Payments": CreditCard,
  Insurance: ShieldCheck,
  "Family & Gifts": Gift,
  "Savings & Investments": TrendingUp,
  "Fees & Charges": Receipt,
  Taxes: ReceiptText,
  "Other Expense": CircleDollarSign,

  // Canonical Income
  Salary: Briefcase,
  Freelance: Laptop,
  "Business Income": Building2,
  "Investment Returns": TrendingUp,
  "Rental Income": Key,
  Refunds: RotateCcw,
  "Gifts Received": Gift,
  "Other Income": Wallet,

  // Historical & Legacy Aliases
  Food: Utensils,
  Personal: User,
  Business: Building2,
  Investment: TrendingUp,
  Other: CircleDollarSign,
};

type RecentTransactionProps = {
  transactions: Transaction[];
};

const RecentTransaction = ({ transactions }: RecentTransactionProps) => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
            Your activity
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Recent transactions
          </h2>
        </div>
        <Link
          href="/transaction"
          className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
        >
          View all
          <span aria-hidden="true">↗</span>
        </Link>
      </div>

      {transactions.length > 0 ? (
        <div className="mt-3 divide-y divide-slate-100">
          {transactions.map((data) => {
            const Icon =
              categoryIcons[data.category as keyof typeof categoryIcons] ??
              IndianRupee;
            const transactionDate = new Date(data.date);

            return (
              <article
                className="flex min-w-0 items-center justify-between gap-2.5 sm:gap-3 py-3 sm:py-3.5"
                key={data.id}
              >
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="size-4 sm:size-[18px]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {data.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {data.category} · {data.type.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <div className="text-right">
                    <p
                      className={`whitespace-nowrap text-xs sm:text-sm font-bold tabular-nums ${
                        data.type === "INCOME"
                          ? "text-emerald-700"
                          : "text-slate-900"
                      }`}
                    >
                      {data.type === "INCOME" ? "+" : "−"}₹
                      {data.amount.toLocaleString("en-IN")}
                    </p>
                    <time
                      className="mt-0.5 sm:mt-1 block text-[10px] sm:text-[11px] font-medium text-slate-500"
                      dateTime={transactionDate.toISOString()}
                    >
                      {transactionDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </time>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 rounded-xl text-slate-500 hover:text-slate-900"
                          aria-label={`Options for ${data.title}`}
                        >
                          <EllipsisVertical className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingTransaction(data);
                        }}
                      >
                        <Pencil className="size-4" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
          <p className="text-sm font-semibold text-slate-800">
            No transactions yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Add one to see your recent activity here.
          </p>
        </div>
      )}

      <TransactionDialog
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTransaction(null);
          }
        }}
      />
    </section>
  );
};

export default RecentTransaction;
