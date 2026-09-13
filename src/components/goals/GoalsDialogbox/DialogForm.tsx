"use client";
import { Field } from "@/components/ui/field";
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
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { GoalInput, goalSchema, GoalOutput } from "@/lib/validators/goals";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { createGoal } from "@/actions/goals";
import { GOAL_CATEGORIES } from "@/lib/constants/goals";

const items = GOAL_CATEGORIES;

const AddGoalForm = () => {
  const onSubmit = async (data: GoalOutput) => {
    const result = await createGoal(data);
    console.log(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    form.reset();
  };
  const form = useForm<GoalInput, undefined, GoalOutput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      targetAmount: "" as unknown as number,
      description: "",
      deadline: new Date(),
      category: "",
    },
  });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <Field>
          <Label>Goal Name</Label>
          <Input
            id="title"
            placeholder="e.g., Goa trip"
            {...form.register("title")}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">
              {form.formState.errors.title.message}
            </p>
          )}
        </Field>
        <Field>
          <Label>Target Amount</Label>
          <Input
            id="amount"
            placeholder="₹ 0.00"
            {...form.register("targetAmount")}
          />
          {form.formState.errors.targetAmount && (
            <p className="text-sm text-red-500">
              {form.formState.errors.targetAmount.message}
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
          <Label htmlFor="deadline">Target Date</Label>
          <Input
            id="deadline"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...form.register("deadline", {
              valueAsDate: true,
            })}
          />
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
            <Button
              variant="outline"
              disabled={form.formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          }
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full sm:w-auto"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save Goal"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddGoalForm;
