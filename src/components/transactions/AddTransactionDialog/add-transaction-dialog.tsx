"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTransactionForm from "./add-transaction-form";

type AddTransactionDialogProps = {
  children: React.ReactElement;
};

export function AddTransactionDialog({ children }: AddTransactionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={"text-xl"}>
            Add Your First Transaction
          </DialogTitle>
          <DialogDescription>
            Track your income or expenses to take control of your finances.
          </DialogDescription>
        </DialogHeader>
        <AddTransactionForm />
      </DialogContent>
    </Dialog>
  );
}
