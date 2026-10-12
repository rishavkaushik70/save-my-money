"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, ListFilter, RotateCcw, Search } from "lucide-react";

type TransactionFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
  type: string;
  setType: (value: string) => void;
  period: string;
  setPeriod: (value: string) => void;
  resultCount: number;
  onReset: () => void;
};

const fieldLabelClassName =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500";

const triggerClassName =
  "h-11 w-full rounded-xl border-slate-200 bg-white px-3 text-slate-900 shadow-sm transition hover:border-emerald-300 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100";

const TransactionFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  type,
  setType,
  period,
  setPeriod,
  resultCount,
  onReset,
}: TransactionFiltersProps) => {
  const hasActiveFilters =
    search.trim().length > 0 ||
    category !== "ALL" ||
    type !== "ALL" ||
    period !== "ALL";
  const categoryLabel = category === "ALL" ? "All categories" : category;
  const typeLabel =
    type === "INCOME" ? "Income" : type === "EXPENSE" ? "Expense" : "All types";
  const periodLabel =
    period === "TODAY"
      ? "Today"
      : period === "WEEK"
        ? "This week"
        : period === "MONTH"
          ? "This month"
          : "Any date";

  return (
    <section
      aria-label="Transaction filters"
      className="border-b border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-[#0f1913]"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
            <ListFilter className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Find a transaction
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {resultCount} {resultCount === 1 ? "result" : "results"} match
              {hasActiveFilters ? " your filters" : " your activity"}
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="rounded-lg text-emerald-800 hover:bg-emerald-100/70 hover:text-emerald-950 dark:text-emerald-300 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
          >
            <RotateCcw aria-hidden="true" />
            Reset filters
          </Button>
        )}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0">
          <label htmlFor="transaction-search" className={fieldLabelClassName}>
            Search
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              id="transaction-search"
              aria-label="Search transactions by title or category"
              placeholder="Title or category…"
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/20 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="min-w-0">
          <label className={fieldLabelClassName}>Category</label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value ?? "ALL")}
          >
            <SelectTrigger aria-label="Filter by category" className={triggerClassName}>
              <SelectValue>{categoryLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All categories</SelectItem>
              {categories.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
          <label className={fieldLabelClassName}>Transaction type</label>
          <Select value={type} onValueChange={(value) => setType(value ?? "ALL")}>
            <SelectTrigger aria-label="Filter by transaction type" className={triggerClassName}>
              <SelectValue>{typeLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-0">
          <label className={fieldLabelClassName}>Date range</label>
          <Select
            value={period}
            onValueChange={(value) => setPeriod(value ?? "ALL")}
          >
            <SelectTrigger aria-label="Filter by date range" className={triggerClassName}>
              <CalendarDays className="size-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <SelectValue>{periodLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Any date</SelectItem>
              <SelectItem value="TODAY">Today</SelectItem>
              <SelectItem value="WEEK">This week</SelectItem>
              <SelectItem value="MONTH">This month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default TransactionFilters;
