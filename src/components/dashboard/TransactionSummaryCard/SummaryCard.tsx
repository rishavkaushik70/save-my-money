import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: LucideIcon;

  iconColor?: string;
  amountColor?: string;

  subtitle?: string;
};

const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
  amountColor = "text-primary",
  subtitle,
}: SummaryCardProps) => {
  return (
    <article className="summary-card group relative isolate min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-emerald-50/50 p-3.5 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.4)] transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md sm:p-5">
      <div className="relative z-10">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{title}</p>
            <p className={`mt-2.5 break-words text-[clamp(1.15rem,4vw,1.75rem)] font-bold leading-tight tracking-tight tabular-nums ${amountColor}`}>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(amount)}
            </p>
          </div>
          <span className={`flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-black/[0.04] transition group-hover:scale-105 ${iconColor}`}>
            <Icon className="size-4 sm:size-5" aria-hidden="true" />
          </span>
        </div>
        {subtitle && <p className="mt-2.5 text-xs font-medium text-slate-500 line-clamp-1">{subtitle}</p>}
      </div>
    </article>
  );
};

export default SummaryCard;
