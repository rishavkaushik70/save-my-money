import { ArrowUpRight, Check, Plus, ReceiptText, Target } from "lucide-react";
import Link from "next/link";

import { AddGoalDialog } from "@/components/goals/GoalsDialogbox/Dialogbox";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";
import { Button } from "@/components/ui/button";

type SetupCardProps = {
  hasTransaction: boolean;
  hasGoals: boolean;
};

const SetupCard = ({ hasTransaction, hasGoals }: SetupCardProps) => {
  const completedCount = Number(hasTransaction) + Number(hasGoals);

  return (
    <section className="flex h-full min-w-0 flex-col rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-sky-50/40 p-4 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.4)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">
            Your next steps
          </p>
          <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
            Build your money picture
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            A couple of details make your dashboard more useful.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
          {completedCount}/2
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col justify-evenly gap-2.5">
        <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <ReceiptText className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900">
                Track your transactions
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Add income or an expense to start.
              </p>
            </div>
          </div>
          {hasTransaction ? (
            <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-800">
              <Check className="size-3.5" aria-hidden="true" /> Added
            </span>
          ) : (
            <AddTransactionDialog>
              <Button size="sm" className="h-9 shrink-0 gap-1.5 rounded-xl px-3">
                <Plus className="size-3.5" /> Add now
              </Button>
            </AddTransactionDialog>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-800">
              <Target className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-slate-900">
                Set a money goal
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Turn a plan into a clear target.
              </p>
            </div>
          </div>
          {hasGoals ? (
            <Link
              href="/goals"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-violet-50 px-3 text-xs font-bold text-violet-800 transition hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600"
            >
              <Check className="size-3.5" aria-hidden="true" /> View goals
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          ) : (
            <AddGoalDialog>
              <Button
                size="sm"
                variant="outline"
                className="h-9 shrink-0 gap-1.5 rounded-xl border-violet-200 px-3 text-violet-800 hover:bg-violet-50"
              >
                <Plus className="size-3.5" /> Create goal
              </Button>
            </AddGoalDialog>
          )}
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-lime-400 transition-[width] duration-500"
          style={{ width: `${(completedCount / 2) * 100}%` }}
        />
      </div>
    </section>
  );
};

export default SetupCard;
