import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "../api/axiosClient";

export type Role = "admin" | "employee" | "executive";

interface AuthState {
  isAuthenticated: boolean;
  companyName: string | null;
  role: Role | null;
  userName: string | null;
  departmentId?: string | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: { name: string; email: string; password: string; companyName: string; region: string }) => Promise<any>;
  logout: () => void;
}

const emptyState: AuthState = {
  isAuthenticated: false,
  companyName: null,
  role: null,
  userName: null,
  departmentId: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(emptyState);
  // True until we've checked localStorage for an existing session. ProtectedRoute waits on this
  // so it doesn't redirect to /login before a valid stored session has had a chance to load.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed.token) {
            // Validate session with backend. This is crucial because the backend uses an
            // in-memory DB that gets wiped on restart, making old JWTs point to non-existent data.
            const res = await apiClient.get("/auth/me");
            setAuth({
              isAuthenticated: true,
              companyName: res.data.companyName,
              role: res.data.user.role,
              userName: res.data.user.name,
              departmentId: res.data.user.departmentId || null,
              token: parsed.token,
            });
          }
        } catch (error) {
          console.warn("Session validation failed, logging out.");
          localStorage.removeItem("auth");
          setAuth(emptyState);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const applyAuthResponse = (data: any) => {
    const newState: AuthState = {
      isAuthenticated: true,
      companyName: data.companyName,
      role: data.user.role,
      userName: data.user.name,
      departmentId: data.user.departmentId || null,
      token: data.token,
    };
    setAuth(newState);
    localStorage.setItem("auth", JSON.stringify(newState));
  };

  const login = async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    applyAuthResponse(res.data);
    return res.data; // expose user info to the caller
  };

  const register = async (data: { name: string; email: string; password: string; companyName: string; region: string }) => {
    const res = await apiClient.post("/auth/register", data);
    applyAuthResponse(res.data);
    return res.data; // expose user info to the caller
  };

  const logout = () => {
    setAuth(emptyState);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ ...auth, isLoading, login, register, logout }}>
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
