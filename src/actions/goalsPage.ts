import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function getGoalsPageData() {
  const session = await auth.api.getSession({ headers: await headers() });
  const allGoals = session
    ? await prisma.goal.findMany({
        where: { userId: session.user.id },
        orderBy: { deadline: "desc" },
      })
    : [];

  const hasGoals = allGoals.length > 0;

  return {
    allGoals,
    hasGoals,
  };
}
