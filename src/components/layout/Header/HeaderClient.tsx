"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const pageTitles = {
  dashboard: "Dashboard",
  transaction: "Transaction",
  goals: "Goals",
  categories: "Categories",
  reports: "Reports",
  settings: "Settings",
};

interface HeaderClientProps {
  user?: {
    name: string;
    email: string;
    image?: string | null;
  };
}

const HeaderClient = ({ user }: HeaderClientProps) => {
  const pathname = usePathname();

  const page = pathname.split("/")[1] || "dashboard";

  const title = pageTitles[page as keyof typeof pageTitles] || "Dashboard";

  return (
    <header className="flex w-full py-5 bg-white border-b px-10 h-17 justify-between items-center sticky top-0 z-50">
      {/* LEFT */}
      <div>
        <h1 className="font-bold text-xl">{title}</h1>

        {title === "Transaction" && (
          <p className="text-sm text-gray-500 mt-0.5">
            Track and manage all your income and expenses.
          </p>
        )}

        {title === "Goals" && (
          <p className="text-sm text-gray-500 mt-0.5">
            Track your progress and achieve your financial goals.
          </p>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative">
          <Bell className="text-primary" />

          <span className="absolute -top-3 -right-3 bg-primary rounded-full px-1.5 py-0.5 text-xs text-white flex justify-center items-center">
            0
          </span>
        </div>

        {/* USER */}
        {user && (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.image ?? ""} alt={user.name} />

              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:block">
              <p className="font-medium text-sm">{user.name}</p>

              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderClient;
