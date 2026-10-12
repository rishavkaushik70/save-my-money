import { getGoalsPageData } from "@/actions/goalsPage";
import { getTransactionPageData } from "@/actions/transactionPage";
import ReportsPage from "@/components/reports/ReportsPage";

export default async function ReportsRoute() {
  const [{ allGoals }, { allTransactions }] = await Promise.all([
    getGoalsPageData(),
    getTransactionPageData(),
  ]);

  return (
    <ReportsPage
      asOf={new Date()}
      transactions={allTransactions.map(
        ({ id, title, category, type, amount, date }) => ({
          id,
          title,
          category,
          type,
          amount,
          date,
        }),
      )}
      goals={allGoals.map(({ id, title, targetAmount, currentAmount }) => ({
        id,
        title,
        targetAmount,
        currentAmount,
      }))}
    />
  );
}
