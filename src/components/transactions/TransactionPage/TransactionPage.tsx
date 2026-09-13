import TransactionSummary from "../Summary/TransactionSummay";
import TransactionList from "../TransactionList/TransactionList";
import { getTransactionPageData } from "@/actions/transactionPage";

const TransactionPage = async () => {
  const { allTransactions, totalIncome, totalExpense, totalTransactions } =
    await getTransactionPageData();
  return (
    <div className="w-full bg-gray-100 px-4 py-6 md:px-10 md:pt-10 flex flex-col gap-6 md:pb-1 min-h-[calc(100vh-68px)]">
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
