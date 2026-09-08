"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { GoalOutput } from "@/lib/validators/goals";

// Create New goal

export async function createGoal(goal: GoalOutput) {
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
    await prisma.goal.create({
      data: {
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: 0,
        category: goal.category,
        deadline: goal.deadline,
        description: goal.description,
        userId: session.user.id,
      },
    });

    revalidatePath("/goals");
    return {
      success: true,
      message: "Goal added successfully.",
    };
  } catch (error) {
    console.error("Create Goal Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

//Import goal

export async function getAllGoals() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const goals = await prisma.goal.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      deadline: "desc",
    },
  });

  return goals;
}

//Add money to db
export async function addMoneyToGoal(goalId: string, amount: number) {
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

    if (amount <= 0) {
      return {
        success: false,
        message: "Amount must be greater than 0.",
      };
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return {
        success: false,
        message: "Goal not found.",
      };
    }

    if (goal.currentAmount + amount > goal.targetAmount) {
      return {
        success: false,
        message: "Amount exceeds the remaining goal amount.",
      };
    }

    await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        currentAmount: {
          increment: amount,
        },
      },
    });

    revalidatePath("/goals");

    return {
      success: true,
      message: "Money added successfully.",
    };
  } catch (error) {
    console.error("Add Money Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

// delete goals

export async function deleteGoal(goalId: string) {
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

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
        userId: session.user.id,
      },
    });

    if (!goal) {
      return {
        success: false,
        message: "Goal not found.",
      };
    }

    await prisma.goal.delete({
      where: {
        id: goalId,
      },
    });

    revalidatePath("/goals");

    return {
      success: true,
      message: "Goal deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Goal Error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
