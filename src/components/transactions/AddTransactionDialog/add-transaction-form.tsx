"use client";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  TransactionInput,
  TransactionOutput,
  transactionSchema,
} from "@/lib/validators/transactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRANSACTION_TYPES } from "@/lib/constants/transaction";
import { Controller } from "react-hook-form";
import { createTransaction } from "@/actions/transactions";
import { toast } from "sonner";

const items = [
  { label: "Entertainment", value: "Entertainment" },
  { label: "Shopping", value: "Shopping" },
  { label: "Personal", value: "Personal" },
  { label: "Groceries", value: "Groceries" },
  { label: "Utilities", value: "Utilities" },
  { label: "Transport", value: "Transport" },
  { label: "Food", value: "Food" },
];

const AddTransactionForm = () => {
  const onSubmit = async (data: TransactionOutput) => {
    const result = await createTransaction(data);
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    form.reset();
  };
  const form = useForm<TransactionInput, undefined, TransactionOutput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "" as unknown as number,
      description: "",
      date: new Date(),
      type: TRANSACTION_TYPES.INCOME,
      category: "",
    },
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Field>
          <Label>Title</Label>
          <Input
            id="title"
            placeholder="e.g. Salary, Grocery, Freelance Project"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </Field>
        <Field>
          <Label>Type</Label>

          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex"
              >
                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <TrendingUp className="text-primary size-5" />
                        Income
                      </FieldTitle>
                    </FieldContent>

                    <RadioGroupItem value="INCOME" />
                  </Field>
                </FieldLabel>

                <FieldLabel>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>
                        <TrendingDown className="text-red-500 size-5" />
                        Expense
                      </FieldTitle>
                    </FieldContent>

                    <RadioGroupItem value="EXPENSE" />
                  </Field>
                </FieldLabel>
              </RadioGroup>
            )}
          />

          {form.formState.errors.type && (
            <p className="text-sm text-red-500">
              {form.formState.errors.type.message}
            </p>
          )}
        </Field>
        <Field>
          <Label>Amount</Label>
          <Input
            id="amount"
            placeholder="₹ 0.00"
            {...form.register("amount")}
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500">
              {form.formState.errors.amount.message}
            </p>
          )}
        </Field>
        <Field>
          <Label>Category</Label>

          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select
                items={items}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>

                    {items.map((item) => (
                      <SelectItem key={item.value} value={item.value!}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {form.formState.errors.category && (
            <p className="text-sm text-red-500">
              {form.formState.errors.category.message}
            </p>
          )}
        </Field>
        <Field>
          <Label htmlFor="username-1">Date</Label>
          <Input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            {...form.register("date", {
              valueAsDate: true,
            })}
          />
        </Field>
        <Field>
          <Label htmlFor="username-1">Description (Optional)</Label>
          <Textarea
            placeholder="Add a short description (Optional)"
            className="resize-none"
            {...form.register("description")}
          ></Textarea>
          {form.formState.errors.description && (
            <p className="text-sm text-red-500">
              {form.formState.errors.description.message}
            </p>
          )}
        </Field>
      </div>
      <DialogFooter className="mt-5">
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button type="submit">Save Transaction</Button>
      </DialogFooter>
    </form>
  );
};

export default AddTransactionForm;
