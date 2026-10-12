import { Bot, LogOut, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

import { logout } from "@/actions/auth";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog/add-transaction-dialog";

import SidebarClient from "./SidebarClient";
import SidebarNavigation from "./SidebarNavigation";

const Sidebar = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200/80 bg-[#fbfdfc] px-3 py-4 dark:border-slate-800 dark:bg-slate-950 md:flex 2xl:w-72">
      <Link href="/" className="block">
        <div className="flex h-14 w-full items-center gap-3 border-b border-slate-200/70 px-2 pb-3 dark:border-slate-800">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-primary ring-1 ring-emerald-100">
            <Bot className="size-6" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            SaveMy<span className="text-primary">Money</span>
          </span>
        </div>
      </Link>

      <SidebarNavigation />

      <div className="mx-1 mt-8 flex max-w-full flex-col gap-1 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-100/80 via-emerald-50 to-white px-4 py-4 shadow-[0_12px_30px_-26px_rgba(5,150,105,0.8)] dark:border-emerald-900/70 dark:from-emerald-950/70 dark:via-slate-900 dark:to-slate-950">
        <h2 className="max-w-[90%] text-sm font-bold leading-6 text-emerald-950 dark:text-emerald-100">
          Build better money habits{" "}
        </h2>
        <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
          Keep your everyday money in view and moving toward your goals.
        </p>
        <Image
          src="/Wallet.svg"
          width={120}
          height={120}
          alt=""
          aria-hidden="true"
          className="mx-auto size-28 object-contain"
        />
        <AddTransactionDialog>
          <Button className="w-full gap-2 rounded-xl shadow-sm">
            <Plus className="size-4" />
            Add transaction
          </Button>
        </AddTransactionDialog>
      </div>

      <div className="mx-1 mt-auto max-w-full border-t border-slate-200 pt-4 dark:border-slate-800">
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-900"
          >
            <LogOut className="size-5" aria-hidden="true" />
            Sign out
          </Button>
        </form>
        <SidebarClient user={session?.user} />
      </div>
    </aside>
  );
};

export default Sidebar;
