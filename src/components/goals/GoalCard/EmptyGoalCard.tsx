import { Plus } from "lucide-react";
import { AddGoalDialog } from "../GoalsDialogbox/Dialogbox";

const EmptyGoalCard = () => {
  return (
    <AddGoalDialog>
      <button
        type="button"
        className="bg-white border-2 border-dashed border-gray-300 hover:border-primary/50 hover:bg-gray-50/50 transition-all rounded-md flex flex-col justify-center items-center gap-3 p-6 text-center cursor-pointer min-h-[220px] md:min-h-[280px] w-full group outline-none focus-visible:border-primary"
      >
        <div className="rounded-full p-3 border-2 border-gray-400/80 group-hover:border-primary/80 group-hover:text-primary flex justify-center items-center size-12 sm:size-14 text-gray-500 transition-colors">
          <Plus className="size-6" />
        </div>
        <div>
          <h2 className="font-bold text-gray-700 group-hover:text-gray-900 text-lg sm:text-xl transition-colors">
            Create New Goal
          </h2>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm max-w-[220px]">
          Set a new financial goal and start saving.
        </p>
        <span className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium shadow-xs group-hover:bg-primary/90 transition-colors">
          <Plus className="size-4" /> Create Goal
        </span>
      </button>
    </AddGoalDialog>
  );
};

export default EmptyGoalCard;

