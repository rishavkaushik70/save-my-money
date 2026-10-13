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
import AddTransactionForm, { TransactionFormData } from "./add-transaction-form";

export type TransactionDialogProps = {
  children?: React.ReactElement;
  transaction?: TransactionFormData | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function TransactionDialog({
  children,
  transaction,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: TransactionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;
  const isEdit = Boolean(transaction?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? <DialogTrigger render={children} /> : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEdit ? "Edit transaction" : "Add a transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your transaction details. Amounts are limited to ₹10,00,000 per transaction."
              : "Keep your income and expenses up to date. Amounts are limited to ₹10,00,000 per transaction."}
          </DialogDescription>
        </DialogHeader>
        <AddTransactionForm
          initialData={transaction}
          onSuccess={() => onOpenChange?.(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function AddTransactionDialog({
  children,
}: {
  children: React.ReactElement;
}) {
  return <TransactionDialog>{children}</TransactionDialog>;
}

export default TransactionDialog;
