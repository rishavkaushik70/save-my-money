"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { parseQuickAddInput } from "@/lib/quick-add-parser";
import { formatDateForInput } from "@/components/transactions/AddTransactionDialog/add-transaction-form";
import { TransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";
import type { TransactionFormData } from "@/components/transactions/AddTransactionDialog/add-transaction-form";
import { Button } from "@/components/ui/button";
import { MicButton } from "./MicButton";
import { QuickAddReview, QuickAddReviewDraft } from "./QuickAddReview";

const QUICK_EXAMPLES = [
  "Spent ₹250 on lunch",
  "Bought groceries for ₹800",
  "Received salary ₹25,000",
  "Petrol bharwaya ₹500",
  "Electricity bill ₹1,200",
];

export function QuickAddCard() {
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<QuickAddReviewDraft | null>(null);

  // Dialog handoff state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTransaction, setDialogTransaction] =
    useState<TransactionFormData | null>(null);

  const handleParse = (overrideText?: string) => {
    const rawText = (overrideText ?? input).trim();
    if (!rawText) {
      toast.error("Please enter a transaction to parse.");
      return;
    }

    // Call deterministic parser - purely client-side draft extraction
    const parsed = parseQuickAddInput(rawText);

    const newDraft: QuickAddReviewDraft = {
      title: parsed.title ?? "",
      amount: parsed.amount !== null ? String(parsed.amount) : "",
      type: parsed.type ?? "",
      category: parsed.category ?? "",
      date: formatDateForInput(parsed.date ?? new Date()),
      description: parsed.description,
      needsReview: parsed.needsReview,
    };

    setDraft(newDraft);

    if (newDraft.needsReview) {
      toast.info("Transaction parsed", {
        description: "A couple of details need your review below.",
      });
    } else {
      toast.success("Transaction recognized", {
        description: "Details extracted successfully. Review and save below.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME-safe Enter submission
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleParse();
    }
  };

  const handleSelectExample = (example: string) => {
    setInput(example);
    handleParse(example);
  };

  const handleDraftChange = (updated: Partial<QuickAddReviewDraft>) => {
    setDraft((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const handleSaveSuccess = () => {
    setDraft(null);
    setInput("");
  };

  const handleClear = () => {
    setDraft(null);
  };

  const handleOpenInDialog = () => {
    if (!draft) return;

    const numAmount = Number(draft.amount) || 0;
    const dateObj = draft.date
      ? new Date(`${draft.date}T00:00:00`)
      : new Date();

    setDialogTransaction({
      title: draft.title,
      amount: numAmount,
      type: (draft.type || "EXPENSE") as "INCOME" | "EXPENSE",
      category: draft.category,
      date: dateObj,
      description: draft.description,
    });
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // If dialog completed or closed, reset form if transaction was saved
      // Keep draft safe if user just cancelled
    }
  };

  return (
    <>
      <section
        aria-label="Quick Add Transaction"
        className="relative isolate min-w-0 overflow-hidden rounded-[26px] border border-emerald-100/90 bg-gradient-to-br from-white via-white to-emerald-50/40 p-3.5 shadow-sm transition hover:shadow-md dark:border-emerald-950/60 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 sm:p-6 lg:p-7"
      >
        {/* Soft background glow */}
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-900/15"
          aria-hidden="true"
        />

        {/* Header / Eyebrow */}
        <div className="relative flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300">
              <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              AI Quick Add
            </span>
          </div>

          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Powered by smart parser AI
          </span>
        </div>

        {/* Headline & Helper text */}
        <div className="relative mt-3">
          <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
            What did you spend or earn?
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Describe your transaction in your own words. English and Hinglish supported.
          </p>
        </div>

        {/* Input & Action Bar */}
        <div className="relative mt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleParse();
            }}
            className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
          >
            {/* Main Natural Language Input Field */}
            <div className="relative min-w-0 flex-1">
              <label htmlFor="quick-add-input" className="sr-only">
                Describe your transaction in plain English or Hinglish
              </label>

              <div className="relative flex items-center">
                <input
                  id="quick-add-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Try: Paid ₹500 for petrol today..."
                  className="h-11 sm:h-12 w-full min-w-0 rounded-2xl border border-slate-200/90 bg-white/95 px-3.5 sm:px-4 pr-10 text-sm font-medium text-slate-900 shadow-xs transition placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900/90 dark:text-white dark:placeholder:text-slate-500 sm:text-base"
                />

                {input && (
                  <button
                    type="button"
                    onClick={() => {
                      setInput("");
                      setDraft(null);
                    }}
                    aria-label="Clear input"
                    className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Microphone button & Action button */}
            <div className="flex w-full items-center gap-2 sm:w-auto shrink-0">
              <MicButton />

              <Button
                type="submit"
                className="h-11 sm:h-12 flex-1 sm:flex-initial gap-2 rounded-2xl bg-emerald-700 px-4 sm:px-5 font-semibold text-white shadow-sm hover:bg-emerald-800 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                <Sparkles className="size-4 shrink-0" />
                <span className="text-xs sm:text-sm">Parse Transaction</span>
              </Button>
            </div>
          </form>

          {/* Quick Suggestion Chips */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              Suggestions:
            </span>
            {QUICK_EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleSelectExample(example)}
                className="min-h-[30px] sm:min-h-7 rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-slate-600 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Compact, Polished Editable Review Area */}
        {draft && (
          <QuickAddReview
            draft={draft}
            onChange={handleDraftChange}
            onSaveSuccess={handleSaveSuccess}
            onClear={handleClear}
            onOpenInDialog={handleOpenInDialog}
          />
        )}
      </section>

      {/* Controlled Handoff TransactionDialog */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSuccess={() => {
          setDraft(null);
          setInput("");
        }}
        transaction={dialogTransaction}
      />
    </>
  );
}

export default QuickAddCard;
