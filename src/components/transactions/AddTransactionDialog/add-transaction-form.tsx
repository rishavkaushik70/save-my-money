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
import {
  TRANSACTION_TYPES,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  isCategoryAllowedForType,
  TransactionType,
} from "@/lib/constants/transaction";
import { Controller } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { createTransaction, updateTransaction } from "@/actions/transactions";
import { toast } from "sonner";

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

  const currentType = form.watch("type") as TransactionType;
  const currentCategory = form.watch("category");

  const categoryOptions = useMemo(() => {
    const canonicalValues = Array.from(
      new Set(
        currentType === "INCOME"
          ? Object.values(INCOME_CATEGORIES)
          : Object.values(EXPENSE_CATEGORIES),
      ),
    );

    const options: Array<{ label: string; value: string }> =
      canonicalValues.map((cat) => ({
        label: cat,
        value: cat,
      }));

    // If initialData has a historical/legacy category, preserve it as an option while editing
    if (
      initialData?.category &&
      !(canonicalValues as string[]).includes(initialData.category) &&
      currentCategory === initialData.category
    ) {
      options.unshift({
        label: `${initialData.category} (Historical)`,
        value: initialData.category,
      });
    }

    return options;
  }, [currentType, initialData?.category, currentCategory]);

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
                onValueChange={(val) => {
                  field.onChange(val);
                  const activeCategory = form.getValues("category");
                  if (
                    activeCategory &&
                    !isCategoryAllowedForType(
                      activeCategory,
                      val as TransactionType,
                    )
                  ) {
                    form.setValue("category", "");
                  }
                }}
                className="grid grid-cols-2 gap-2.5"
              >
                <FieldLabel className="*:data-[slot=field]:p-2.5 sm:*:data-[slot=field]:p-3">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle className="text-xs sm:text-sm font-semibold">
                        <TrendingUp className="text-primary size-4 sm:size-5 shrink-0" />
                        Income
                      </FieldTitle>
                    </FieldContent>

                    <RadioGroupItem value="INCOME" />
                  </Field>
                </FieldLabel>

                <FieldLabel className="*:data-[slot=field]:p-2.5 sm:*:data-[slot=field]:p-3">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle className="text-xs sm:text-sm font-semibold">
                        <TrendingDown className="text-red-500 size-4 sm:size-5 shrink-0" />
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
            className="h-11 sm:h-10 rounded-xl"
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
          <Label htmlFor="transaction-category">Category</Label>

          <Controller
            control={form.control}
            name="category"
            render={({ field }) => (
              <Select
                items={categoryOptions}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="transaction-category" className="h-11 sm:h-10 w-full rounded-xl">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent align="start" side="bottom" sideOffset={4}>
                  <SelectGroup>
                    <SelectLabel>
                      {currentType === "INCOME" ? "Income Categories" : "Expense Categories"}
                    </SelectLabel>

                    {categoryOptions.map((item) => (
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
      <DialogFooter className="mt-5 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogClose
          render={
            <Button variant="outline" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
              Cancel
            </Button>
          }
        />

        <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
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
