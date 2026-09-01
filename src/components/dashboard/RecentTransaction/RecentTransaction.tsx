import { IndianRupee } from "lucide-react";
import { Transaction } from "@/generated/prisma/client";
import {
  ShoppingCart,
  Utensils,
  Bus,
  Film,
  Zap,
  User,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  Shopping: ShoppingCart,
  Food: Utensils,
  Transport: Bus,
  Entertainment: Film,
  Utilities: Zap,
  Personal: User,
  Groceries: Apple,
};

type RecentTransactionProps = {
  transactions: Transaction[];
};
const RecentTransaction = ({ transactions }: RecentTransactionProps) => {
  return (
    <div className="flex flex-col p-4 bg-white rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Recent Transactions</h1>
        <Button variant={"outline"}>View all</Button>
      </div>
      {transactions.map((data) => {
        const Icon =
          categoryIcons[data.category as keyof typeof categoryIcons] ??
          IndianRupee;

        return (
          <div className="flex items-center justify-between mt-5" key={data.id}>
            <div className="flex gap-3">
              <div className="rounded-full bg-primary/10 px-2 py-2 flex items-center justify-center">
                <Icon className="text-primary" />
              </div>

              <div className="flex flex-col justify-center items-start">
                <span className="font-bold">{data.title}</span>
                <p className="text-sm text-gray-500">{data.category}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center items-end">
              <span
                className={`font-semibold ${data.type === "INCOME" ? "text-primary" : "text-red-500"}`}
              >
                ₹{data.amount.toLocaleString("en-IN")}
              </span>

              <span className="text-sm text-gray-500 font-semibold">
                {data.date.toLocaleDateString()}
              </span>
              <span className="text-xs text-gray-400">
                {data.type.toLowerCase()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransaction;
