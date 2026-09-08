"use server";

import { getAllGoals } from "./goals";

export async function getGoalsPageData() {
  const allGoals = await getAllGoals();
  const hasGoals = allGoals.length > 0;

  return {
    allGoals,
    hasGoals,
  };
}
