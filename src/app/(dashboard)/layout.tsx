import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <SettingsProvider userId={session?.user.id ?? "local-user"}>
      <div data-dashboard-shell className="flex min-h-dvh w-full overflow-x-clip bg-slate-50 dark:bg-slate-950">
        <Sidebar />

        <div className="min-w-0 flex-1 overflow-x-clip">
          <Header />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </SettingsProvider>
  );
}
