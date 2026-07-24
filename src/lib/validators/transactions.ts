import { z } from "zod";
import { TransactionType } from "@/generated/prisma/client";

export const transactionSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  type: z.enum(TransactionType),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().trim().min(2, "Category must be at least 2 characters"),
  date: z.coerce.date(),
  description: z.string().trim().optional(),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;
