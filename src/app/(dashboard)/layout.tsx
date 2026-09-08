import Header from "@/components/layout/Header/Header";
import Sidebar from "@/components/layout/Sidebar/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-background">
      <Sidebar />

      <div className="flex-1">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
