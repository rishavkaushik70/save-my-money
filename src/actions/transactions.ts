"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { TransactionOutput } from "@/lib/validators/transactions";

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
    if (transaction.date > new Date()) {
      return {
        success: false,
        message: "Transaction date cannot be in the future.",
      };
    }
    await prisma.transaction.create({
      data: {
        ...transaction,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
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

export async function getExpensesByCategory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const expenses = await prisma.transaction.groupBy({
    by: ["category"],
    where: {
      userId: session.user.id,
      type: "EXPENSE",
    },
    _sum: {
      amount: true,
    },
  });

  return expenses;
}

// To get total monthy savings

export async function getMonthlySavings() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 0;
  }

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "INCOME",
        date: {
          gte: startOfMonth,
          lt: startOfNextMonth,
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
          gte: startOfMonth,
          lt: startOfNextMonth,
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
