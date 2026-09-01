"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Label,
  Tooltip,
  Cell,
} from "recharts";

type ExpensesByCategoryProps = {
  expensesByCategory: {
    category: string;
    _sum: {
      amount: number | null;
    };
  }[];
};

const ExpensesByCategory = ({
  expensesByCategory,
}: ExpensesByCategoryProps) => {
  console.log(expensesByCategory);

  const chartData = expensesByCategory.map((item) => ({
    category: item.category,
    amount: item._sum.amount ?? 0,
  }));
  const COLORS = [
    "#22c55e",
    "#8b5cf6",
    "#f59e0b",
    "#3b82f6",
    "#ec4899",
    "#94a3b8",
  ];

  const totalExpense = chartData.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  return (
    <div className="bg-white p-3 rounded-md">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-xl">Expenses by Category</h1>
        <Select defaultValue="This Month">
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This Month">This Month</SelectItem>
            <SelectItem value="This Week">This Week</SelectItem>
            <SelectItem value="Today">Today</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-5">
        <div className="h-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={55}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

                <Label
                  position="center"
                  content={() => (
                    <g>
                      <text
                        x="50%"
                        y="47%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-900 font-bold text-base"
                      >
                        {formatAmount(totalExpense)}
                      </text>

                      <text
                        x="50%"
                        y="57%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-500 text-xs"
                      >
                        Total Expense
                      </text>
                    </g>
                  )}
                />
              </Pie>

              <Tooltip formatter={(value) => formatAmount(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center">
          {expensesByCategory.map((item, index) => (
            <div
              key={item.category}
              className="flex items-start justify-between space-y-5"
            >
              <span className="text-gray-500 flex items-center gap-3">
                <span
                  className="rounded-full w-4 border h-4"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
                {item.category}
              </span>
              <span className="font-semibold">₹{item._sum.amount ?? 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesByCategory;
