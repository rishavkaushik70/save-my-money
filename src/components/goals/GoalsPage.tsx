import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import EmptyState from "./EmptyState/EmptyState";
import GoalList from "./GoalList/GoalList";
import { getGoalsPageData } from "@/actions/goalsPage";

const GoalsPage = async () => {
  const { allGoals } = await getGoalsPageData();

  return (
    <div className="w-full bg-gray-100 md:px-10 md:pt-10 flex flex-col gap-6 md:pb-1 min-h-[calc(100vh-68px)] p-2 border relative">
      {allGoals.length < 0 ? <EmptyState /> : <GoalList goals={allGoals} />}
    </div>
  );
};

export default GoalsPage;
