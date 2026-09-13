import { ArrowUpRight, CircleArrowDown, PiggyBank, Wallet } from "lucide-react";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard
        title="Total Balance"
        amount={totalBalance}
        icon={Wallet}
        amountColor={totalBalance < 0 ? "text-red-500" : "text-primary"}
        change={12.5}
        subtitle="from last month"
      />

      <SummaryCard
        title="Total Income"
        amount={totalIncome}
        icon={CircleArrowDown}
        change={12.5}
        subtitle="from last month"
      />

      <SummaryCard
        title="Total Expenses"
        amount={totalExpense}
        icon={ArrowUpRight}
        iconColor="bg-red-500/10 text-red-500"
        amountColor="text-red-500"
        change={12.5}
        subtitle="from last month"
      />

      <SummaryCard
        title="Savings This Month"
        amount={totalSavings}
        icon={PiggyBank}
        amountColor={totalSavings < 0 ? "text-red-500" : "text-primary"}
        change={12.5}
        subtitle="from last month"
      />
    </div>
  );
};

export default SummaryCards;
