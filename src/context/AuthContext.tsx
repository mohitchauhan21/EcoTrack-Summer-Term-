import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Role = "superadmin" | "admin" | "employee" | "executive";

interface AuthState {
  isAuthenticated: boolean;
  companyName: string | null;
  role: Role | null;
  userName: string | null;
  departmentId?: string | null;
}

interface AuthContextType extends AuthState {
  isLoading: boolean;
  login: (data: { companyName: string, role: Role, userName: string, departmentId?: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    companyName: null,
    role: null,
    userName: null,
  });
  // Tracks whether we've finished checking localStorage for an existing session.
  // Without this, ProtectedRoute would see isAuthenticated=false on the very
  // first render (before the effect below runs) and redirect to /login even
  // when a valid session exists in localStorage.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = (data: { companyName: string, role: Role, userName: string, departmentId?: string }) => {
    const newState = { isAuthenticated: true, ...data };
    setAuth(newState);
    localStorage.setItem("auth", JSON.stringify(newState));
  };

  const logout = () => {
    const newState = { isAuthenticated: false, companyName: null, role: null, userName: null, departmentId: null };
    setAuth(newState);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ ...auth, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
