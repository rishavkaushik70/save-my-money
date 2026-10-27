"use client";

import React, { useState, useRef } from "react";
import {
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Tag,
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
import { createTransaction } from "@/actions/transactions";
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

export type QuickAddReviewDraft = {
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE" | "";
  category: string;
  date: string;
  description: string;
  needsReview: boolean;
};

interface QuickAddReviewProps {
  draft: QuickAddReviewDraft;
  onChange: (updated: Partial<QuickAddReviewDraft>) => void;
  onSaveSuccess: () => void;
  onClear: () => void;
  onOpenInDialog: () => void;
}

export function QuickAddReview({
  draft,
  onChange,
  onSaveSuccess,
  onClear,
  onOpenInDialog,
}: QuickAddReviewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const isSubmittingRef = useRef(false);

  // Type change handler: resets category if incompatible with new type
  const handleTypeChange = (newType: "INCOME" | "EXPENSE") => {
    if (draft.type === newType) return;

    const isCurrentCategoryAllowed = isCategoryAllowedForType(
      draft.category,
      newType,
    );

    onChange({
      type: newType,
      category: isCurrentCategoryAllowed ? draft.category : "",
    });
  };

  // Determine allowed category options based strictly on active transaction type
  const canonicalCategories = Array.from(
    new Set(
      draft.type === "INCOME"
        ? Object.values(INCOME_CATEGORIES)
        : Object.values(EXPENSE_CATEGORIES),
    ),
  );

  const categoryOptions: Array<{ label: string; value: string }> =
    canonicalCategories.map((cat) => ({
      label: cat,
      value: cat,
    }));

  // Preserve historical/legacy category if active for current type
  if (
    draft.category &&
    !(canonicalCategories as string[]).includes(draft.category) &&
    isCategoryAllowedForType(
      draft.category,
      (draft.type || "EXPENSE") as TransactionType,
    )
  ) {
    categoryOptions.unshift({
      label: draft.category,
      value: draft.category,
    });
  }

  // Missing and boundary field inspection strictly aligned with transactionSchema
  const trimmedTitle = draft.title.trim();
  const numAmount = Number(draft.amount);

  const missingFields: string[] = [];

  // Title validation: min 3 chars
  if (!trimmedTitle) {
    missingFields.push("Title");
  } else if (trimmedTitle.length < 3) {
    missingFields.push("Title (min 3 chars)");
  }

  // Amount validation: positive, <= MAX_TRANSACTION_AMOUNT
  if (!draft.amount.trim() || isNaN(numAmount) || numAmount <= 0) {
    missingFields.push("Amount");
  } else if (numAmount > MAX_TRANSACTION_AMOUNT) {
    missingFields.push("Amount (max ₹10,00,000)");
  }

  // Type validation
  if (!draft.type) {
    missingFields.push("Type");
  }

  // Category validation
  if (!draft.category.trim() || draft.category.trim().length < 2) {
    missingFields.push("Category");
  }

  const hasMissingDetails = missingFields.length > 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Synchronous lock check to prevent concurrent requests from double-clicks or rapid Enter key presses
    if (isSubmittingRef.current || isSaving) {
      return;
    }

    if (hasMissingDetails) {
      toast.error(`Please complete the following: ${missingFields.join(", ")}`);
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please provide an amount greater than 0.");
      return;
    }

    if (numAmount > MAX_TRANSACTION_AMOUNT) {
      toast.error("A transaction cannot exceed ₹10,00,000.");
      return;
    }

    if (trimmedTitle.length < 3) {
      toast.error("Title must be at least 3 characters.");
      return;
    }

    const dateObj = draft.date
      ? new Date(`${draft.date}T00:00:00`)
      : new Date();

    if (dateObj.getTime() > Date.now() + 60_000) {
      toast.error("Transaction date cannot be in the future.");
      return;
    }

    const payload: TransactionOutput = {
      title: trimmedTitle,
      amount: numAmount,
      type: draft.type as "INCOME" | "EXPENSE",
      category: draft.category.trim(),
      date: dateObj,
      description: draft.description.trim() || undefined,
    };

    const validation = transactionSchema.safeParse(payload);
    if (!validation.success) {
      toast.error(
        validation.error.issues[0]?.message ?? "Invalid transaction details.",
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsSaving(true);
    try {
      const result = await createTransaction(payload);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      onSaveSuccess();
    } catch (error) {
      console.error("Quick Add Save Error:", error);
      toast.error("Something went wrong while saving. Please try again.");
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
      {/* Review Status Banner */}
      <div className="mb-4">
        {hasMissingDetails ? (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2.5 text-xs text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">A couple of details need your review</p>
              <p className="mt-0.5 text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Missing or invalid: <span className="font-medium underline break-words">{missingFields.join(", ")}</span>. You can edit any field before saving.
              </p>
            </div>
          </div>
        ) : (
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-2.5 text-xs text-emerald-900 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-200"
          >
            <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">All details extracted</p>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                Ready to save. Review below or make adjustments.
              </p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Row 1: Title & Amount */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="review-title"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="review-title"
              value={draft.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g. Lunch, Groceries, Salary"
              className={`h-11 sm:h-10 w-full min-w-0 rounded-xl bg-white dark:bg-slate-900 ${
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
              htmlFor="review-amount"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 dark:text-slate-500">
                ₹
              </span>
              <Input
                id="review-amount"
                type="number"
                step="0.01"
                min="0.01"
                max={MAX_TRANSACTION_AMOUNT}
                value={draft.amount}
                onChange={(e) => onChange({ amount: e.target.value })}
                placeholder="0.00"
                className={`h-11 sm:h-10 w-full min-w-0 rounded-xl bg-white pl-7 dark:bg-slate-900 ${
                  !draft.amount.trim() || isNaN(numAmount) || numAmount <= 0 || numAmount > MAX_TRANSACTION_AMOUNT
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

        {/* Row 2: Type & Category */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Transaction Type Segmented Toggle */}
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
                aria-checked={draft.type === "EXPENSE"}
                onClick={() => handleTypeChange("EXPENSE")}
                className={`flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                  draft.type === "EXPENSE"
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
                aria-checked={draft.type === "INCOME"}
                onClick={() => handleTypeChange("INCOME")}
                className={`flex flex-1 min-w-0 items-center justify-center gap-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition ${
                  draft.type === "INCOME"
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-2xs dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                }`}
              >
                <TrendingUp className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Income</span>
              </button>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="min-w-0">
            <label
              htmlFor="review-category"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              items={categoryOptions}
              value={draft.category || null}
              onValueChange={(val) => onChange({ category: val ?? "" })}
            >
              <SelectTrigger
                id="review-category"
                className={`h-11 w-full min-w-0 rounded-xl bg-white dark:bg-slate-900 ${
                  !draft.category
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
                    {draft.type === "INCOME" ? "Income Categories" : "Expense Categories"}
                  </SelectLabel>
                  {categoryOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Date & Description */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="min-w-0">
            <label
              htmlFor="review-date"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Date
            </label>
            <div className="relative">
              <Input
                id="review-date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={draft.date}
                onChange={(e) => onChange({ date: e.target.value })}
                className="h-11 sm:h-10 w-full min-w-0 rounded-xl bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <div className="min-w-0">
            <label
              htmlFor="review-description"
              className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Original Note / Description
            </label>
            <Input
              id="review-description"
              value={draft.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Original natural language input..."
              className="h-11 sm:h-10 w-full min-w-0 rounded-xl bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        {/* Actions bar */}
        <div className="mt-4 flex flex-col-reverse gap-2.5 pt-3 border-t border-slate-200/80 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={onClear}
              className="h-10 sm:h-11 flex-1 sm:flex-initial gap-1.5 rounded-xl text-xs sm:text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <RotateCcw className="size-3.5" />
              Discard
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onOpenInDialog}
              className="h-10 sm:h-11 flex-1 sm:flex-initial gap-1.5 rounded-xl border-slate-200 text-xs sm:text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ExternalLink className="size-3.5" />
              Open in full dialog
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 w-full sm:w-auto gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Sparkles className="size-4 shrink-0" />
            {isSaving ? "Saving..." : "Save Transaction"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default QuickAddReview;
