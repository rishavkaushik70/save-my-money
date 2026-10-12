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
} from "lucide-react";

import { Transaction } from "@/generated/prisma/client";

import { useMemo, useState } from "react";

import TransactionFilters from "../TransactionFilters/TransactionFilters";
import TransactionPagination from "../TransactionPagination/TransactionPagination";
import { deleteTransaction } from "@/actions/transactions";

const categoryConfig = {
  Shopping: {
    icon: ShoppingCart,
    iconClass: "bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-300",
    badgeClass: "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  },

  Food: {
    icon: Utensils,
    iconClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
    badgeClass: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
  },

  Transport: {
    icon: Bus,
    iconClass: "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    badgeClass: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  },

  Entertainment: {
    icon: Film,
    iconClass: "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
    badgeClass: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300",
  },

  Utilities: {
    icon: Zap,
    iconClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
    badgeClass: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300",
  },

  Personal: {
    icon: User,
    iconClass: "bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-300",
    badgeClass: "bg-green-50 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  },

  Groceries: {
    icon: Apple,
    iconClass: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    badgeClass: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300",
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
    </div>
  );
};

export default TransactionList;
