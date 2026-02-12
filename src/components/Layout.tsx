import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useApp } from "../contexts/AppContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useApp();
  const isLoginPage = location.pathname === "/login";

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onUpdateAvailable() {
      setHasUpdate(true);
    }
    function onUpdateDismissed() {
      setHasUpdate(false);
    }
    // 檢查初始狀態
    if ((window as unknown as Record<string, unknown>).__updateAvailable) {
      setHasUpdate(true);
    }
    window.addEventListener("update-available", onUpdateAvailable);
    window.addEventListener("update-dismissed", onUpdateDismissed);
    return () => {
      window.removeEventListener("update-available", onUpdateAvailable);
      window.removeEventListener("update-dismissed", onUpdateDismissed);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      {!isLoginPage && (
        <header className="navbar">
          <h1 className="navbar-title" onClick={() => navigate("/")}>
            RedmineQuick
          </h1>
          <div className="navbar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title={theme === "light" ? "切換暗色模式" : "切換亮色模式"}>
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            {user && (
              <>
                <button
                  className="settings-button"
                  onClick={() => navigate("/settings")}
                  title="設定"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  {hasUpdate && <span className="settings-badge" />}
                </button>
                <div className="user-dropdown" ref={dropdownRef}>
                  <button
                    className="user-dropdown-trigger"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    {user.firstname} {user.lastname} ▾
                  </button>
                  {dropdownOpen && (
                    <div className="user-dropdown-menu">
                      <button className="user-dropdown-item" onClick={handleLogout}>
                        登出
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </header>
      )}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
