"use client";

import { useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Minus,
  ReceiptText,
  Sparkles,
} from "lucide-react";
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { getExpensesByCategory } from "@/actions/transactions";
import {
  EXPENSE_PERIODS,
  type ExpenseBreakdown,
  type ExpensePeriod,
} from "@/lib/types/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExpensesByCategoryProps = {
  initialBreakdown: ExpenseBreakdown;
};

const COLORS = [
  "#059669",
  "#6366f1",
  "#f59e0b",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: amount >= 10_000_000 ? "compact" : "standard",
  }).format(amount);

const ExpensesByCategory = ({
  initialBreakdown,
}: ExpensesByCategoryProps) => {
  const [period, setPeriod] = useState<ExpensePeriod>("This month");
  const [breakdown, setBreakdown] = useState(initialBreakdown);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const requestId = useRef(0);

  const chartData = breakdown.categories;
  const totalExpense = breakdown.totalExpense;
  const topCategory = chartData[0];
  const previousExpense = breakdown.previousPeriodExpense;
  const expenseChange = totalExpense - previousExpense;
  const expenseChangePercent =
    previousExpense > 0
      ? Math.round((expenseChange / previousExpense) * 100)
      : null;
  const comparisonLabel =
    period === "This month"
      ? "vs. same period last month"
      : period === "This week"
        ? "vs. same days last week"
        : "vs. yesterday";
  const expenseChangeColor =
    expenseChange > 0
      ? "text-rose-700"
      : expenseChange < 0
        ? "text-emerald-700"
        : "text-slate-700";
  const selectedTransactions = selectedCategory
    ? breakdown.transactions.filter(
        (transaction) => transaction.category === selectedCategory,
      )
    : [];
  const selectedPeriodLabel =
    EXPENSE_PERIODS.find((item) => item.value === period)?.label ?? period;

  const handlePeriodChange = async (value: string | null) => {
    if (!value || !EXPENSE_PERIODS.some((item) => item.value === value)) return;

    const nextPeriod = value as ExpensePeriod;
    const currentRequest = ++requestId.current;
    setPeriod(nextPeriod);
    setSelectedCategory(null);
    setLoadError(null);
    setIsLoading(true);

    try {
      const nextBreakdown = await getExpensesByCategory(nextPeriod);
      if (currentRequest === requestId.current) setBreakdown(nextBreakdown);
    } catch {
      if (currentRequest === requestId.current) {
        setLoadError("Could not load expenses. Please try again.");
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    const nextCategory = selectedCategory === category ? null : category;
    const currentRequest = ++requestId.current;
    setSelectedCategory(nextCategory);
    setLoadError(null);

    if (!nextCategory) {
      setBreakdown((current) => ({
        ...current,
        transactions: [],
        hasMoreTransactions: false,
      }));
      setIsLoading(false);
      return;
    }

    setBreakdown((current) => ({
      ...current,
      transactions: [],
      hasMoreTransactions: false,
    }));
    setIsLoading(true);

    try {
      const nextBreakdown = await getExpensesByCategory(period, nextCategory);
      if (currentRequest === requestId.current) setBreakdown(nextBreakdown);
    } catch {
      if (currentRequest === requestId.current) {
        setLoadError("Could not load these transactions. Please try again.");
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!selectedCategory || !breakdown.hasMoreTransactions || isLoading) return;

    const currentRequest = ++requestId.current;
    const offset = breakdown.transactions.length;
    setLoadError(null);
    setIsLoading(true);

    try {
      const nextBreakdown = await getExpensesByCategory(
        period,
        selectedCategory,
        offset,
      );
      if (currentRequest === requestId.current) {
        setBreakdown((current) => ({
          ...nextBreakdown,
          categories: current.categories,
          transactions: [...current.transactions, ...nextBreakdown.transactions],
        }));
      }
    } catch {
      if (currentRequest === requestId.current) {
        setLoadError("Could not load more transactions. Please try again.");
      }
    } finally {
      if (currentRequest === requestId.current) setIsLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="expense-breakdown-title"
      className="min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/70 p-4 shadow-[0_16px_45px_-32px_rgba(15,23,42,0.35)] sm:p-5"
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/70">
            <CalendarDays className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Spending insights
            </p>
            <h2
              id="expense-breakdown-title"
              className="mt-0.5 text-lg font-bold tracking-tight text-slate-950 sm:text-xl"
            >
              Expenses by category
            </h2>
          </div>
        </div>

        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger
            aria-label="Filter expense breakdown by date"
            className="h-10 w-full rounded-xl border-slate-200 bg-white/90 shadow-sm sm:w-40"
          >
            <SelectValue placeholder="Choose period" />
          </SelectTrigger>
          <SelectContent>
            {EXPENSE_PERIODS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <div
        className="mt-4 flex min-h-5 flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-500"
        aria-live="polite"
      >
        <span>
          {selectedPeriodLabel} · expense total · {breakdown.transactionCount} {breakdown.transactionCount === 1 ? "expense" : "expenses"}
        </span>
        {isLoading && <span className="font-semibold text-emerald-700">Updating…</span>}
      </div>

      {loadError && (
        <p role="alert" className="mt-2 text-sm font-medium text-rose-700">
          {loadError}
        </p>
      )}

      {chartData.length > 0 ? (
        <>
          <div className="mt-2 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.8fr)]">
            <div className="grid min-w-0 grid-cols-1 items-center gap-3 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(13rem,0.9fr)]">
              <div className="h-56 min-w-0 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={88}
                      innerRadius={61}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={entry.category}
                          fill={COLORS[index % COLORS.length]}
                          opacity={
                            selectedCategory && selectedCategory !== entry.category
                              ? 0.38
                              : 1
                          }
                        />
                      ))}
                      <Label
                        position="center"
                        content={() => (
                          <g>
                            <text
                              x="50%"
                              y="47%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-slate-950 font-bold text-base dark:fill-slate-100"
                            >
                              {formatAmount(totalExpense)}
                            </text>
                            <text
                              x="50%"
                              y="58%"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-slate-500 text-[11px] dark:fill-slate-400"
                            >
                              total spent
                            </text>
                          </g>
                        )}
                      />
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatAmount(Number(value))}
                      contentStyle={{
                        borderRadius: 14,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 12px 30px -16px rgba(15, 23, 42, .35)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {chartData.map((item, index) => {
                  const isSelected = selectedCategory === item.category;
                  return (
                    <button
                      key={item.category}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => void handleCategorySelect(item.category)}
                      className={`flex min-h-12 min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/60"
                          : "border-slate-200/80 bg-white/80 hover:border-emerald-200 hover:bg-white dark:border-slate-700 dark:hover:border-emerald-800"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className="size-2.5 shrink-0 rounded-full ring-4 ring-white dark:ring-slate-900"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="truncate text-sm font-medium text-slate-700">
                          {item.category}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-xs font-bold tabular-nums text-slate-900 sm:text-sm">
                        {formatAmount(item.amount)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside
              aria-labelledby="spending-snapshot-title"
              className="min-w-0 rounded-2xl border border-emerald-100 bg-emerald-50/55 p-3.5 sm:p-4"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Spending snapshot
                  </p>
                  <h3 id="spending-snapshot-title" className="text-sm font-bold text-slate-900">
                    Spending at a glance
                  </h3>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-1">
                <article className="min-w-0 rounded-xl border border-white/90 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-[11px] font-semibold text-slate-500">Top category</p>
                  <div className="mt-1 flex min-w-0 items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {topCategory?.category ?? "No expenses yet"}
                    </p>
                    {topCategory && (
                      <p className="shrink-0 text-xs font-bold tabular-nums text-slate-900">
                        {formatAmount(topCategory.amount)}
                      </p>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {topCategory && totalExpense > 0
                      ? `${Math.round((topCategory.amount / totalExpense) * 100)}% of this period's spend`
                      : "A category appears after an expense is added."}
                  </p>
                </article>

                <article className="min-w-0 rounded-xl border border-white/90 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold text-slate-500">Average per day</p>
                    <CalendarDays className="size-3.5 text-emerald-700" aria-hidden="true" />
                  </div>
                  <p className="mt-1 text-sm font-bold tabular-nums text-slate-900">
                    {formatAmount(breakdown.dailyAverage)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Across {selectedPeriodLabel.toLowerCase()}
                  </p>
                </article>

                <article className="min-w-0 rounded-xl border border-white/90 bg-white/90 p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold text-slate-500">Period change</p>
                    {expenseChange > 0 ? (
                      <ArrowUpRight className="size-4 text-rose-600" aria-hidden="true" />
                    ) : expenseChange < 0 ? (
                      <ArrowDownRight className="size-4 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <Minus className="size-4 text-slate-500" aria-hidden="true" />
                    )}
                  </div>
                  <p className={`mt-1 text-sm font-bold tabular-nums ${expenseChangeColor}`}>
                    {expenseChange > 0 ? "+" : expenseChange < 0 ? "−" : ""}
                    {formatAmount(Math.abs(expenseChange))}
                    {expenseChangePercent !== null && (
                      <span className="ml-1 text-xs font-semibold">
                        ({expenseChangePercent > 0 ? "+" : ""}{expenseChangePercent}%)
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {expenseChangePercent === null && totalExpense > 0
                      ? `New spending ${comparisonLabel}`
                      : expenseChangePercent === null
                        ? `No spending ${comparisonLabel}`
                        : comparisonLabel}
                  </p>
                </article>
              </div>
            </aside>
          </div>

          <div className="mt-4 border-t border-slate-200/80 pt-4">
            {selectedCategory ? (
              <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      {selectedPeriodLabel}
                    </p>
                    <h3 className="mt-1 truncate text-base font-bold text-slate-900">
                      {selectedCategory} transactions
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {selectedTransactions.length}
                  </span>
                </div>

                {selectedTransactions.length > 0 ? (
                  <div className="max-h-64 divide-y divide-slate-100 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/80 px-3 dark:border-slate-700 dark:bg-slate-900">
                    {selectedTransactions.map((transaction) => (
                      <article
                        key={transaction.id}
                        className="flex min-w-0 items-center justify-between gap-3 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <ReceiptText className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {transaction.title}
                            </p>
                            <time
                              className="mt-0.5 block text-xs text-slate-500"
                              dateTime={transaction.date.toISOString()}
                            >
                              {transaction.date.toLocaleDateString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </time>
                          </div>
                        </div>
                        <span className="shrink-0 whitespace-nowrap text-sm font-bold tabular-nums text-slate-900">
                          {formatAmount(transaction.amount)}
                        </span>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-600">
                    No {selectedCategory.toLowerCase()} expenses for {selectedPeriodLabel.toLowerCase()}.
                  </p>
                )}

                {breakdown.hasMoreTransactions && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => void handleLoadMore()}
                    className="mt-2 inline-flex min-h-9 items-center rounded-xl px-3 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                  >
                    {isLoading ? "Loading…" : "Load more transactions"}
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const firstCategory = chartData[0]?.category;
                  if (firstCategory) void handleCategorySelect(firstCategory);
                }}
                className="group flex w-full items-center justify-between gap-3 rounded-xl bg-emerald-50/80 px-3 py-3 text-left transition hover:bg-emerald-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-800">
                    Choose a category to see its transactions
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-600">
                    Each expense includes its date and amount.
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-emerald-800 transition group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="mt-3 grid min-h-56 place-items-center rounded-2xl border border-dashed border-slate-200 bg-white/70 px-5 text-center">
          <div>
            <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ReceiptText className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-slate-800">
              No expenses for {selectedPeriodLabel.toLowerCase()}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
              Add an expense in this period and its category chart and dated transactions will appear here.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpensesByCategory;
