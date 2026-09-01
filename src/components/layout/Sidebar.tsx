"use client";
import {
  BicepsFlexed,
  Bot,
  Boxes,
  ChartColumn,
  House,
  LogOut,
  Plus,
  ReceiptText,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { AddTransactionDialog } from "../transactions/AddTransactionDialog/add-transaction-dialog";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
const sidebarItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Transactions",
    href: "/transaction",
    icon: ReceiptText,
  },
  {
    label: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: Boxes,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: ChartColumn,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="border-r w-70 h-screen flex-col sticky top-0 overflow-y-auto bg-white hidden md:flex">
      <Link href={"/"}>
        <div className="border-b w-full flex items-center justify-center py-5 h-17">
          <span className="text-primary font-bold flex gap-1 items-center text-lg">
            {" "}
            <Bot className="size-7 -rotate-7" /> SaveMyMoney
          </span>
        </div>
      </Link>
      <div className="flex flex-col items-start justify-center pt-4 px-4">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href} className="min-w-full">
            <Button
              className={`${pathname === item.href ? "text-primary bg-primary/15" : "text-muted-foreground bg-transparent"} w-full justify-start pl-4 hover:bg-primary/15 py-6`}
            >
              <item.icon className="size-5" />
              <span className="font-bold">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex flex-col border max-w-full px-4 mt-10 mx-2 bg-primary/5 rounded-md gap-1 py-4">
        <h1 className="text-primary font-bold text-lg max-w-[90%]">
          Build better money habits{" "}
          <BicepsFlexed className="text-yellow-500 inline -translate-y-1" />
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          Add your first transaction to see your progress
        </p>
        <span>
          <Image
            src={"/Wallet.svg"}
            width={170}
            height={170}
            alt="wallet"
            className="mx-auto"
          ></Image>
        </span>
        <AddTransactionDialog>
          <Button>
            <Plus />
            Add Transaction
          </Button>
        </AddTransactionDialog>
      </div>
      <div className="mx-2 max-w-full border-t mb-5 mt-auto pt-10 pl-2 border-gray-200">
        <Link href={"/"}>
          <Button
            className={
              "bg-transparent] text-muted-foreground hover:bg-primary/15 gap-2 text-md w-full justify-start font-semibold"
            }
          >
            <LogOut className="size-lg" /> Logout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
