import { LucideIcon, TrendingUp } from "lucide-react";

type SummaryCardProps = {
  title: string;
  amount: number;
  icon: LucideIcon;

  iconColor?: string;
  amountColor?: string;

  subtitle?: string;
  change?: number;
};

const SummaryCard = ({
  title,
  amount,
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
  amountColor = "text-primary",
  subtitle,
  change,
}: SummaryCardProps) => {
  return (
    <div className="p-3 flex bg-white rounded-md gap-4">
      {/* Icon */}
      <div
        className={`px-4 py-4 h-fit rounded-md flex justify-center items-center ${iconColor}`}
      >
        <Icon className="size-8" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-gray-600 text-sm">{title}</span>

        <span className={`text-2xl font-bold ${amountColor}`}>
          ₹{amount.toLocaleString("en-IN")}
        </span>

        {/* Optional bottom text */}
        {change !== undefined ? (
          <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
            <span className="text-primary flex items-center gap-1">
              <TrendingUp className="size-4" />+{change}%
            </span>

            {subtitle}
          </div>
        ) : (
          <span className="text-xs text-gray-500 font-semibold">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
