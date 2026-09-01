import { ArrowUpRight, CircleArrowDown, Wallet } from "lucide-react";
import SummaryCard from "./Summarycard";

type TransactionSummaryProps = {
  totalTransactions: number;
  totalIncome: number;
  totalExpense: number;
};

const TransactionSummary = ({
  totalTransactions,
  totalIncome,
  totalExpense,
}: TransactionSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SummaryCard
        title="Total Transactions"
        amount={totalTransactions}
        icon={Wallet}
        amountClassName="text-gray-900"
        showCurrency={false}
      />

      <SummaryCard
        title="Total Income"
        amount={totalIncome}
        icon={CircleArrowDown}
      />

      <SummaryCard
        title="Total Expenses"
        amount={totalExpense}
        icon={ArrowUpRight}
        iconClassName="bg-red-500/10 text-red-500"
        amountClassName="text-red-500"
      />
    </div>
  );
};

export default TransactionSummary;
