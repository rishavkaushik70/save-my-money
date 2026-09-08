import { z } from "zod";
export const goalSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),

  targetAmount: z.coerce
    .number()
    .positive("Target amount must be greater than 0"),

  category: z.string().trim().min(2, "Category must be at least 2 characters"),

  deadline: z.coerce
    .date()
    .refine((date) => date > new Date(), "Deadline must be in the future")
    .optional(),

  description: z.string().trim().optional(),
});

export type GoalInput = z.input<typeof goalSchema>;
export type GoalOutput = z.output<typeof goalSchema>;
