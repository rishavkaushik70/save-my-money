"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Goal } from "@/generated/prisma/client";
import { Calendar, EllipsisVertical } from "lucide-react";
import AddMoneyDialog from "../AddMoneyDialog/AddMoneyDialog";
import { GOAL_CATEGORIES } from "@/lib/constants/goals";
import { FaQuestion } from "react-icons/fa6";
import { deleteGoal } from "@/actions/goals";
import { toast } from "sonner";

interface GoalCardProps {
  goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const category = GOAL_CATEGORIES.find((item) => item.value === goal.category);
  const Icon = category?.icon ?? FaQuestion;

  const remainingAmount = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const progress = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100,
  );

  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;

  const handleDelete = async () => {
    const result = await deleteGoal(goal.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };

  return (
    <div className="bg-white rounded-md p-4 sm:p-5 flex flex-col gap-5 sm:gap-6 md:gap-8">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
          <span
            className={`rounded-md flex justify-center items-center shrink-0 size-14 sm:size-20 md:size-25 ${
              category?.bgColor ?? "bg-gray-100"
            }`}
          >
            <Icon
              className={`size-7 sm:size-10 md:size-12 ${category?.iconColor ?? "text-gray-600"}`}
            />
          </span>

          <div className="min-w-0 pt-0.5 sm:pt-2">
            <h2
              className="font-bold text-lg sm:text-2xl truncate"
              title={goal.title ?? ""}
            >
              {goal.title}
            </h2>

            <p
              className="text-gray-500 text-xs sm:text-sm truncate"
              title={goal.description ?? ""}
            >
              {goal.description}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-8 shrink-0">
                <EllipsisVertical />
              </Button>
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

      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-primary text-xl sm:text-2xl font-semibold">
            ₹{goal.currentAmount.toLocaleString("en-IN")}
          </span>
          <span className="text-gray-500 font-medium text-xs sm:text-sm">
            / ₹{goal.targetAmount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs sm:text-sm font-semibold shrink-0">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 sm:gap-0">
        <span className="font-bold flex items-center gap-1 text-sm sm:text-base">
          ₹{remainingAmount.toLocaleString("en-IN")}
          <span className="text-gray-500 text-xs sm:text-sm font-normal">
            remaining
          </span>
        </span>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
          <Calendar className="size-3.5 sm:size-4 text-gray-700 shrink-0" />
          <span>
            Due:{" "}
            {deadlineDate
              ? deadlineDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "No deadline"}
          </span>
        </div>
      </div>

      {isCompleted ? (
        <div className="w-full rounded-md bg-primary/10 border border-primary/20 py-2.5 px-3 text-center mt-auto">
          <p className="font-semibold text-primary text-sm sm:text-base">
            🥳 Goal Completed!
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            You made it happen. Keep going!
          </p>
        </div>
      ) : (
        <AddMoneyDialog
          goalId={goal.id}
          goalTitle={goal.title}
          currentAmount={goal.currentAmount}
          targetAmount={goal.targetAmount}
        />
      )}
    </div>
  );
};

export default GoalCard;
