import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("invenai_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email: string, _password: string) => {
    const stored = localStorage.getItem("invenai_accounts");
    const accounts: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {};
    const account = accounts[email];
    if (!account) return false;
    if (account.password !== _password) return false;
    const u = { name: account.name, email };
    setUser(u);
    localStorage.setItem("invenai_user", JSON.stringify(u));
    return true;
  }, []);

  const signup = useCallback((name: string, email: string, password: string) => {
    if (!email || !password || password.length < 1) return false;
    const stored = localStorage.getItem("invenai_accounts");
    const accounts: Record<string, { name: string; password: string }> = stored ? JSON.parse(stored) : {};
    if (accounts[email]) return false;
    accounts[email] = { name: name || email.split("@")[0], password };
    localStorage.setItem("invenai_accounts", JSON.stringify(accounts));
    const u = { name: name || email.split("@")[0], email };
    setUser(u);
    localStorage.setItem("invenai_user", JSON.stringify(u));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("invenai_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
