import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AppProvider, useApp } from "./contexts/AppContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectIssuesPage from "./pages/ProjectIssuesPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import IssueCreatePage from "./pages/IssueCreatePage";
import TimeEntryPage from "./pages/TimeEntryPage";
import SettingsPage from "./pages/SettingsPage";
import { NotificationProvider } from "./contexts/NotificationContext";
import { SearchProvider } from "./contexts/SearchContext";
import UpdateChecker from "./components/UpdateChecker";
import "./App.css";

function AppRoutes() {
  const { user, loading } = useApp();

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        {!user ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects/:projectId/issues" element={<ProjectIssuesPage />} />
            <Route path="/projects/:projectId/issues/new" element={<IssueCreatePage />} />
            <Route path="/issues/:issueId" element={<IssueDetailPage />} />
            <Route path="/issues/:issueId/time-entry" element={<TimeEntryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <NotificationProvider>
          <SearchProvider>
            <UpdateChecker />
            <AppRoutes />
          </SearchProvider>
        </NotificationProvider>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
