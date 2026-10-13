"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { requireEntitlement } from "@/lib/subscriptions/entitlements";

export interface ExportReportResult {
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}

/**
 * Server-side export action strictly restricted to Premium users.
 */
export async function exportReportData(
  format: "csv" | "json" = "csv"
): Promise<ExportReportResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized." };
  }

  // Enforce server-side entitlement check
  const check = await requireEntitlement(session.user.id, "export_reports");
  if (!check.allowed) {
    return {
      success: false,
      error: check.reason ?? "Exporting reports requires a Premium plan.",
    };
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  const timestamp = new Date().toISOString().split("T")[0];

  if (format === "json") {
    return {
      success: true,
      data: JSON.stringify(transactions, null, 2),
      filename: `savemymoney-transactions-${timestamp}.json`,
    };
  }

  // Generate CSV
  const headersRow = "ID,Title,Type,Category,Amount,Date,Description\n";
  const rows = transactions.map((t) => {
    const cleanDesc = (t.description || "").replace(/"/g, '""');
    const cleanTitle = t.title.replace(/"/g, '""');
    const dateStr = t.date.toISOString().split("T")[0];
    return `"${t.id}","${cleanTitle}","${t.type}","${t.category}",${t.amount},"${dateStr}","${cleanDesc}"`;
  });

  return {
    success: true,
    data: headersRow + rows.join("\n"),
    filename: `savemymoney-report-${timestamp}.csv`,
  };
}
