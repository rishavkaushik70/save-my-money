"use client";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Add a transaction
          </DialogTitle>
          <DialogDescription>
            Keep your income and expenses up to date. Amounts are limited to ₹10,00,000 per transaction.
          </DialogDescription>
        </DialogHeader>
        <AddTransactionForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
