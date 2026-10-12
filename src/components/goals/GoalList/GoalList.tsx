import { Goal } from "@/generated/prisma/client";
import GoalCard from "../GoalCard/GoalCard";
import EmptyGoalCard from "../GoalCard/EmptyGoalCard";

interface GoalListProps {
  goals: Goal[];
}

const GoalList = ({ goals }: GoalListProps) => {
  return (
    <div className="grid min-w-0 grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}

      {/* create new goal */}

      <EmptyGoalCard />
    </div>
  );
};

export default GoalList;
