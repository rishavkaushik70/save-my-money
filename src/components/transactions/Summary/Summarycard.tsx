import { LucideIcon, TrendingUp } from "lucide-react";

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
    <div className="p-3 flex bg-white rounded-md gap-4 w-97 md:w-full">
      <div
        className={`px-4 py-4 h-fit rounded-md flex justify-center items-center ${iconClassName}`}
      >
        <Icon className="size-8" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-600 text-sm">{title}</span>
        <span className={`text-2xl font-bold ${amountClassName}`}>
          {showCurrency && "₹"}
          {amount.toLocaleString("en-IN")}
        </span>
        <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
          <span className="flex items-center gap-1">All time</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
