import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { AddGoalDialog } from "../GoalsDialogbox/Dialogbox";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 bg-white rounded-xl border border-gray-200 py-10 px-4 sm:px-6 text-center flex-1 w-full my-auto">
      <div className="max-w-[260px] sm:max-w-[380px] w-full">
        <Image
          src={"/goals.gif"}
          height={300}
          width={500}
          alt="Goals"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">No goals yet!</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Create your first goal and start your journey towards financial freedom
        </p>
      </div>
      <AddGoalDialog>
        <Button size="lg" className="gap-2 cursor-pointer shadow-xs mt-2">
          <Plus className="size-4" /> Create Your First Goal
        </Button>
      </AddGoalDialog>
    </div>
  );
};

export default EmptyState;
