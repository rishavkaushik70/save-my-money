"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DialogForm from "./DialogForm";

type AddGoalDialogProps = {
  children: React.ReactElement;
};

export function AddGoalDialog({ children }: AddGoalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={"text-xl"}>Create New Goal</DialogTitle>
          <DialogDescription>
            Set a new financial goal for yourself
          </DialogDescription>
        </DialogHeader>
        <DialogForm />
      </DialogContent>
    </Dialog>
  );
}
