import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ContactsPage } from "@/pages/ContactsPage";

export default function App() {
  const { user, loading, login, register, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage user={user} onLogin={login} />} />
        <Route
          path="/register"
          element={<RegisterPage user={user} onRegister={register} />}
        />
        <Route element={<DashboardLayout user={user} loading={loading} onLogout={logout} />}>
          <Route path="/dashboard" element={<DashboardPage user={user!} />} />
          <Route path="/contacts" element={<ContactsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
