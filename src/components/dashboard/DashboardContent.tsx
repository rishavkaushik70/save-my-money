import { getDashboardData } from "@/actions/dashboard";
import type { User } from "@/types/auth";
import WelcomeCard from "./welcomeCard/WelcomeCard";
import SummaryCards from "./TransactionSummaryCard/SummaryCards";
import SetupCard from "./SetupCard/SetupCard";
import RecentTransaction from "./RecentTransaction/RecentTransaction";
import ExpensesByCategory from "./ExpensesByCategory/ExpensesByCategory";
import TipSection from "./TipSection/TipSection";
import EmptyCard from "./EmptyCard/EmptyCard";

type DashboardContentProps = {
  user: User;
};

export default async function DashboardContent({
  user,
}: DashboardContentProps) {
  const {
    transactions,
    hasTransaction,
    totalIncome,
    totalExpense,
    totalBalance,
    totalSavings,
    expensesByCategory,
  } = await getDashboardData();

  const completedSteps = hasTransaction ? 1 : 0;
  const progress = (completedSteps / 4) * 100;

  return (
    <main className="w-full bg-gray-100 px-10 pt-10 flex flex-col gap-6 pb-1 min-h-[calc(100vh-68px)]">
      <WelcomeCard user={user} progress={progress} />

      {hasTransaction && (
        <SummaryCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalBalance={totalBalance}
          totalSavings={totalSavings}
        />
      )}

      <div
        className={`grid gap-4 ${
          hasTransaction ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        <SetupCard hasTransaction={hasTransaction} />

        {!hasTransaction && <EmptyCard />}

        {hasTransaction && (
          <>
            <RecentTransaction transactions={transactions} />

            <ExpensesByCategory expensesByCategory={expensesByCategory} />
          </>
        )}
      </div>

      <TipSection />
    </main>
  );
}
