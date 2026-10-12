import { Plus, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState/EmptyState";
import GoalList from "./GoalList/GoalList";
import { getGoalsPageData } from "@/actions/goalsPage";
import { AddGoalDialog } from "./GoalsDialogbox/Dialogbox";

const GoalsPage = async () => {
  const { allGoals, hasGoals } = await getGoalsPageData();

  return (
    <div className="min-h-[calc(100vh-68px)] w-full min-w-0 space-y-6 bg-slate-50 px-4 pb-8 pt-5 sm:px-6 sm:pt-6 lg:px-8 2xl:px-10">
      <header className="flex min-w-0 flex-col gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/70 p-5 shadow-[0_16px_45px_-34px_rgba(15,23,42,0.4)] sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-800">
            <Sparkles className="size-3.5" aria-hidden="true" /> Your financial plan
          </p>
          <h1 className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Goals that move you forward
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Keep your savings targets in view and celebrate every step closer.
          </p>
        </div>
        {hasGoals && (
          <AddGoalDialog>
            <Button className="h-11 w-full shrink-0 gap-2 rounded-2xl px-5 shadow-sm sm:w-auto">
              <Plus className="size-4" aria-hidden="true" /> Add a goal
            </Button>
          </AddGoalDialog>
        )}
      </header>

      {!hasGoals ? <EmptyState /> : <GoalList goals={allGoals} />}
    </div>
  );
};

export default GoalsPage;

