import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/services/authService";
import type { User, LoginRequest, RegisterRequest } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error("Failed to refresh user:", err);
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        let token = localStorage.getItem("accessToken");

        if (!token) {
          const res = await authService.refreshToken();
          token = res.accessToken;
          localStorage.setItem("accessToken", token);
        }

        if (token) await refreshUser();
      } catch (err) {
        console.warn("No valid session:", err);
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      await authService.login(data);
      await refreshUser();
      toast({ title: "Success", description: "Logged in successfully" });
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authService.register(data);
      toast({
        title: "Success",
        description: "Registration successful! Please verify your email.",
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast({ title: "Success", description: "Logged out successfully" });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
