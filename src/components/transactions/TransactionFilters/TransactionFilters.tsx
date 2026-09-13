"use client";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar, Search } from "lucide-react";

type TransactionFiltersProps = {
  search: string;
  setSearch: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  type: string;
  setType: (value: string) => void;

  period: string;
  setPeriod: (value: string) => void;
};

const TransactionFilters = ({
  search,
  setSearch,

  category,
  setCategory,

  type,
  setType,

  period,
  setPeriod,
}: TransactionFiltersProps) => {
  return (
    <div className="p-4 flex flex-col md:flex-row gap-3">
      {/* SEARCH */}

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

        <Input
          placeholder="Search by title...."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SELECTS GROUP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:flex gap-3">
        {/* CATEGORY */}

        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "ALL")}
        >
          <SelectTrigger className="w-full md:w-45">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All category</SelectItem>

            <SelectItem value="Entertainment">Entertainment</SelectItem>

            <SelectItem value="Shopping">Shopping</SelectItem>

            <SelectItem value="Personal">Personal</SelectItem>

            <SelectItem value="Groceries">Groceries</SelectItem>

            <SelectItem value="Utilities">Utilities</SelectItem>

            <SelectItem value="Transport">Transport</SelectItem>

            <SelectItem value="Food">Food</SelectItem>
          </SelectContent>
        </Select>

        {/* TYPE */}

        <Select value={type} onValueChange={(value) => setType(value ?? "ALL")}>
          <SelectTrigger className="w-full md:w-45">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>

            <SelectItem value="INCOME">Income</SelectItem>

            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        {/* PERIOD */}

        <Select
          value={period}
          onValueChange={(value) => setPeriod(value ?? "ALL")}
        >
          <SelectTrigger className="w-full md:w-45">
            <Calendar className="size-5" />

            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="TODAY">Today</SelectItem>

            <SelectItem value="WEEK">This Week</SelectItem>

            <SelectItem value="MONTH">This Month</SelectItem>

            <SelectItem value="ALL">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TransactionFilters;
