import { useState, useEffect } from "react";

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("rt_user");
    if (stored) {
      setUsername(stored);
    }
    setReady(true);
  }, []);

  const login = (user: string) => {
    localStorage.setItem("rt_user", user);
    setUsername(user);
    // Navigation handled declaratively by LoginRoute in App.tsx
  };

  const logout = () => {
    localStorage.removeItem("rt_user");
    setUsername(null);
    window.location.href = "/";
  };

  return { username, login, logout, isAuthenticated: !!username, ready };
}
