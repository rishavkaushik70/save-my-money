"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  TransactionOutput,
  transactionSchema,
} from "@/lib/validators/transactions";
import type { ExpenseBreakdown, ExpensePeriod } from "@/lib/types/dashboard";
import {
  normalizeCategory,
  getCategoryFilterValues,
} from "@/lib/constants/transaction";

const INDIA_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const EXPENSE_TRANSACTION_PAGE_SIZE = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

function getIndiaMonthRange(now = new Date()) {
  const indiaDate = new Date(now.getTime() + INDIA_OFFSET_MS);
  const year = indiaDate.getUTCFullYear();
  const month = indiaDate.getUTCMonth();

  return {
    start: new Date(Date.UTC(year, month, 1) - INDIA_OFFSET_MS),
    end: new Date(Date.UTC(year, month + 1, 1) - INDIA_OFFSET_MS),
  };
}

function getExpensePeriodRange(period: ExpensePeriod, now = new Date()) {
  const indiaDate = new Date(now.getTime() + INDIA_OFFSET_MS);
  const year = indiaDate.getUTCFullYear();
  const month = indiaDate.getUTCMonth();
  const day = indiaDate.getUTCDate();

  if (period === "This month") {
    return getIndiaMonthRange(now);
  }

  const localDay = new Date(Date.UTC(year, month, day));
  if (period === "This week") {
    const daysSinceMonday = (localDay.getUTCDay() + 6) % 7;
    localDay.setUTCDate(localDay.getUTCDate() - daysSinceMonday);
  }

  const start = new Date(localDay.getTime() - INDIA_OFFSET_MS);
  const durationDays = period === "This week" ? 7 : 1;
  return {
    start,
    end: new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000),
  };
}

function getExpenseComparisonRange(period: ExpensePeriod, now = new Date()) {
  const currentRange = getExpensePeriodRange(period, now);
  const todayStart = getExpensePeriodRange("Today", now).start;
  const elapsedDays = Math.max(
    1,
    Math.floor((todayStart.getTime() - currentRange.start.getTime()) / DAY_MS) + 1,
  );

  if (period === "Today") {
    return {
      currentRange,
      elapsedDays,
      previousRange: {
        start: new Date(currentRange.start.getTime() - DAY_MS),
        end: currentRange.start,
      },
    };
  }

  if (period === "This week") {
    const start = new Date(currentRange.start.getTime() - 7 * DAY_MS);
    return {
      currentRange,
      elapsedDays,
      previousRange: {
        start,
        end: new Date(start.getTime() + elapsedDays * DAY_MS),
      },
    };
  }

  const indiaDate = new Date(now.getTime() + INDIA_OFFSET_MS);
  const previousMonthStart = new Date(
    Date.UTC(indiaDate.getUTCFullYear(), indiaDate.getUTCMonth() - 1, 1) -
      INDIA_OFFSET_MS,
  );
  const previousMonthEnd = new Date(
    Date.UTC(indiaDate.getUTCFullYear(), indiaDate.getUTCMonth(), 1) -
      INDIA_OFFSET_MS,
  );

  return {
    currentRange,
    elapsedDays,
    previousRange: {
      start: previousMonthStart,
      end: new Date(
        Math.min(
          previousMonthStart.getTime() + elapsedDays * DAY_MS,
          previousMonthEnd.getTime(),
        ),
      ),
    },
  };
}

// export data to database

export async function createTransaction(transaction: TransactionOutput) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    const validation = transactionSchema.safeParse(transaction);
    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues[0]?.message ?? "Invalid transaction.",
      };
    }

    const validTransaction = validation.data;
    if (validTransaction.date.getTime() > Date.now() + 60_000) {
      return {
        success: false,
        message: "Transaction date cannot be in the future.",
      };
    }
    await prisma.transaction.create({
      data: {
        ...validTransaction,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transaction");
    revalidatePath("/reports");
    return {
      success: true,
      message: "Transaction added successfully.",
    };
  } catch (error) {
    console.error("Create Transaction Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// Atomically create multiple transactions
export async function createManyTransactions(transactions: TransactionOutput[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized. Please sign in.",
        count: 0,
      };
    }

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return {
        success: false,
        message: "No transactions provided to save.",
        count: 0,
      };
    }

    if (transactions.length > 50) {
      return {
        success: false,
        message: "Cannot save more than 50 transactions at once.",
        count: 0,
      };
    }

    const validTransactions: TransactionOutput[] = [];
    const now = Date.now();

    for (let i = 0; i < transactions.length; i++) {
      const raw = transactions[i];
      const validation = transactionSchema.safeParse(raw);
      if (!validation.success) {
        return {
          success: false,
          message: `Transaction #${i + 1} is invalid: ${
            validation.error.issues[0]?.message ?? "Invalid details."
          }`,
          count: 0,
        };
      }

      const validTx = validation.data;
      if (validTx.date.getTime() > now + 60_000) {
        return {
          success: false,
          message: `Transaction #${i + 1} date cannot be in the future.`,
          count: 0,
        };
      }

      validTransactions.push(validTx);
    }

    // Atomic persistence using prisma.$transaction
    await prisma.$transaction(
      validTransactions.map((tx) =>
        prisma.transaction.create({
          data: {
            ...tx,
            userId: session.user.id,
          },
        })
      )
    );

    revalidatePath("/dashboard");
    revalidatePath("/transaction");
    revalidatePath("/reports");

    return {
      success: true,
      message: `Successfully added ${validTransactions.length} transaction${
        validTransactions.length > 1 ? "s" : ""
      }.`,
      count: validTransactions.length,
    };
  } catch (error) {
    console.error("Create Many Transactions Error:", error);

    return {
      success: false,
      message: "Something went wrong while saving transactions. Please try again.",
      count: 0,
    };
  }
}

//To get 5 recent transaction

export async function getRecentTransactions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return transactions;
}

// To get Sum of all incoming transactions

export async function getTotalIncome() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 0;
  }
  const totalIncome = await prisma.transaction.aggregate({
    where: {
      userId: session.user.id,
      type: "INCOME",
    },
    _sum: {
      amount: true,
    },
  });

  return totalIncome._sum.amount ?? 0;
}

// To get Sum of all outgoing(expense) transactions

export async function getTotalExpense() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 0;
  }
  const totalExpense = await prisma.transaction.aggregate({
    where: {
      userId: session.user.id,
      type: "EXPENSE",
    },
    _sum: {
      amount: true,
    },
  });

  return totalExpense._sum.amount ?? 0;
}

// To get expenses on the basis of thier category

export async function getExpensesByCategory(
  period: ExpensePeriod = "This month",
  category?: string,
  offset = 0,
): Promise<ExpenseBreakdown> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      categories: [],
      transactions: [],
      hasMoreTransactions: false,
      totalExpense: 0,
      transactionCount: 0,
      dailyAverage: 0,
      previousPeriodExpense: 0,
    };
  }

  const safePeriod: ExpensePeriod = ["This month", "This week", "Today"].includes(period)
    ? period
    : "This month";
  const safeOffset =
    Number.isInteger(offset) && offset >= 0 && offset <= 10_000 ? offset : 0;
  const { currentRange, previousRange, elapsedDays } = getExpenseComparisonRange(safePeriod);
  const where = {
    userId: session.user.id,
    type: "EXPENSE" as const,
    date: { gte: currentRange.start, lt: currentRange.end },
  };
  const previousWhere = {
    userId: session.user.id,
    type: "EXPENSE" as const,
    date: { gte: previousRange.start, lt: previousRange.end },
  };

  const filterCategories = category
    ? getCategoryFilterValues(category, "EXPENSE")
    : [];

  const [categoryTotals, matchingTransactions, currentSummary, previousSummary] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["category"],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
    }),
    category
      ? prisma.transaction.findMany({
          where: {
            ...where,
            category: { in: filterCategories },
          },
          select: {
            id: true,
            title: true,
            category: true,
            amount: true,
            date: true,
          },
          orderBy: [{ date: "desc" }, { createdAt: "desc" }],
          skip: safeOffset,
          take: EXPENSE_TRANSACTION_PAGE_SIZE + 1,
        })
      : Promise.resolve([]),
    prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.transaction.aggregate({
      where: previousWhere,
      _sum: { amount: true },
    }),
  ]);

  const totalExpense = currentSummary._sum.amount ?? 0;

  // Merge legacy and canonical categories so duplicate report slices do not appear
  const mergedCategoryMap = new Map<string, number>();
  for (const { category: cat, _sum } of categoryTotals) {
    const canonical = normalizeCategory(cat, "EXPENSE") || "Other Expense";
    const amount = _sum.amount ?? 0;
    mergedCategoryMap.set(
      canonical,
      (mergedCategoryMap.get(canonical) ?? 0) + amount,
    );
  }

  const normalizedCategories = Array.from(mergedCategoryMap.entries())
    .map(([categoryName, amount]) => ({
      category: categoryName,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    categories: normalizedCategories,
    transactions: matchingTransactions.slice(0, EXPENSE_TRANSACTION_PAGE_SIZE),
    hasMoreTransactions:
      matchingTransactions.length > EXPENSE_TRANSACTION_PAGE_SIZE,
    totalExpense,
    transactionCount: currentSummary._count._all,
    dailyAverage: totalExpense / elapsedDays,
    previousPeriodExpense: previousSummary._sum.amount ?? 0,
  };
}

// To get total monthy savings

export async function getMonthlySavings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 0;
  }

  const { start, end } = getIndiaMonthRange();

  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "INCOME",
        date: {
          gte: start,
          lt: end,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "EXPENSE",
        date: {
          gte: start,
          lt: end,
        },
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const monthlyIncome = income._sum.amount ?? 0;
  const monthlyExpense = expense._sum.amount ?? 0;

  return monthlyIncome - monthlyExpense;
}

//Get all transaction
export async function getAllTransactions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return transactions;
}

// Delete transaction

export async function deleteTransaction(transactionId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: session.user.id,
      },
    });

    if (!transaction) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/transaction");
    revalidatePath("/reports");

    return {
      success: true,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    console.error("Delete Transaction Error:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

// Update existing transaction
export async function updateTransaction(
  transactionId: string,
  transaction: TransactionOutput
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    if (!transactionId || typeof transactionId !== "string") {
      return {
        success: false,
        message: "Invalid transaction ID.",
      };
    }

    const validation = transactionSchema.safeParse(transaction);
    if (!validation.success) {
      return {
        success: false,
        message:
          validation.error.issues[0]?.message ?? "Invalid transaction details.",
      };
    }

    const validTransaction = validation.data;
    if (validTransaction.date.getTime() > Date.now() + 60_000) {
      return {
        success: false,
        message: "Transaction date cannot be in the future.",
      };
    }

    // Verify ownership: ensure the transaction exists and belongs strictly to the authenticated user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: session.user.id,
      },
    });

    if (!existingTransaction) {
      return {
        success: false,
        message: "Transaction not found or you do not have permission to edit it.",
      };
    }

    // Update only permitted editable fields
    await prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        title: validTransaction.title,
        amount: validTransaction.amount,
        type: validTransaction.type,
        category: validTransaction.category,
        date: validTransaction.date,
        description: validTransaction.description ?? null,
      },
    });

    // Invalidate affected data caches to trigger aggregate recalculation
    revalidatePath("/dashboard");
    revalidatePath("/transaction");
    revalidatePath("/reports");

    return {
      success: true,
      message: "Transaction updated successfully.",
    };
  } catch (error) {
    console.error("Update Transaction Error:", error);

    return {
      success: false,
      message: "Something went wrong while updating the transaction.",
    };
  }
}
