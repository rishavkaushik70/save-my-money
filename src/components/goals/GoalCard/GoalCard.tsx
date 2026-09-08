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
import { FaFirstAid } from "react-icons/fa";
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

  const handleDelete = async () => {
    const result = await deleteGoal(goal.id);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  };
  return (
    <div className="bg-white rounded-md p-5 flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 min-w-0">
          <span
            className={`rounded-md flex justify-center items-center shrink-0 size-25 ${
              category?.bgColor ?? "bg-gray-100"
            }`}
          >
            <Icon
              className={`size-12 ${category?.iconColor ?? "text-gray-600"}`}
            />
          </span>

          <div className="min-w-0 pt-2">
            <h1
              className="font-bold text-2xl truncate"
              title={goal.title ?? ""}
            >
              {goal.title}
            </h1>

            <p
              className="text-gray-500 text-sm truncate hover:text"
              title={goal.description ?? ""}
            >
              {goal.description}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="size-8">
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
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-start">
          <span className="text-primary text-2xl font-semibold">
            {" "}
            {goal.currentAmount}{" "}
          </span>{" "}
          <span className="text-gray-500 font-semibold">
            / {goal.targetAmount}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-[90%] bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-2.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold flex items-center gap-1">
          ₹{remainingAmount.toLocaleString("en-IN")}
          <span className="text-gray-500 text-sm">remaining</span>
        </span>
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="size-4 text-gray-800" />
          <span>
            Due:{" "}
            {goal.deadline
              ? goal.deadline.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "No deadline"}
          </span>
        </div>
      </div>
      {isCompleted ? (
        <div className="w-full rounded-md bg-primary/10 border border-primary/20 py-3 text-center">
          <p className="font-semibold text-primary">🥳 Goal Completed!</p>
          <p className="text-sm text-gray-500">
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
