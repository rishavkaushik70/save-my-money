"use server";

import {
  getAllTransactions,
  getTotalIncome,
  getTotalExpense,
} from "./transactions";

export async function getTransactionPageData() {
  const [allTransactions, totalIncome, totalExpense] = await Promise.all([
    getAllTransactions(),
    getTotalIncome(),
    getTotalExpense(),
  ]);

  return {
    allTransactions,
    totalTransactions: allTransactions.length,
    totalIncome,
    totalExpense,
  };
}
