import { ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";

import SummaryCard from "./SummaryCard";

type SummaryCardsProps = {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalSavings: number;
};

const SummaryCards = ({
  totalIncome,
  totalExpense,
  totalBalance,
  totalSavings,
}: SummaryCardsProps) => {
  return (
    <section aria-label="Financial summary" className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      <SummaryCard
        title="Total Balance"
        amount={totalBalance}
        icon={Wallet}
        amountColor={totalBalance < 0 ? "text-red-500" : "text-primary"}
        subtitle="Income minus expenses"
      />

      <SummaryCard
        title="Total Income"
        amount={totalIncome}
        icon={ArrowDownLeft}
        subtitle="Income recorded so far"
      />

      <SummaryCard
        title="Total Expenses"
        amount={totalExpense}
        icon={ArrowUpRight}
        iconColor="bg-red-500/10 text-red-500"
        amountColor="text-red-500"
        subtitle="Expenses recorded so far"
      />

      <SummaryCard
        title="Savings This Month"
        amount={totalSavings}
        icon={PiggyBank}
        amountColor={totalSavings < 0 ? "text-red-500" : "text-primary"}
        subtitle="Net savings this month"
      />
    </section>
  );
};

export default SummaryCards;
