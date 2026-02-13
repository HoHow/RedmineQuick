import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loadConfig, testConnection, type User, type RedmineConfig } from "../lib/api";

interface AppState {
  config: RedmineConfig | null;
  user: User | null;
  loading: boolean;
  setConfig: (config: RedmineConfig | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<RedmineConfig | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig()
      .then(async (cfg) => {
        setConfig(cfg);
        if (cfg && cfg.apiKey) {
          try {
            const u = await testConnection(cfg.url, cfg.apiKey);
            setUser(u);
          } catch {
            // auto-login failed, user stays null → redirect to login
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function logout() {
    setUser(null);
  }

  return (
    <AppContext.Provider value={{ config, user, loading, setConfig, setUser, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}
