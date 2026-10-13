import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserEntitlements } from "@/lib/subscriptions/entitlements";
import { getGoalsPageData } from "@/actions/goalsPage";
import { getTransactionPageData } from "@/actions/transactionPage";
import ReportsPage from "@/components/reports/ReportsPage";

export default async function ReportsRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const [entitlements, { allGoals }, { allTransactions }] = await Promise.all([
    getUserEntitlements(session.user.id),
    getGoalsPageData(),
    getTransactionPageData(),
  ]);

  return (
    <ReportsPage
      asOf={new Date()}
      hasAdvancedReports={entitlements.limits.hasAdvancedReports}
      hasExportReports={entitlements.limits.hasExportReports}
      tier={entitlements.tier}
      transactions={allTransactions.map(
        ({ id, title, category, type, amount, date }) => ({
          id,
          title,
          category,
          type,
          amount,
          date,
        }),
      )}
      goals={allGoals.map(({ id, title, targetAmount, currentAmount }) => ({
        id,
        title,
        targetAmount,
        currentAmount,
      }))}
    />
  );
}
