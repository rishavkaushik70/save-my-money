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
  DropdownMenuSeparator,
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

import { useEffect, useMemo, useState } from "react";

import TransactionFilters from "../TransactionFilters/TransactionFilters";
import TransactionPagination from "../TransactionPagination/TransactionPagination";
import { deleteTransaction } from "@/actions/transactions";

const categoryConfig = {
  Shopping: {
    icon: ShoppingCart,
    iconClass: "bg-green-100 text-green-600",
    badgeClass: "bg-green-50 text-green-600",
  },

  Food: {
    icon: Utensils,
    iconClass: "bg-yellow-100 text-yellow-600",
    badgeClass: "bg-yellow-50 text-yellow-600",
  },

  Transport: {
    icon: Bus,
    iconClass: "bg-blue-100 text-blue-600",
    badgeClass: "bg-blue-50 text-blue-600",
  },

  Entertainment: {
    icon: Film,
    iconClass: "bg-purple-100 text-purple-600",
    badgeClass: "bg-purple-50 text-purple-600",
  },

  Utilities: {
    icon: Zap,
    iconClass: "bg-yellow-100 text-yellow-600",
    badgeClass: "bg-yellow-50 text-yellow-600",
  },

  Personal: {
    icon: User,
    iconClass: "bg-green-100 text-green-600",
    badgeClass: "bg-green-50 text-green-600",
  },

  Groceries: {
    icon: Apple,
    iconClass: "bg-red-100 text-red-600",
    badgeClass: "bg-red-50 text-red-600",
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

    // SEARCH

    if (search.trim()) {
      transactions = transactions.filter((transaction) =>
        transaction.title.toLowerCase().includes(search.toLowerCase()),
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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, type, period]);

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
    <div className="border bg-white rounded-md overflow-hidden">
      {/* FILTERS */}

      <TransactionFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        period={period}
        setPeriod={setPeriod}
      />

      {/* TABLE */}

      <Table>
        <TableHeader className="bg-gray-100/80">
          <TableRow className="h-16">
            <TableHead className="font-bold pl-5">Date</TableHead>

            <TableHead className="font-bold">Title</TableHead>

            <TableHead className="font-bold">Category</TableHead>

            <TableHead className="font-bold">Type</TableHead>

            <TableHead className="font-bold">Amount</TableHead>

            <TableHead className="font-bold text-center">Action</TableHead>
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
                  className="h-16 hover:bg-primary/5 transition-colors"
                >
                  {/* DATE */}

                  <TableCell className="font-medium pl-5 text-gray-500">
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
                        className={`p-2 rounded-md ${
                          config?.iconClass ?? "bg-gray-100 text-gray-600"
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
                      className={`inline-flex px-3 py-1 rounded-md text-xs font-semibold ${
                        config?.badgeClass ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {data.category}
                    </span>
                  </TableCell>

                  {/* TYPE */}

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        data.type === "INCOME"
                          ? "text-green-700 bg-green-100"
                          : "text-red-600 bg-red-100"
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
                        data.type === "INCOME" ? "text-primary" : "text-red-500"
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
