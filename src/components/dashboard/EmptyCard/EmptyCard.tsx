import Image from "next/image";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";

const EmptyCard = () => {
  return (
    <section className="flex min-w-0 min-h-[360px] h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-emerald-50/70 p-6 text-center shadow-sm sm:p-8">
      <div className="rounded-3xl bg-white p-3 shadow-sm ring-1 ring-emerald-100">
        <Image src="/sorry.svg" height={150} width={150} alt="" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Nothing to show yet</h2>
        <p className="w-full max-w-sm text-sm leading-6 text-slate-600">
          Add your first transaction to see your balance, reports, and insights here.
        </p>
      </div>
      <AddTransactionDialog>
        <Button className="mt-1 rounded-xl px-5 text-white shadow-sm">
          <Plus /> Add transaction
        </Button>
      </AddTransactionDialog>
    </section>
  );
};

export default EmptyCard;
