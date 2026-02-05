import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { User } from "@/lib/api";

export function DashboardLayout({
  user,
  onLogout,
}: {
  user: User | null;
  loading: boolean;
  onLogout: () => void;
}) {
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
