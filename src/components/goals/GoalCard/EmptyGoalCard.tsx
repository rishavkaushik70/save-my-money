import { Plus } from "lucide-react";
import { AddGoalDialog } from "../GoalsDialogbox/Dialogbox";
import { Button } from "@/components/ui/button";

const EmptyGoalCard = () => {
  return (
    <div className="border-dotted border-3 rounded-md flex flex-col justify-center items-center gap-3 py-5">
      <div className="rounded-full px-2 py-2 border-2 border-gray-500 flex justify-center items-center size-15">
        <Plus className="text-gray-400" />
      </div>
      <div>
        <h1 className="font-bold text-gray-500 text-2xl">Create New Goal</h1>
      </div>
      <div className="text-gray-500 font-semibold w-50 text-center">
        Set a new financial goal and start saving.
      </div>
      <AddGoalDialog>
        <Button className={"float-end m-3"}>
          <Plus /> Create Goal
        </Button>
      </AddGoalDialog>
    </div>
  );
};

export default EmptyGoalCard;
