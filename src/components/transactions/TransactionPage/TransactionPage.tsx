import TransactionSummary from "../Summary/TransactionSummay";
import TransactionList from "../TransactionList/TransactionList";
import { getTransactionPageData } from "@/actions/transactionPage";

const TransactionPage = async () => {
  const { allTransactions, totalIncome, totalExpense, totalTransactions } =
    await getTransactionPageData();
  return (
    <div className="flex min-h-[calc(100vh-68px)] w-full min-w-0 flex-col gap-5 bg-slate-50 px-4 py-5 pb-8 sm:px-6 lg:px-8 lg:py-7 dark:bg-slate-950">
      <TransactionSummary
        totalTransactions={totalTransactions}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
      />

      <TransactionList allTransaction={allTransactions} />
    </div>
  );
};

export default TransactionPage;
