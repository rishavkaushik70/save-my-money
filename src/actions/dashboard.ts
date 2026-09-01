import {
  getExpensesByCategory,
  getMonthlySavings,
  getRecentTransactions,
  getTotalExpense,
  getTotalIncome,
  getAllTransactions,
} from "./transactions";

export async function getDashboardData() {
  const [
    transactions,
    totalIncome,
    totalExpense,
    expensesByCategory,
    totalSavings,
    allTransactions,
  ] = await Promise.all([
    getRecentTransactions(),
    getTotalIncome(),
    getTotalExpense(),
    getExpensesByCategory(),
    getMonthlySavings(),
    getAllTransactions(),
  ]);

  const hasTransaction = transactions.length > 0;

  return {
    transactions,
    hasTransaction,
    totalIncome,
    totalExpense,
    totalBalance: totalIncome - totalExpense,
    totalSavings,
    expensesByCategory,
    allTransactions,
  };
}
