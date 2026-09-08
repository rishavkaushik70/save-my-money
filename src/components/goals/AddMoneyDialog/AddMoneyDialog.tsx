"use client";
import { addMoneyToGoal } from "@/actions/goals";
import { toast } from "sonner";
import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AddMoneyDialogProps = {
  goalId: string;
  goalTitle: string;
  currentAmount: number;
  targetAmount: number;
};

const AddMoneyDialog = ({
  goalId,
  goalTitle,
  currentAmount,
  targetAmount,
}: AddMoneyDialogProps) => {
  const [amount, setAmount] = useState("");

  const remainingAmount = targetAmount - currentAmount;

  const handleAddMoney = async () => {
    const money = Number(amount);

    if (!money || money <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }

    const result = await addMoneyToGoal(goalId, money);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setAmount("");
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={
              "hover:bg-primary hover:text-white transition-all mt-auto"
            }
          >
            <Plus className="size-4" />
            Add Money
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Money</DialogTitle>

          <DialogDescription>
            Add money to your <strong>{goalTitle}</strong> goal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Goal Summary */}
          <div className="rounded-lg bg-gray-50 border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current</span>

              <span className="font-semibold">
                ₹{currentAmount.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Remaining</span>

              <span className="font-semibold">
                ₹{remainingAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <Input
                id="amount"
                type="number"
                min="1"
                max={remainingAmount}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>

            <p className="text-xs text-gray-500">
              You can add up to ₹{remainingAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />

          <Button
            onClick={handleAddMoney}
            disabled={!amount || Number(amount) <= 0}
          >
            Add Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyDialog;
