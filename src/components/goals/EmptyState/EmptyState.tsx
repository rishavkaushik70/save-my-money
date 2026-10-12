import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { AddGoalDialog } from "../GoalsDialogbox/Dialogbox";

const EmptyState = () => {
  return (
    <div className="my-auto flex w-full flex-1 flex-col items-center justify-center gap-5 rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/60 px-4 py-10 text-center shadow-[0_16px_45px_-34px_rgba(15,23,42,0.4)] sm:px-6">
      <div className="w-full max-w-[240px] sm:max-w-[320px]">
        <Image
          src={"/goals.gif"}
          height={300}
          width={500}
          alt="Illustration of setting savings goals"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="max-w-lg space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">No goals yet</h2>
        <p className="text-sm leading-6 text-slate-600 sm:text-base">
          Create your first goal and start your journey towards financial freedom
        </p>
      </div>
      <AddGoalDialog>
        <Button size="lg" className="mt-1 h-11 gap-2 rounded-2xl px-5 shadow-sm">
          <Plus className="size-4" aria-hidden="true" /> Create your first goal
        </Button>
      </AddGoalDialog>
    </div>
  );
};

export default EmptyState;
