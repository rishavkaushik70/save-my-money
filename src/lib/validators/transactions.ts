import { z } from "zod";
import { TRANSACTION_TYPES } from "../constants/transaction";
export const transactionSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  type: z.enum(TRANSACTION_TYPES),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  category: z.string().trim().min(2, "Category must be at least 2 characters"),
  date: z.coerce.date().max(new Date(), {
    message: "Transaction date cannot be in the future",
  }),
  description: z.string().trim().optional(),
});

export type TransactionInput = z.input<typeof transactionSchema>;
export type TransactionOutput = z.output<typeof transactionSchema>;
