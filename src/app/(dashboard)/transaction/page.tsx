import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TransactionPage from "@/components/transactions/TransactionPage/TransactionPage";

export default async function TransactionRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main>
      <TransactionPage />
    </main>
  );
}
