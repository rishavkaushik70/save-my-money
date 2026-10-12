import { getDashboardData } from "@/actions/dashboard";
import type { User } from "@/types/auth";
import WelcomeCard from "./welcomeCard/WelcomeCard";
import SummaryCards from "./TransactionSummaryCard/SummaryCards";
import SetupCard from "./SetupCard/SetupCard";
import RecentTransaction from "./RecentTransaction/RecentTransaction";
import ExpensesByCategory from "./ExpensesByCategory/ExpensesByCategory";
import TipSection from "./TipSection/TipSection";
import { getGoalsPageData } from "@/actions/goalsPage";
import SpendingAlert from "./SpendingAlert";

type DashboardContentProps = {
  user: User;
};

export default async function DashboardContent({
  user,
}: DashboardContentProps) {
  const { hasGoals } = await getGoalsPageData();
  const {
    transactions,
    hasTransaction,
    totalIncome,
    totalExpense,
    totalBalance,
    totalSavings,
    expenseBreakdown,
  } = await getDashboardData();

  const completedSteps = (hasTransaction ? 1 : 0) + (hasGoals ? 1 : 0);
  const progress = Math.round((completedSteps / 2) * 100);

  return (
    <div className="min-w-0 w-full space-y-5 bg-slate-50 px-4 pb-8 pt-5 dark:bg-slate-950 sm:px-6 sm:pt-6 lg:px-8 2xl:px-10">
      <WelcomeCard user={user} progress={progress} />
      <SpendingAlert monthlyExpense={expenseBreakdown.totalExpense} />

      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalBalance={totalBalance}
        totalSavings={totalSavings}
      />

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SetupCard hasTransaction={hasTransaction} hasGoals={hasGoals} />
        <RecentTransaction transactions={transactions} />
        <div className="min-w-0 xl:col-span-2">
          <ExpensesByCategory
            key={transactions[0]?.id ?? "empty"}
            initialBreakdown={expenseBreakdown}
          />
        </div>
      </section>

      <TipSection
        hasTransaction={hasTransaction}
        totalExpense={totalExpense}
        totalSavings={totalSavings}
      />
    </div>
  );
}
