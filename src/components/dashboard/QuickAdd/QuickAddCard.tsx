"use client";

import React, { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createGeminiFallbackDraft } from "@/lib/gemini-quick-add";
import { formatDateForInput } from "@/components/transactions/AddTransactionDialog/add-transaction-form";
import { TransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";
import type { TransactionFormData } from "@/components/transactions/AddTransactionDialog/add-transaction-form";
import { Button } from "@/components/ui/button";
import { MicButton } from "./MicButton";
import { QuickAddReview, QuickAddReviewDraft } from "./QuickAddReview";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { SPEECH_LANGUAGES } from "./speech-recognition.types";

const QUICK_EXAMPLES = [
  "Spent ₹250 on lunch",
  "Aaj 200 kamaya aur 300 kharch ho gaye.",
  "Bought groceries 500, paid electricity 1200, and earned 3000 from client",
  "Received salary ₹25,000",
  "Petrol bharwaya ₹500",
];

export function QuickAddCard() {
  const [input, setInput] = useState("");
  const [drafts, setDrafts] = useState<QuickAddReviewDraft[]>([]);

  // Dialog handoff state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTransaction, setDialogTransaction] =
    useState<TransactionFormData | null>(null);

  // Native browser speech recognition hook
  const {
    state: speechState,
    isListening,
    language: speechLanguage,
    setLanguage: setSpeechLanguage,
    toggleListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscript: (recognizedText) => {
      // Append or populate recognized text without deleting existing manual entry
      setInput(recognizedText);
    },
  });

  const currentLanguageObj =
    SPEECH_LANGUAGES.find((lang) => lang.code === speechLanguage) ||
    SPEECH_LANGUAGES[0];

  const [isParsing, setIsParsing] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleParse = async (overrideText?: string) => {
    const rawText = (overrideText ?? input).trim();
    if (!rawText) {
      toast.error("Please enter a transaction to parse.");
      return;
    }

    // Cancel any previous in-flight parse request cleanly
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsParsing(true);

    try {
      const response = await fetch("/api/quick-add/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: rawText,
          clientDate: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (response.ok && data.success && Array.isArray(data.transactions) && data.transactions.length > 0) {
        const newDrafts: QuickAddReviewDraft[] = data.transactions.map(
          (t: {
            title?: string | null;
            amount?: number | null;
            type?: string | null;
            category?: string | null;
            date?: string | null;
            description?: string;
            rawInput?: string;
            needsReview?: boolean;
            reasoning?: string;
          }, idx: number) => ({
            id: `draft-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            title: t.title ?? "",
            amount: t.amount !== null && t.amount !== undefined ? String(t.amount) : "",
            type: (t.type as "INCOME" | "EXPENSE") || "",
            category: t.category ?? "",
            date: t.date ?? formatDateForInput(new Date()),
            description: t.description || rawText,
            rawInput: t.rawInput || rawText,
            needsReview: Boolean(t.needsReview),
            reasoning: t.reasoning,
          })
        );

        setDrafts(newDrafts);

        if (data.source === "gemini") {
          const anyNeedsReview = newDrafts.some((d) => d.needsReview);
          if (newDrafts.length > 1) {
            toast.success(`Gemini recognized ${newDrafts.length} transactions`, {
              description: anyNeedsReview
                ? "Multiple transactions detected. Some details need review below."
                : "All transactions extracted cleanly. Review and save below.",
            });
          } else {
            if (anyNeedsReview) {
              toast.info("Gemini parsed transaction", {
                description: "A couple of details need your review below.",
              });
            } else {
              toast.success("Gemini recognized transaction", {
                description: "Details extracted successfully. Review and save below.",
              });
            }
          }
        } else {
          toast.info("Parsed with local parser", {
            description: "Gemini was unavailable; details extracted locally for your review.",
          });
        }
      } else {
        // Fallback to local multi/single clause parser
        const fallbackResult = createGeminiFallbackDraft(rawText);
        const fallbackDrafts: QuickAddReviewDraft[] = fallbackResult.transactions.map(
          (t, idx) => ({
            id: `fallback-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
            title: t.title ?? "",
            amount: t.amount !== null && t.amount !== undefined ? String(t.amount) : "",
            type: (t.type as "INCOME" | "EXPENSE") || "",
            category: t.category ?? "",
            date: t.date ?? formatDateForInput(new Date()),
            description: t.description || rawText,
            rawInput: t.rawInput || rawText,
            needsReview: Boolean(t.needsReview),
            reasoning: t.reasoning,
          })
        );

        setDrafts(fallbackDrafts);

        toast.info("Parsed with local parser", {
          description: "Review extracted details below before saving.",
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        // Clean cancellation; ignore
        return;
      }

      // Network failure fallback
      const fallbackResult = createGeminiFallbackDraft(rawText);
      const fallbackDrafts: QuickAddReviewDraft[] = fallbackResult.transactions.map(
        (t, idx) => ({
          id: `fallback-err-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
          title: t.title ?? "",
          amount: t.amount !== null && t.amount !== undefined ? String(t.amount) : "",
          type: (t.type as "INCOME" | "EXPENSE") || "",
          category: t.category ?? "",
          date: t.date ?? formatDateForInput(new Date()),
          description: t.description || rawText,
          rawInput: t.rawInput || rawText,
          needsReview: Boolean(t.needsReview),
          reasoning: t.reasoning,
        })
      );

      setDrafts(fallbackDrafts);

      toast.info("Parsed with local parser", {
        description: "Could not reach AI service; used local parser instead.",
      });
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setIsParsing(false);
      }
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

  const handleDraftChange = (id: string, updated: Partial<QuickAddReviewDraft>) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated } : d))
    );
  };

  const handleRemoveDraft = (id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (next.length === 0) {
        toast.info("All drafts removed.");
      }
      return next;
    });
  };

  const handleAddDraft = () => {
    const newBlank: QuickAddReviewDraft = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: "",
      amount: "",
      type: "EXPENSE",
      category: "",
      date: formatDateForInput(new Date()),
      description: "",
      needsReview: true,
    };
    setDrafts((prev) => [...prev, newBlank]);
  };

  const handleSaveSuccess = () => {
    setDrafts([]);
    setInput("");
  };

  const handleClear = () => {
    setDrafts([]);
  };

  const handleOpenInDialog = (targetDraft?: QuickAddReviewDraft) => {
    const d = targetDraft || drafts[0];
    if (!d) return;

    const numAmount = Number(d.amount) || 0;
    const dateObj = d.date
      ? new Date(`${d.date}T00:00:00`)
      : new Date();

    setDialogTransaction({
      title: d.title,
      amount: numAmount,
      type: (d.type || "EXPENSE") as "INCOME" | "EXPENSE",
      category: d.category,
      date: dateObj,
      description: d.description,
    });
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
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

          <div className="flex items-center gap-2">
            {/* Configurable Speech Language Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <label htmlFor="quick-add-speech-lang" className="sr-only">
                Speech recognition language
              </label>
              <span className="text-[11px] font-medium hidden sm:inline text-slate-500 dark:text-slate-400">
                Voice:
              </span>
              <select
                id="quick-add-speech-lang"
                value={speechLanguage}
                onChange={(e) => setSpeechLanguage(e.target.value)}
                disabled={isListening}
                aria-label="Speech recognition language"
                className="rounded-lg border border-slate-200/90 bg-white/80 py-0.5 px-2 text-[11px] font-semibold text-slate-700 shadow-2xs transition hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 cursor-pointer"
              >
                {SPEECH_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="hidden md:inline text-[11px] font-medium text-slate-400 dark:text-slate-500">
              •
            </span>
            <span className="hidden md:inline text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Powered by smart parser AI
            </span>
          </div>
        </div>

        {/* Headline & Helper text */}
        <div className="relative mt-3">
          <h2 className="text-base font-bold tracking-tight text-slate-950 dark:text-white sm:text-xl">
            What did you spend or earn?
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
            Describe your transaction in your own words or click the microphone to speak. English and Hinglish supported.
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
                      setDrafts([]);
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
              <MicButton
                state={speechState}
                isListening={isListening}
                disabled={isParsing}
                onClick={() => toggleListening(input)}
              />

              <Button
                type="submit"
                disabled={isParsing}
                className="h-11 sm:h-12 flex-1 sm:flex-initial gap-2 rounded-2xl bg-emerald-700 px-4 sm:px-5 font-semibold text-white shadow-sm hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-70 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                {isParsing ? (
                  <>
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                    <span className="text-xs sm:text-sm">Parsing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 shrink-0" />
                    <span className="text-xs sm:text-sm">Parse Transaction</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Active Voice Listening Status Banner */}
          {isListening && (
            <div
              role="status"
              aria-live="polite"
              className="mt-2.5 flex items-center justify-between gap-2 rounded-xl border border-red-200/90 bg-red-50/80 px-3 py-1.5 text-xs font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 animate-in fade-in slide-in-from-top-1"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="relative flex size-2 shrink-0">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                </span>
                <p className="truncate">
                  Listening in <span className="font-semibold">{currentLanguageObj.name}</span>... Speak now (e.g. &ldquo;Spent ₹250 on lunch&rdquo;)
                </p>
              </div>
              <button
                type="button"
                onClick={stopListening}
                className="shrink-0 rounded-md bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700 hover:bg-red-200 dark:bg-red-900/60 dark:text-red-300 dark:hover:bg-red-900"
              >
                Stop
              </button>
            </div>
          )}

          {speechState === "processing" && (
            <div
              role="status"
              aria-live="polite"
              className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3 py-1.5 text-xs font-medium text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 animate-in fade-in"
            >
              <Loader2 className="size-3.5 animate-spin shrink-0 text-emerald-600" />
              <span>Finalizing speech recognition...</span>
            </div>
          )}

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
        {drafts.length > 0 && (
          <QuickAddReview
            drafts={drafts}
            draft={drafts[0]}
            onDraftChange={handleDraftChange}
            onRemoveDraft={handleRemoveDraft}
            onAddDraft={handleAddDraft}
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
          setDrafts([]);
          setInput("");
        }}
        transaction={dialogTransaction}
      />
    </>
  );
}

export default QuickAddCard;
