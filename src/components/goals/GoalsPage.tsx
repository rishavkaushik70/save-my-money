import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState/EmptyState";
import GoalList from "./GoalList/GoalList";
import { getGoalsPageData } from "@/actions/goalsPage";
import { AddGoalDialog } from "./GoalsDialogbox/Dialogbox";

const GoalsPage = async () => {
  const { allGoals, hasGoals } = await getGoalsPageData();

  return (
    <div className="w-full bg-gray-100 px-4 py-6 md:px-10 md:pt-10 flex flex-col gap-6 md:pb-1 min-h-[calc(100vh-68px)] relative">
      {hasGoals && (
        <div className="flex items-center justify-between md:hidden">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Goals</h1>
            <p className="text-xs text-gray-500">Track and manage your savings targets</p>
          </div>
          <AddGoalDialog>
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" /> Add Goal
            </Button>
          </AddGoalDialog>
        </div>
      )}

      {!hasGoals ? <EmptyState /> : <GoalList goals={allGoals} />}
    </div>
  );
};

export default GoalsPage;

