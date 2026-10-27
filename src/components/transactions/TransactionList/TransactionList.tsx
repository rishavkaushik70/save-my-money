"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  EllipsisVertical,
  IndianRupee,
  ShoppingCart,
  Utensils,
  Bus,
  Film,
  Zap,
  User,
  Apple,
  Pencil,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Key,
  RotateCcw,
  Gift,
  Wallet,
  Home,
  HeartPulse,
  GraduationCap,
  Plane,
  CreditCard,
  ShieldCheck,
  Receipt,
  ReceiptText,
  CircleDollarSign,
  type LucideIcon,
} from "lucide-react";

import { Transaction } from "@/generated/prisma/client";

import { useMemo, useState } from "react";

import TransactionFilters from "../TransactionFilters/TransactionFilters";
import TransactionPagination from "../TransactionPagination/TransactionPagination";
import { deleteTransaction } from "@/actions/transactions";
import { TransactionDialog } from "../AddTransactionDialog/add-transaction-dialog";

type CategoryStyle = {
  icon: LucideIcon;
  iconClass: string;
  badgeClass: string;
};

const categoryConfig: Record<string, CategoryStyle> = {
  // Canonical Expenses
  "Food & Dining": {
    icon: Utensils,
    iconClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
    badgeClass: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
  },
  Groceries: {
    icon: Apple,
    iconClass: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    badgeClass: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
  },
  Transport: {
    icon: Bus,
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  "Housing & Rent": {
    icon: Home,
    iconClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
    badgeClass: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  Utilities: {
    icon: Zap,
    iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  Shopping: {
    icon: ShoppingCart,
    iconClass: "bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-300",
    badgeClass: "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  },
  "Health & Medical": {
    icon: HeartPulse,
    iconClass: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
    badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  },
  Education: {
    icon: GraduationCap,
    iconClass: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
    badgeClass: "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  },
  Entertainment: {
    icon: Film,
    iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },
  "Personal Care": {
    icon: User,
    iconClass: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    badgeClass: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
  },
  Travel: {
    icon: Plane,
    iconClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
    badgeClass: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
  },
  "EMI & Loan Payments": {
    icon: CreditCard,
    iconClass: "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
    badgeClass: "bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300",
  },
  Insurance: {
    icon: ShieldCheck,
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  "Family & Gifts": {
    icon: Gift,
    iconClass: "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
    badgeClass: "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
  },
  "Savings & Investments": {
    icon: TrendingUp,
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  "Fees & Charges": {
    icon: Receipt,
    iconClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    badgeClass: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  Taxes: {
    icon: ReceiptText,
    iconClass: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
    badgeClass: "bg-stone-50 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  },
  "Other Expense": {
    icon: CircleDollarSign,
    iconClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    badgeClass: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },

  // Canonical Income
  Salary: {
    icon: Briefcase,
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  Freelance: {
    icon: Laptop,
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },
  "Business Income": {
    icon: Building2,
    iconClass: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    badgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  },
  "Investment Returns": {
    icon: TrendingUp,
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  "Rental Income": {
    icon: Key,
    iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  },
  Refunds: {
    icon: RotateCcw,
    iconClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
    badgeClass: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300",
  },
  "Gifts Received": {
    icon: Gift,
    iconClass: "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
    badgeClass: "bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300",
  },
  "Other Income": {
    icon: Wallet,
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },

  // Historical & Legacy Aliases
  Food: {
    icon: Utensils,
    iconClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
    badgeClass: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
  },
  Personal: {
    icon: User,
    iconClass: "bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
    badgeClass: "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300",
  },
  Business: {
    icon: Building2,
    iconClass: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
    badgeClass: "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  },
  Investment: {
    icon: TrendingUp,
    iconClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    badgeClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  Other: {
    icon: CircleDollarSign,
    iconClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    badgeClass: "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
};

type TransactionListProps = {
  allTransaction: Transaction[];
};

const TransactionList = ({ allTransaction }: TransactionListProps) => {
  /* ---------------- FILTER STATES ---------------- */

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [type, setType] = useState("ALL");
  const [period, setPeriod] = useState("ALL");

  /* ---------------- PAGINATION STATES ---------------- */

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredTransactions = useMemo(() => {
    let transactions = [...allTransaction];
    const searchTerm = search.trim().toLocaleLowerCase();

    // SEARCH

    if (searchTerm) {
      transactions = transactions.filter((transaction) =>
        `${transaction.title} ${transaction.category}`
          .toLocaleLowerCase()
          .includes(searchTerm),
      );
    }

    // CATEGORY

    if (category !== "ALL") {
      transactions = transactions.filter(
        (transaction) => transaction.category === category,
      );
    }

    // TYPE

    if (type !== "ALL") {
      transactions = transactions.filter(
        (transaction) => transaction.type === type,
      );
    }

    // PERIOD

    const now = new Date();

    // TODAY

    if (period === "TODAY") {
      transactions = transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    }

    // THIS WEEK

    if (period === "WEEK") {
      const startOfWeek = new Date();

      startOfWeek.setDate(now.getDate() - now.getDay());

      startOfWeek.setHours(0, 0, 0, 0);

      transactions = transactions.filter(
        (transaction) => new Date(transaction.date) >= startOfWeek,
      );
    }

    // THIS MONTH

    if (period === "MONTH") {
      transactions = transactions.filter((transaction) => {
        const date = new Date(transaction.date);

        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    }

    return transactions;
  }, [allTransaction, search, category, type, period]);

  /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    setCurrentPage(1);
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("ALL");
    setType("ALL");
    setPeriod("ALL");
    setCurrentPage(1);
  };

  const categories = useMemo(
    () =>
      Array.from(new Set(allTransaction.map((transaction) => transaction.category))).sort(
        (first, second) => first.localeCompare(second),
      ),
    [allTransaction],
  );

  /* ---------------- PAGINATION CALCULATIONS ---------------- */

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  // delete transaction state

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    setIsDeleting(true);

    try {
      const result = await deleteTransaction(transactionToDelete.id);

      if (!result.success) {
        console.error(result.message);
        return;
      }

      setTransactionToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* FILTERS */}

      <TransactionFilters
        search={search}
        setSearch={handleSearchChange}
        category={category}
        setCategory={handleCategoryChange}
        categories={categories}
        type={type}
        setType={handleTypeChange}
        period={period}
        setPeriod={handlePeriodChange}
        resultCount={filteredTransactions.length}
        onReset={handleResetFilters}
      />

      {/* TABLE */}

      <div className="overflow-x-auto">
        <Table className="min-w-[640px]">
          <TableHeader className="bg-slate-100/80">
            <TableRow className="h-14">
              <TableHead className="pl-5 font-bold text-slate-600">Date</TableHead>

              <TableHead className="font-bold text-slate-600">Title</TableHead>

              <TableHead className="font-bold text-slate-600">Category</TableHead>

              <TableHead className="font-bold text-slate-600">Type</TableHead>

              <TableHead className="font-bold text-slate-600">Amount</TableHead>

              <TableHead className="text-center font-bold text-slate-600">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center py-12">
                    No transactions found!
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((data) => {
                const config =
                  categoryConfig[data.category as keyof typeof categoryConfig];

                const Icon = config?.icon ?? IndianRupee;

                return (
                  <TableRow
                    key={data.id}
                    className="h-16 transition-colors hover:bg-primary/5"
                  >
                    {/* DATE */}

                    <TableCell className="pl-5 font-medium text-slate-500">
                      {data.date.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* TITLE */}

                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-md p-2 ${
                            config?.iconClass ??
                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          <Icon className="size-4" />
                        </div>

                        <div>{data.title}</div>
                      </div>
                    </TableCell>

                    {/* CATEGORY */}

                    <TableCell>
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                          config?.badgeClass ??
                          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {data.category}
                      </span>
                    </TableCell>

                    {/* TYPE */}

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          data.type === "INCOME"
                            ? "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />

                        {data.type === "INCOME" ? "Income" : "Expense"}
                      </span>
                    </TableCell>

                    {/* AMOUNT */}

                    <TableCell>
                      <span
                        className={`font-semibold ${
                          data.type === "INCOME"
                            ? "text-primary"
                            : "text-red-500"
                        }`}
                      >
                        {data.type === "INCOME" ? "+" : "-"}₹
                        {data.amount.toLocaleString("en-IN")}
                      </span>
                    </TableCell>

                    {/* ACTION */}

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <EllipsisVertical />

                              <span className="sr-only">Open menu</span>
                            </Button>
                          }
                        />

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setTransactionToEdit(data);
                            }}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setTransactionToDelete(data);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}

      {totalPages > 0 && (
        <TransactionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
      <AlertDialog
        open={transactionToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTransactionToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {transactionToDelete?.title}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <TransactionDialog
        transaction={transactionToEdit}
        open={transactionToEdit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setTransactionToEdit(null);
          }
        }}
      />
    </div>
  );
};

export default TransactionList;
