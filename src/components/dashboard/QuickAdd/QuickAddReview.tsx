"use client";

import React, { useState, useRef, useId } from "react";
import {
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Tag,
  Trash2,
  Plus,
  Coins,
} from "lucide-react";
import { toast } from "sonner";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  isCategoryAllowedForType,
  TransactionType,
} from "@/lib/constants/transaction";
import {
  transactionSchema,
  MAX_TRANSACTION_AMOUNT,
  TransactionOutput,
} from "@/lib/validators/transactions";
import { createManyTransactions } from "@/actions/transactions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getCurrentTimestamp(): number {
  return Date.now();
}

export type QuickAddReviewDraft = {
  id?: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE" | "";
  category: string;
  date: string;
  description: string;
  rawInput?: string;
  needsReview: boolean;
  reasoning?: string;
};

export interface QuickAddReviewProps {
  draft?: QuickAddReviewDraft;
  drafts?: QuickAddReviewDraft[];
  onChange?: (updated: Partial<QuickAddReviewDraft>) => void;
  onDraftChange?: (id: string, updated: Partial<QuickAddReviewDraft>) => void;
  onRemoveDraft?: (id: string) => void;
  onAddDraft?: () => void;
  onSaveSuccess: () => void;
  onClear: () => void;
  onOpenInDialog?: (draft?: QuickAddReviewDraft) => void;
}

export function QuickAddReview({
  draft,
  drafts: multiDrafts,
  onChange,
  onDraftChange,
  onRemoveDraft,
  onAddDraft,
  onSaveSuccess,
  onClear,
  onOpenInDialog,
}: QuickAddReviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const isSubmittingRef = useRef(false);
  const fallbackId = useId();

  // Normalize single-draft vs multi-draft props for backward compatibility
  const activeDrafts: QuickAddReviewDraft[] = React.useMemo(() => {
    if (multiDrafts && multiDrafts.length > 0) {
      return multiDrafts.map((d, index) => ({
        ...d,
        id: d.id || `draft-${index}-${fallbackId}`,
      }));
    }
    if (draft) {
      return [
        {
          ...draft,
          id: draft.id || `draft-0-${fallbackId}`,
        },
      ];
    }
    return [];
  }, [multiDrafts, draft, fallbackId]);

  // Handle updates to an individual draft item
  const handleItemChange = (
    id: string,
    updated: Partial<QuickAddReviewDraft>
  ) => {
    if (onDraftChange) {
      onDraftChange(id, updated);
    } else if (onChange && activeDrafts[0]?.id === id) {
      onChange(updated);
    }
  };

  // Handle type change with category compatibility reset
  const handleItemTypeChange = (
    item: QuickAddReviewDraft,
    newType: "INCOME" | "EXPENSE"
  ) => {
    if (item.type === newType) return;
    const isCurrentAllowed = isCategoryAllowedForType(item.category, newType);
    handleItemChange(item.id!, {
      type: newType,
      category: isCurrentAllowed ? item.category : "",
    });
  };

  // Financial preview math (derived strictly from client-editable drafts, not unverified AI totals)
  const totalIncome = activeDrafts.reduce((sum, d) => {
    const amt = Number(d.amount);
    return d.type === "INCOME" && !isNaN(amt) && amt > 0 ? sum + amt : sum;
  }, 0);

  const totalExpense = activeDrafts.reduce((sum, d) => {
    const amt = Number(d.amount);
    return d.type === "EXPENSE" && !isNaN(amt) && amt > 0 ? sum + amt : sum;
  }, 0);

  const netChange = totalIncome - totalExpense;

  // Inspect each draft for missing or boundary issues
  const draftValidationIssues: Array<{
    index: number;
    title: string;
    missingFields: string[];
  }> = [];

  for (let i = 0; i < activeDrafts.length; i++) {
    const d = activeDrafts[i];
    const missing: string[] = [];
    const trimmedTitle = d.title.trim();
    const numAmount = Number(d.amount);

    if (!trimmedTitle) {
      missing.push("Title");
    } else if (trimmedTitle.length < 3) {
      missing.push("Title (min 3 chars)");
    }

    if (!d.amount.trim() || isNaN(numAmount) || numAmount <= 0) {
      missing.push("Amount");
    } else if (numAmount > MAX_TRANSACTION_AMOUNT) {
      missing.push("Amount (max ₹10,00,000)");
    }

    if (!d.type) {
      missing.push("Type");
    }

    if (!d.category.trim() || d.category.trim().length < 2) {
      missing.push("Category");
    }

    if (d.date && isNaN(new Date(`${d.date}T00:00:00`).getTime())) {
      missing.push("Date (invalid)");
    }

    if (missing.length > 0) {
      draftValidationIssues.push({
        index: i + 1,
        title: trimmedTitle || `Transaction #${i + 1}`,
        missingFields: missing,
      });
    }
  }

  const hasAnyMissingDetails = draftValidationIssues.length > 0;

  // Explicit user confirmation save action
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous lock check to prevent concurrent duplicate submissions
    if (isSubmittingRef.current || isSaving) {
      return;
    }

    if (activeDrafts.length === 0) {
      toast.error("No transactions to save.");
      return;
    }

    if (hasAnyMissingDetails) {
      const firstIssue = draftValidationIssues[0];
      toast.error(
        `Please complete Transaction #${firstIssue.index}: ${firstIssue.missingFields.join(", ")}`
      );
      return;
    }

    const now = getCurrentTimestamp();
    const validatedPayloads: TransactionOutput[] = [];

    for (let i = 0; i < activeDrafts.length; i++) {
      const d = activeDrafts[i];
      const trimmedTitle = d.title.trim();
      const numAmount = Number(d.amount);
      const dateObj = d.date ? new Date(`${d.date}T00:00:00`) : new Date();

      if (dateObj.getTime() > now + 60_000) {
        toast.error(`Transaction #${i + 1} date cannot be in the future.`);
        return;
      }

      const payload: TransactionOutput = {
        title: trimmedTitle,
        amount: numAmount,
        type: d.type as "INCOME" | "EXPENSE",
        category: d.category.trim(),
        date: dateObj,
        description: d.description.trim() || undefined,
      };

      const validation = transactionSchema.safeParse(payload);
      if (!validation.success) {
        toast.error(
          `Transaction #${i + 1} validation failed: ${
            validation.error.issues[0]?.message ?? "Invalid details."
          }`
        );
        return;
      }

      validatedPayloads.push(payload);
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {
      // Atomic multi-transaction save strategy
      const result = await createManyTransactions(validatedPayloads);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onSaveSuccess();
    } catch (error) {
      console.error("Quick Add Multi-Save Error:", error);
      toast.error("Something went wrong while saving transactions. Please try again.");
    } finally {
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <div
      role="region"
      aria-label="Transaction Review"
      className="mt-4 sm:mt-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 transition duration-200 dark:border-slate-800 dark:bg-slate-900/60 sm:p-5"
    >
      {/* 1. Header & Financial Summary Preview Bar */}
      <div className="mb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              Review Transactions
            </h3>
            <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {activeDrafts.length} {activeDrafts.length === 1 ? "draft" : "drafts"}
            </span>
          </div>

          {/* Dynamic Financial Totals Preview */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {totalIncome > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60">
                <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                Income: +₹{totalIncome.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            )}
            {totalExpense > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 font-semibold text-red-700 border border-red-200/70 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60">
                <TrendingDown className="size-3 text-red-500 shrink-0" />
                Expense: -₹{totalExpense.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            )}
            {activeDrafts.length > 0 && (
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold border ${
                  netChange >= 0
                    ? "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                    : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60"
                }`}
              >
                Net: {netChange >= 0 ? "+" : "-"}₹{Math.abs(netChange).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
        </div>

        {/* Status / Missing Details Banner */}
        <div className="mt-3">
          {hasAnyMissingDetails ? (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Review required before saving</p>
                <ul className="mt-1 space-y-0.5 text-[11px] text-amber-800/90 dark:text-amber-300/90">
                  {draftValidationIssues.map((issue) => (
                    <li key={issue.index}>
                      <span className="font-semibold">#{issue.index}:</span> Missing or invalid{" "}
                      <span className="underline">{issue.missingFields.join(", ")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div
              role="status"
              className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 text-xs text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  All {activeDrafts.length} transaction{activeDrafts.length > 1 ? "s" : ""} verified
                </p>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                  Ready to save. Review individual items or make adjustments below.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Separate Transaction Cards List */}
      <form onSubmit={handleSaveAll} className="space-y-4">
        <div className="space-y-4">
          {activeDrafts.map((item, index) => {
            const trimmedTitle = item.title.trim();
            const numAmount = Number(item.amount);

            // Determine allowed category options based strictly on active transaction type
            const canonicalCategories = Array.from(
              new Set(
                item.type === "INCOME"
                  ? Object.values(INCOME_CATEGORIES)
                  : Object.values(EXPENSE_CATEGORIES)
              )
            );

            const categoryOptions: Array<{ label: string; value: string }> =
              canonicalCategories.map((cat) => ({
                label: cat,
                value: cat,
              }));

            // Preserve historical/legacy category if valid for active type
            if (
              item.category &&
              !(canonicalCategories as string[]).includes(item.category) &&
              isCategoryAllowedForType(
                item.category,
                (item.type || "EXPENSE") as TransactionType
              )
            ) {
              categoryOptions.unshift({
                label: item.category,
                value: item.category,
              });
            }

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition dark:border-slate-800 dark:bg-slate-900 sm:p-4"
              >
                {/* Card Top Row: Badge & Remove action */}
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {index + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                        item.type === "INCOME"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : item.type === "EXPENSE"
                          ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.type === "INCOME" ? (
                        <>
                          <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
                          Income
                        </>
                      ) : item.type === "EXPENSE" ? (
                        <>
                          <TrendingDown className="size-3 text-red-500" />
                          Expense
                        </>
                      ) : (
                        "Unselected"
                      )}
                    </span>
                    {item.reasoning && (
                      <span className="hidden sm:inline-block text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                        {item.reasoning}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onOpenInDialog && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenInDialog(item)}
                        className="h-8 px-2 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        title="Open in full dialog"
                      >
                        <ExternalLink className="size-3.5" />
                        <span className="hidden sm:inline">Dialog</span>
                      </Button>
                    )}

                    {onRemoveDraft && activeDrafts.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveDraft(item.id!)}
                        className="h-8 px-2 text-[11px] text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40"
                        title="Remove this transaction draft"
                        aria-label={`Remove transaction ${index + 1}`}
                      >
                        <Trash2 className="size-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Form fields for this draft */}
                <div className="space-y-3">
                  {/* Row 1: Title & Amount */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label
                        htmlFor={`review-title-${item.id}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id={`review-title-${item.id}`}
                        value={item.title}
                        onChange={(e) =>
                          handleItemChange(item.id!, { title: e.target.value })
                        }
                        placeholder="e.g. Lunch, Groceries, Salary"
                        className={`h-11 sm:h-10 w-full min-w-0 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 ${
                          !trimmedTitle || trimmedTitle.length < 3
                            ? "border-amber-400 focus-visible:ring-amber-400/30 dark:border-amber-600"
                            : ""
                        }`}
                      />
                      {trimmedTitle.length > 0 && trimmedTitle.length < 3 && (
                        <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                          Title must be at least 3 characters.
                        </p>
                      )}
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor={`review-amount-${item.id}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Amount (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-slate-500">
                          ₹
                        </span>
                        <Input
                          id={`review-amount-${item.id}`}
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={MAX_TRANSACTION_AMOUNT}
                          value={item.amount}
                          onChange={(e) =>
                            handleItemChange(item.id!, { amount: e.target.value })
                          }
                          placeholder="0.00"
                          className={`h-11 sm:h-10 w-full min-w-0 rounded-xl bg-slate-50/50 pl-7 dark:bg-slate-950/50 ${
                            !item.amount.trim() ||
                            isNaN(numAmount) ||
                            numAmount <= 0 ||
                            numAmount > MAX_TRANSACTION_AMOUNT
                              ? "border-amber-400 focus-visible:ring-amber-400/30 dark:border-amber-600"
                              : ""
                          }`}
                        />
                      </div>
                      {numAmount > MAX_TRANSACTION_AMOUNT && (
                        <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400">
                          A transaction cannot exceed ₹10,00,000.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Type Toggle & Category */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <span className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Type <span className="text-red-500">*</span>
                      </span>
                      <div
                        role="radiogroup"
                        aria-label="Transaction Type"
                        className="flex h-11 gap-2"
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={item.type === "EXPENSE"}
                          onClick={() => handleItemTypeChange(item, "EXPENSE")}
                          className={`flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                            item.type === "EXPENSE"
                              ? "border-red-300 bg-red-50 text-red-700 shadow-2xs dark:border-red-900 dark:bg-red-950/60 dark:text-red-300"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                          }`}
                        >
                          <TrendingDown className="size-3.5 shrink-0 text-red-500" />
                          <span>Expense</span>
                        </button>

                        <button
                          type="button"
                          role="radio"
                          aria-checked={item.type === "INCOME"}
                          onClick={() => handleItemTypeChange(item, "INCOME")}
                          className={`flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                            item.type === "INCOME"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-2xs dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                          }`}
                        >
                          <TrendingUp className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span>Income</span>
                        </button>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor={`review-category-${item.id}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        items={categoryOptions}
                        value={item.category || null}
                        onValueChange={(val) =>
                          handleItemChange(item.id!, { category: val ?? "" })
                        }
                      >
                        <SelectTrigger
                          id={`review-category-${item.id}`}
                          className={`h-11 w-full min-w-0 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 ${
                            !item.category
                              ? "border-amber-400 focus-visible:ring-amber-400/30 dark:border-amber-600"
                              : ""
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <Tag className="size-3.5 shrink-0 text-slate-400" />
                            <span className="min-w-0 truncate">
                              <SelectValue placeholder="Select a category" />
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent align="start" side="bottom" sideOffset={4}>
                          <SelectGroup>
                            <SelectLabel>
                              {item.type === "INCOME"
                                ? "Income Categories"
                                : "Expense Categories"}
                            </SelectLabel>
                            {categoryOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 3: Date & Note */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label
                        htmlFor={`review-date-${item.id}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Date
                      </label>
                      <Input
                        id={`review-date-${item.id}`}
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={item.date}
                        onChange={(e) =>
                          handleItemChange(item.id!, { date: e.target.value })
                        }
                        className="h-11 sm:h-10 w-full min-w-0 rounded-xl bg-slate-50/50 dark:bg-slate-950/50"
                      />
                    </div>

                    <div className="min-w-0">
                      <label
                        htmlFor={`review-desc-${item.id}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        Note / Description
                      </label>
                      <Input
                        id={`review-desc-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(item.id!, { description: e.target.value })
                        }
                        placeholder="Context or note..."
                        className="h-11 sm:h-10 w-full min-w-0 rounded-xl bg-slate-50/50 dark:bg-slate-950/50"
                      />
                      {item.rawInput && item.rawInput.trim() !== item.description.trim() && (
                        <p
                          className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 truncate"
                          title={`Original input: ${item.rawInput}`}
                        >
                          Original: &ldquo;{item.rawInput}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Another Transaction Button */}
        {onAddDraft && (
          <div className="flex justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddDraft}
              className="gap-1.5 rounded-xl border-dashed border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Plus className="size-3.5" />
              Add Another Transaction
            </Button>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="mt-4 flex flex-col-reverse gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              className="h-10 sm:h-11 flex-1 sm:flex-initial gap-1.5 rounded-xl text-xs sm:text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <RotateCcw className="size-3.5" />
              Discard All
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 w-full sm:w-auto gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Sparkles className="size-4 shrink-0" />
            {isSaving
              ? "Saving..."
              : activeDrafts.length > 1
              ? `Save All ${activeDrafts.length} Transactions`
              : "Save Transaction"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default QuickAddReview;
