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
import { TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  TransactionInput,
  TransactionOutput,
  MAX_TRANSACTION_AMOUNT,
  transactionSchema,
} from "@/lib/validators/transactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRANSACTION_TYPES } from "@/lib/constants/transaction";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import { createTransaction, updateTransaction } from "@/actions/transactions";
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

export function formatDateForInput(date?: unknown): string {
  if (!date) return new Date().toISOString().split("T")[0];
  if (typeof date === "string" || typeof date === "number" || date instanceof Date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  }
  return new Date().toISOString().split("T")[0];
}

export type TransactionFormData = {
  id?: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: Date | string;
  description?: string | null;
};

type AddTransactionFormProps = {
  initialData?: TransactionFormData | null;
  onSuccess?: () => void;
};

const AddTransactionForm = ({ initialData, onSuccess }: AddTransactionFormProps) => {
  const isEdit = Boolean(initialData?.id);

  const form = useForm<TransactionInput, undefined, TransactionOutput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      amount: initialData?.amount ?? ("" as unknown as number),
      description: initialData?.description ?? "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      type: initialData?.type ?? TRANSACTION_TYPES.INCOME,
      category: initialData?.category ?? "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        amount: initialData.amount,
        description: initialData.description ?? "",
        date: initialData.date ? new Date(initialData.date) : new Date(),
        type: initialData.type,
        category: initialData.category,
      });
    } else {
      form.reset({
        title: "",
        amount: "" as unknown as number,
        description: "",
        date: new Date(),
        type: TRANSACTION_TYPES.INCOME,
        category: "",
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: TransactionOutput) => {
    const result = isEdit && initialData?.id
      ? await updateTransaction(initialData.id, data)
      : await createTransaction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    if (!isEdit) {
      form.reset();
    }
    onSuccess?.();
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Field>
          <Label htmlFor="title">Title</Label>
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
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            max={MAX_TRANSACTION_AMOUNT}
            step="0.01"
            inputMode="decimal"
            placeholder="0.00"
            aria-describedby="amount-limit"
            {...form.register("amount")}
          />
          <p id="amount-limit" className="text-xs text-muted-foreground">
            Maximum ₹10,00,000 per transaction.
          </p>
          {form.formState.errors.amount && (
            <p role="alert" className="text-sm text-red-500">
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
          <Label htmlFor="transaction-date">Date</Label>
          <Controller
            control={form.control}
            name="date"
            render={({ field }) => (
              <Input
                id="transaction-date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                value={formatDateForInput(field.value)}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val ? new Date(`${val}T00:00:00`) : new Date());
                }}
              />
            )}
          />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500">
              {form.formState.errors.date.message}
            </p>
          )}
        </Field>
        <Field>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
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
        <DialogClose
          render={
            <Button variant="outline" disabled={form.formState.isSubmitting}>
              Cancel
            </Button>
          }
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving..."
            : isEdit
            ? "Update Transaction"
            : "Save Transaction"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddTransactionForm;
