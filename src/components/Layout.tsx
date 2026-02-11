import { Outlet, useNavigate, useLocation } from "react-router";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSetupPage = location.pathname === "/setup";

  return (
    <div className="layout">
      {!isSetupPage && (
        <header className="navbar">
          <h1 className="navbar-title" onClick={() => navigate("/")}>
            RedmineQuick
          </h1>
          <button className="navbar-settings" onClick={() => navigate("/setup")}>
            設定
          </button>
        </header>
      )}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
