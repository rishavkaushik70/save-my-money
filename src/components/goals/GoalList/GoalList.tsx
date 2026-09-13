import { Goal } from "@/generated/prisma/client";
import GoalCard from "../GoalCard/GoalCard";
import EmptyGoalCard from "../GoalCard/EmptyGoalCard";

interface GoalListProps {
  goals: Goal[];
}

const GoalList = ({ goals }: GoalListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}

      {/* create new goal */}

      <EmptyGoalCard />
    </div>
  );
};

export default GoalList;
