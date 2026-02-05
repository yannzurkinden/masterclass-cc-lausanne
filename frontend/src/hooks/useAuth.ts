import { useState, useEffect, useCallback } from "react";
import { auth, type User } from "@/lib/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const me = await auth.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    const me = await auth.login({ email, password });
    setUser(me as User);
  };

  const register = async (email: string, password: string, name: string) => {
    const me = await auth.register({ email, password, name });
    setUser(me as User);
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return { user, loading, login, register, logout };
}
