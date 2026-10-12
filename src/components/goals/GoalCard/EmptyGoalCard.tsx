import { Plus } from "lucide-react";
import { AddGoalDialog } from "../GoalsDialogbox/Dialogbox";

const EmptyGoalCard = () => {
  return (
    <AddGoalDialog>
      <button
        type="button"
        className="group flex h-full min-h-[25rem] w-full flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-emerald-200 bg-white/70 p-6 text-center shadow-[0_12px_36px_-34px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50/60 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        <div className="flex size-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
          <Plus className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className="break-words text-lg font-bold text-slate-900 transition-colors sm:text-xl">
            Create New Goal
          </h2>
        </div>
        <p className="max-w-[240px] text-sm leading-6 text-slate-600">
          Set a new financial goal and start saving.
        </p>
        <span className="mt-1 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-emerald-800">
          <Plus className="size-4" aria-hidden="true" /> Create goal
        </span>
      </button>
    </AddGoalDialog>
  );
};

export default EmptyGoalCard;

