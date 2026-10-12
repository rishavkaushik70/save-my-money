"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  ChartNoAxesCombined,
  Download,
  PiggyBank,
  ReceiptText,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const REPORT_RANGES = [
  { value: "THIS_MONTH", label: "This month" },
  { value: "LAST_3_MONTHS", label: "Last 3 months" },
  { value: "LAST_6_MONTHS", label: "Last 6 months" },
  { value: "THIS_YEAR", label: "This year" },
  { value: "ALL_TIME", label: "All time" },
] as const;

type ReportRange = (typeof REPORT_RANGES)[number]["value"];
type ReportTransaction = {
  id: string;
  title: string;
  category: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: Date;
};
type ReportGoal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
};
type ReportsPageProps = {
  transactions: ReportTransaction[];
  goals: ReportGoal[];
  asOf: Date;
};
type TrendPoint = {
  label: string;
  tooltipLabel: string;
  income: number;
  expenses: number;
};

const CATEGORY_COLORS = [
  "#059669",
  "#6366f1",
  "#f59e0b",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatCompactCurrency = (amount: number) =>
  `₹${new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount)}`;

const rangeLabel = (range: ReportRange) =>
  REPORT_RANGES.find((option) => option.value === range)?.label ?? "Last 6 months";

function getRangeStart(range: ReportRange, now: Date) {
  switch (range) {
    case "THIS_MONTH":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "LAST_3_MONTHS":
      return new Date(now.getFullYear(), now.getMonth() - 2, 1);
    case "LAST_6_MONTHS":
      return new Date(now.getFullYear(), now.getMonth() - 5, 1);
    case "THIS_YEAR":
      return new Date(now.getFullYear(), 0, 1);
    case "ALL_TIME":
      return null;
  }
}

function getTrendData(
  range: ReportRange,
  transactions: ReportTransaction[],
  now: Date,
): TrendPoint[] {
  if (range === "THIS_MONTH") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const points: TrendPoint[] = [];
    for (
      const cursor = new Date(start);
      cursor <= end;
      cursor.setDate(cursor.getDate() + 1)
    ) {
      const date = new Date(cursor);
      points.push({
        label: String(date.getDate()),
        tooltipLabel: date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        income: 0,
        expenses: 0,
      });
    }

    const byDay = new Map(points.map((point) => [Number(point.label), point]));
    for (const transaction of transactions) {
      const date = new Date(transaction.date);
      if (
        date.getFullYear() !== now.getFullYear() ||
        date.getMonth() !== now.getMonth()
      ) {
        continue;
      }
      const point = byDay.get(date.getDate());
      if (!point) continue;
      if (transaction.type === "INCOME") point.income += transaction.amount;
      else point.expenses += transaction.amount;
    }
    return points;
  }

  const monthCount =
    range === "LAST_3_MONTHS"
      ? 3
      : range === "LAST_6_MONTHS"
        ? 6
        : range === "THIS_YEAR"
          ? now.getMonth() + 1
          : 12;
  const points = Array.from({ length: monthCount }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - monthCount + index + 1,
      1,
    );
    return {
      label: date.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      tooltipLabel: date.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      }),
      income: 0,
      expenses: 0,
    };
  });

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const monthsAgo =
      (now.getFullYear() - date.getFullYear()) * 12 +
      now.getMonth() -
      date.getMonth();
    const point = points[monthCount - 1 - monthsAgo];
    if (!point) continue;
    if (transaction.type === "INCOME") point.income += transaction.amount;
    else point.expenses += transaction.amount;
  }
  return points;
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: "emerald" | "rose" | "violet" | "blue";
}) {
  const tones = {
    emerald:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    violet:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    blue: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  };

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:p-5 dark:bg-[#111b16] dark:hover:border-emerald-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>
          <p className="mt-3 break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 tabular-nums sm:text-3xl dark:text-slate-100">
            {value}
          </p>
        </div>
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-xs font-medium leading-5 text-slate-500">{detail}</p>
    </article>
  );
}

function ReportsPage({ transactions, goals, asOf }: ReportsPageProps) {
  const [range, setRange] = useState<ReportRange>("LAST_6_MONTHS");
  const selectedRangeLabel = rangeLabel(range);
  const start = useMemo(() => getRangeStart(range, asOf), [range, asOf]);

  const periodTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const date = new Date(transaction.date);
        return date <= asOf && (!start || date >= start);
      }),
    [transactions, asOf, start],
  );
  const incomeTransactions = useMemo(
    () => periodTransactions.filter((transaction) => transaction.type === "INCOME"),
    [periodTransactions],
  );
  const expenseTransactions = useMemo(
    () => periodTransactions.filter((transaction) => transaction.type === "EXPENSE"),
    [periodTransactions],
  );
  const totalIncome = incomeTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
  const totalExpenses = expenseTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  const hasTransactions = periodTransactions.length > 0;

  const trendData = useMemo(
    () => getTrendData(range, periodTransactions, asOf),
    [range, periodTransactions, asOf],
  );
  const hasTrendActivity = trendData.some(
    (point) => point.income > 0 || point.expenses > 0,
  );
  const allExpenseCategories = useMemo(() => {
    const totals = new Map<string, number>();
    for (const transaction of expenseTransactions) {
      totals.set(
        transaction.category,
        (totals.get(transaction.category) ?? 0) + transaction.amount,
      );
    }
    return Array.from(totals, ([category, amount]) => ({ category, amount }))
      .sort((first, second) => second.amount - first.amount);
  }, [expenseTransactions]);
  const expenseCategories = allExpenseCategories.slice(0, 6);
  const totalExpenseForMix = totalExpenses;
  const largestExpense = expenseTransactions.reduce<ReportTransaction | null>(
    (largest, transaction) =>
      !largest || transaction.amount > largest.amount ? transaction : largest,
    null,
  );
  const recentTransactions = [...periodTransactions]
    .sort(
      (first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime(),
    )
    .slice(0, 5);
  const totalGoalTarget = goals.reduce((total, goal) => total + goal.targetAmount, 0);
  const totalGoalSaved = goals.reduce((total, goal) => total + goal.currentAmount, 0);
  const goalProgress =
    totalGoalTarget > 0
      ? Math.min(100, (totalGoalSaved / totalGoalTarget) * 100)
      : 0;

  const handleExport = () => {
    const escapeCsv = (value: string | number) =>
      `"${String(value).replaceAll('"', '""')}"`;
    const rows = [
      ["Date", "Title", "Category", "Type", "Amount"],
      ...periodTransactions.map((transaction) => [
        new Date(transaction.date).toLocaleDateString("en-IN"),
        transaction.title,
        transaction.category,
        transaction.type === "INCOME" ? "Income" : "Expense",
        transaction.amount,
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `save-my-money-${range.toLowerCase()}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-w-0 w-full space-y-5 bg-slate-50 px-4 pb-8 pt-5 dark:bg-slate-950 sm:space-y-6 sm:px-6 sm:pt-6 lg:px-8 2xl:px-10">
      <header className="flex min-w-0 flex-col justify-between gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-br from-white via-white to-emerald-50/80 p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center dark:border-slate-800 dark:from-[#111b16] dark:via-[#111b16] dark:to-[#102a20]">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <ChartNoAxesCombined className="size-3.5" aria-hidden="true" />
            Your money, in focus
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl dark:text-slate-100">
            Financial reports
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Follow your cash flow, understand your spending, and see how your savings goals are moving.
          </p>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row lg:w-auto">
          <Select
            value={range}
            onValueChange={(value) => value && setRange(value as ReportRange)}
          >
            <SelectTrigger
              aria-label="Choose report date range"
              className="h-11 w-full rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm sm:w-44 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            >
              <CalendarRange
                className="size-4 text-emerald-700 dark:text-emerald-300"
                aria-hidden="true"
              />
              <SelectValue>{selectedRangeLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {REPORT_RANGES.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-emerald-200 bg-white text-emerald-800 shadow-sm hover:bg-emerald-50 dark:border-emerald-900 dark:bg-slate-900/70 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
            onClick={handleExport}
            disabled={!hasTransactions}
          >
            <Download aria-hidden="true" />
            Export CSV
          </Button>
        </div>
      </header>

      <section
        aria-label={`${selectedRangeLabel} financial summary`}
        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          title="Income"
          value={formatCurrency(totalIncome)}
          detail={`${selectedRangeLabel} · ${incomeTransactions.length} deposits`}
          icon={ArrowDownLeft}
          tone="emerald"
        />
        <MetricCard
          title="Expenses"
          value={formatCurrency(totalExpenses)}
          detail={`${selectedRangeLabel} · ${expenseTransactions.length} purchases`}
          icon={ArrowUpRight}
          tone="rose"
        />
        <MetricCard
          title="Net savings"
          value={formatCurrency(netSavings)}
          detail="Income left after recorded expenses"
          icon={Wallet}
          tone="violet"
        />
        <MetricCard
          title="Savings rate"
          value={`${savingsRate.toFixed(1)}%`}
          detail="Net savings as a share of income"
          icon={PiggyBank}
          tone="blue"
        />
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.85fr)]">
        <article className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-[#111b16]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                Cash flow
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Income vs expenses
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {range === "THIS_MONTH"
                  ? "Daily totals for this month"
                  : range === "ALL_TIME"
                    ? "Monthly trend · last 12 months"
                    : `Monthly totals · ${selectedRangeLabel.toLowerCase()}`}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="size-2 rounded-full bg-emerald-500" /> Income
              <span className="ml-1 size-2 rounded-full bg-rose-500" /> Expenses
            </span>
          </div>

          {hasTrendActivity ? (
            <div className="mt-4 h-72 min-w-0 sm:h-80" aria-label="Income and expenses chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendData}
                  margin={{ top: 12, right: 4, left: 4, bottom: 4 }}
                >
                  <CartesianGrid
                    stroke="var(--border)"
                    strokeDasharray="4 5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={range === "THIS_MONTH" ? 14 : 8}
                  />
                  <YAxis
                    width={58}
                    tickFormatter={formatCompactCurrency}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.tooltipLabel ?? ""
                    }
                    formatter={(value, name) => [
                      formatCurrency(Number(value ?? 0)),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      borderColor: "var(--border)",
                      borderRadius: "14px",
                      color: "var(--popover-foreground)",
                      boxShadow: "0 10px 30px -16px rgba(15, 23, 42, 0.4)",
                    }}
                    itemStyle={{ color: "var(--popover-foreground)" }}
                    cursor={{ fill: "rgba(16, 185, 129, 0.08)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={30}
                    formatter={(value) => (
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#fb7185"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="mt-4 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                <ReceiptText className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                {periodTransactions.length > 0 && range === "ALL_TIME"
                  ? "No cash flow in the latest 12 months"
                  : `No activity in ${selectedRangeLabel.toLowerCase()}`}
              </h3>
              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-400">
                {periodTransactions.length > 0 && range === "ALL_TIME"
                  ? "Your totals and activity below still include your full transaction history."
                  : "Add income or expenses to see your cash flow report here."}
              </p>
              <Link
                href="/transaction"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 dark:text-emerald-300 dark:hover:text-emerald-200"
              >
                Go to transactions
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </article>

        <article className="min-w-0 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/60 p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:from-[#111b16] dark:via-[#111b16] dark:to-[#102a20]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                Where it goes
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Spending by category
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {formatCurrency(totalExpenses)} across this period
              </p>
            </div>
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <Target className="size-5" aria-hidden="true" />
            </span>
          </div>

          {expenseCategories.length > 0 ? (
            <div className="mt-6 space-y-4">
              {expenseCategories.map((item, index) => {
                const percentage = totalExpenseForMix
                  ? (item.amount / totalExpenseForMix) * 100
                  : 0;
                const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                return (
                  <div key={item.category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate font-semibold text-slate-800 dark:text-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <span className="shrink-0 text-right text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
                        {formatCurrency(item.amount)}
                        <span className="ml-1.5 font-medium text-slate-400">
                          {Math.round(percentage)}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{
                          width: `${Math.max(percentage, item.amount > 0 ? 2 : 0)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {allExpenseCategories.length > 6 && (
                <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
                  Showing your 6 highest spending categories.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No expenses in this range
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Your expense categories will appear here when recorded.
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-slate-200/80 pt-4 dark:border-slate-700">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Largest expense
                </p>
                {largestExpense ? (
                  <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                    {largestExpense.title}{" "}
                    <span className="font-medium text-slate-500">
                      · {largestExpense.category}
                    </span>
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">No expenses yet</p>
                )}
              </div>
              {largestExpense && (
                <span className="shrink-0 text-sm font-bold text-rose-600 dark:text-rose-300">
                  {formatCurrency(largestExpense.amount)}
                </span>
              )}
            </div>
          </div>
        </article>
      </section>

      <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <article className="min-w-0 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-[#111b16]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                Activity
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 dark:text-slate-100">
                Recent transactions
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest activity in {selectedRangeLabel.toLowerCase()}
              </p>
            </div>
            <Link
              href="/transaction"
              className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:text-emerald-300"
            >
              View all <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((transaction) => {
                const isIncome = transaction.type === "INCOME";
                return (
                  <div
                    key={transaction.id}
                    className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        isIncome
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="size-5" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="size-5" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                        {transaction.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {transaction.category} ·{" "}
                        {new Date(transaction.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-sm font-bold tabular-nums ${
                        isIncome
                          ? "text-emerald-700 dark:text-emerald-300"
                          : "text-slate-900 dark:text-slate-100"
                      }`}
                    >
                      {isIncome ? "+" : "−"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-8 text-center dark:bg-slate-900/50">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Nothing to show yet
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Transactions from this period will show up here.
              </p>
            </div>
          )}
        </article>

        <article className="min-w-0 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:from-[#102a20] dark:via-[#111b16] dark:to-[#111b16]">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-100 dark:bg-[#0b1c14] dark:text-emerald-300 dark:ring-emerald-900">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                At a glance
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 dark:text-slate-100">
                A clearer money picture
              </h2>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                <PiggyBank className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Savings goals
                  </p>
                  {goals.length > 0 && (
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-300">
                      {Math.round(goalProgress)}%
                    </span>
                  )}
                </div>
                {goals.length > 0 ? (
                  <>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatCurrency(totalGoalSaved)} saved of{" "}
                      {formatCurrency(totalGoalTarget)} across {goals.length}{" "}
                      {goals.length === 1 ? "goal" : "goals"}
                    </p>
                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                      role="progressbar"
                      aria-label="Overall savings goal progress"
                      aria-valuenow={Math.round(goalProgress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-[width]"
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Add a savings goal to track progress alongside your reports.
                  </p>
                )}
                <Link
                  href="/goals"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-violet-200"
                >
                  {goals.length > 0 ? "View goals" : "Create a goal"}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/65 px-4 py-3 dark:bg-slate-900/50">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
              <ChartNoAxesCombined className="size-4" aria-hidden="true" />
            </span>
            <p className="min-w-0 text-xs leading-5 text-slate-600 dark:text-slate-300">
              {periodTransactions.length === 0
                ? "Record a transaction to start building your financial history."
                : netSavings >= 0
                  ? `You kept ${formatCurrency(netSavings)} after expenses during ${selectedRangeLabel.toLowerCase()}.`
                  : `Expenses were ${formatCurrency(Math.abs(netSavings))} higher than income during ${selectedRangeLabel.toLowerCase()}.`}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default ReportsPage;
