"use client";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
const pageTitles = {
  dashboard: "Dashboard",
  transaction: "Transaction",
  goals: "Goals",
  categories: "Categories",
  reports: "Reports",
  settings: "Settings",
};

const Header = () => {
  const pathname = usePathname();
  const title = pageTitles[pathname.split("/")[1] as keyof typeof pageTitles];
  return (
    <div className="flex w-full py-5 bg-white border-b px-10 h-17 justify-between items-center sticky top-0">
      <span>
        <h1 className="font-bold text-xl">{title}</h1>
        <p
          className={`text-sm text-gray-500 mt-0.5  ${title === "Transaction" ? "block" : "hidden"}`}
        >
          {" "}
          Track and manange all your income and expenses.
        </p>
      </span>
      <div className="relative flex gap-3 justify-center items-center">
        <span>
          <Bell className="text-primary" />
        </span>
        <span className="absolute -top-3 left-3 bg-primary rounded-full px-1.5 py-0.5 text-xs text-white flex justify-center items-center">
          0
        </span>
        <div className="flex gap-3 justify-center items-center">
          <div>user avatar</div>
          <div>user.name</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
