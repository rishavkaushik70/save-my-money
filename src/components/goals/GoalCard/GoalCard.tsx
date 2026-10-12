"use client";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Goal } from "@/generated/prisma/client";
import {
  CalendarDays,
  Check,
  CheckCircle2,
  EllipsisVertical,
} from "lucide-react";
import AddMoneyDialog from "../AddMoneyDialog/AddMoneyDialog";
import { GOAL_CATEGORIES } from "@/lib/constants/goals";
import { FaQuestion } from "react-icons/fa6";
import { deleteGoal } from "@/actions/goals";
import { toast } from "sonner";
import { usePersonalSettings } from "@/components/settings/SettingsProvider";

interface GoalCardProps {
  goal: Goal;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const GoalCard = ({ goal }: GoalCardProps) => {
  const { settings } = usePersonalSettings();
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const category = GOAL_CATEGORIES.find((item) => item.value === goal.category);
  const Icon = category?.icon ?? FaQuestion;

  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const progress =
    goal.targetAmount > 0
      ? Math.max(0, Math.min((goal.currentAmount / goal.targetAmount) * 100, 100))
      : 0;

  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
  const daysUntilDeadline = deadlineDate && currentTime !== null
    ? Math.ceil((deadlineDate.getTime() - currentTime) / (24 * 60 * 60 * 1000))
    : null;
  const isDueSoon =
    settings.goalReminders &&
    !isCompleted &&
    daysUntilDeadline !== null &&
    daysUntilDeadline >= 0 &&
    daysUntilDeadline <= 7;

  useEffect(() => {
    const timeout = window.setTimeout(() => setCurrentTime(Date.now()), 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleDelete = async () => {
    const result = await deleteGoal(goal.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };

  return (
    <article className="summary-card group relative isolate flex h-full min-h-[25rem] min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/50 p-4 shadow-[0_16px_42px_-34px_rgba(15,23,42,0.42)] transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/[0.04] sm:size-14 ${category?.bgColor ?? "bg-slate-100"}`}
        >
          <Icon
            className={`size-6 sm:size-7 ${category?.iconColor ?? "text-slate-600"}`}
            aria-hidden="true"
          />
        </span>

        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`inline-flex min-h-7 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold ${
              isCompleted
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isCompleted && <Check className="size-3.5" aria-hidden="true" />}
            {isCompleted ? "Completed" : "In progress"}
          </span>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label={`Options for ${goal.title}`}
                className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <EllipsisVertical className="size-5" aria-hidden="true" />
              </button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">
          {category?.label ?? goal.category}
        </p>
        <h2 className="mt-1 break-words text-lg font-bold leading-snug tracking-tight text-slate-950 sm:text-xl">
          {goal.title}
        </h2>
        {goal.description && (
          <p className="mt-1.5 break-words text-sm leading-5 text-slate-600">
            {goal.description}
          </p>
        )}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/85 p-4">
        <div className="flex min-w-0 items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-500">Saved so far</p>
            <p className="mt-1 break-words text-xl font-bold leading-tight tracking-tight text-emerald-700 tabular-nums">
              {formatCurrency(goal.currentAmount)}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[11px] font-semibold text-slate-500">Target</p>
            <p className="mt-1 break-words text-sm font-bold text-slate-800 tabular-nums">
              {formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label={`${goal.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-200"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-400 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-bold tabular-nums text-slate-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
          <span className="font-medium text-slate-500">Goal progress</span>
          <span className="min-w-0 break-words text-right font-semibold text-slate-700">
            {formatCurrency(remainingAmount)} to go
          </span>
        </div>
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-600">
          <CalendarDays className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <span className="min-w-0 break-words">
            {deadlineDate
              ? `Due ${deadlineDate.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Kolkata",
                })}`
              : "No deadline"}
          </span>
        </div>
        {isCompleted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            <CheckCircle2 className="size-3.5" aria-hidden="true" /> Goal reached
          </span>
        )}
        {isDueSoon && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {daysUntilDeadline === 0
              ? "Due today"
              : `Due in ${daysUntilDeadline} ${daysUntilDeadline === 1 ? "day" : "days"}`}
          </span>
        )}
      </div>

      {isCompleted ? (
        <div className="mt-auto pt-5">
          <div className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-emerald-800">
            <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-bold">Goal completed</p>
              <p className="text-xs text-emerald-700">You made it happen.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-5">
          <AddMoneyDialog
            goalId={goal.id}
            goalTitle={goal.title}
            currentAmount={goal.currentAmount}
            targetAmount={goal.targetAmount}
          />
        </div>
      )}
    </article>
  );
};

export default GoalCard;
