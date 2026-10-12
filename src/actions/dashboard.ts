"use server";
import {
  getExpensesByCategory,
  getMonthlySavings,
  getRecentTransactions,
  getTotalExpense,
  getTotalIncome,
} from "./transactions";

export async function getDashboardData() {
  const [
    transactions,
    totalIncome,
    totalExpense,
    expenseBreakdown,
    totalSavings,
  ] = await Promise.all([
    getRecentTransactions(),
    getTotalIncome(),
    getTotalExpense(),
    getExpensesByCategory("This month"),
    getMonthlySavings(),
  ]);

  const hasTransaction = transactions.length > 0;

  return {
    transactions,
    hasTransaction,
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
    totalSavings,
    expenseBreakdown,
  };
}
