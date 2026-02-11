import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { getVersion } from "@tauri-apps/api/app";
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
  const [appVersion, setAppVersion] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getVersion().then(setAppVersion);
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
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  {user.firstname} {user.lastname} ▾
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    {appVersion && (
                      <span className="user-dropdown-version">v{appVersion}</span>
                    )}
                    <button className="user-dropdown-item" onClick={handleLogout}>
                      登出
                    </button>
                  </div>
                )}
              </div>
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
