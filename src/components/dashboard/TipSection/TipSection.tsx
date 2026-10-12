import Link from "next/link";
import { ArrowUpRight, Lightbulb } from "lucide-react";

type TipSectionProps = {
  hasTransaction: boolean;
  totalExpense: number;
  totalSavings: number;
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

const TipSection = ({
  hasTransaction,
  totalExpense,
  totalSavings,
}: TipSectionProps) => {
  const message = !hasTransaction
    ? "Add your first income or expense to get a clearer picture of your finances."
    : totalSavings < 0
      ? `This month, recorded expenses are ${formatAmount(totalSavings)} above income. Review your transactions to find a category to adjust.`
      : totalExpense === 0
        ? "Your expenses will appear here as you add them. Start with the regular payments you want to keep an eye on."
        : `Your net savings this month are ${formatAmount(totalSavings)}. Keep checking in as new transactions come in.`;

  return (
    <aside
      role="status"
      className="flex min-w-0 items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50 px-4 py-4 shadow-sm sm:items-center sm:px-5 dark:border-emerald-900/80 dark:bg-[#102a20]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-[#0b1c14] dark:text-emerald-300 dark:ring-[#244735]">
        <Lightbulb className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-6 text-emerald-950">
          <span className="font-bold">Money insight:</span> {message}
        </p>
        {hasTransaction && (
          <Link
            href="/transaction"
          className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
          >
            Review transactions
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </aside>
  );
};

export default TipSection;
