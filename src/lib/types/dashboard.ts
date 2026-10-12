import type { Transaction } from "@/generated/prisma/client";

export const EXPENSE_PERIODS = [
  { value: "This month", label: "This month" },
  { value: "This week", label: "This week" },
  { value: "Today", label: "Today" },
] as const;

export type ExpensePeriod = (typeof EXPENSE_PERIODS)[number]["value"];

export type ExpenseBreakdown = {
  categories: { category: string; amount: number }[];
  transactions: Pick<
    Transaction,
    "id" | "title" | "category" | "amount" | "date"
  >[];
  hasMoreTransactions: boolean;
  totalExpense: number;
  transactionCount: number;
  dailyAverage: number;
  previousPeriodExpense: number;
};
