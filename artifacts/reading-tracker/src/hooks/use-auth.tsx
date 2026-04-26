import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("rt_user");
    if (stored) {
      setUsername(stored);
    }
  }, []);

  const login = (user: string) => {
    localStorage.setItem("rt_user", user);
    setUsername(user);
    setLocation("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("rt_user");
    setUsername(null);
    setLocation("/login");
  };

  return { username, login, logout, isAuthenticated: !!username };
}
