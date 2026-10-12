import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: LucideIcon;
  iconClassName?: string;
  amountClassName?: string;
  showCurrency?: boolean;
};

const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  amountClassName = "text-primary",
  iconClassName = "bg-primary/10 text-primary",
  showCurrency = true,
}: SummaryCardProps) => {
  return (
    <article className="summary-card group relative isolate flex min-w-0 items-start gap-3 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/40 p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:gap-4 sm:p-5 dark:hover:border-emerald-800">
      <div
        className={`flex size-10 h-fit shrink-0 items-center justify-center rounded-xl ring-1 ring-black/[0.04] sm:size-12 sm:rounded-2xl ${iconClassName}`}
      >
        <Icon className="size-5 sm:size-6" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="min-h-8 text-[10px] font-bold uppercase leading-4 tracking-[0.08em] text-slate-500 sm:min-h-0 sm:text-xs sm:tracking-[0.1em]">
          {title}
        </p>
        <p
          className={`mt-2 break-words text-xl font-bold leading-tight tracking-tight tabular-nums sm:mt-3 sm:text-2xl lg:text-3xl ${amountClassName}`}
        >
          {showCurrency && "₹"}
          {amount.toLocaleString("en-IN")}
        </p>
        <p className="mt-2 text-[11px] font-medium text-slate-500 sm:text-xs">All time</p>
      </div>
    </article>
  );
};

export default SummaryCard;
