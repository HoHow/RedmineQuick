import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AppProvider, useApp } from "./contexts/AppContext";
import Layout from "./components/Layout";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectIssuesPage from "./pages/ProjectIssuesPage";
import "./App.css";

function Placeholder({ name }: { name: string }) {
  return <div>{name} - Coming soon</div>;
}

function AppRoutes() {
  const { config, loading } = useApp();

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/setup" element={<SetupPage />} />
        {!config ? (
          <Route path="*" element={<Navigate to="/setup" replace />} />
        ) : (
          <>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects/:projectId/issues" element={<ProjectIssuesPage />} />
            <Route path="/projects/:projectId/issues/new" element={<Placeholder name="IssueCreatePage" />} />
            <Route path="/issues/:issueId" element={<Placeholder name="IssueDetailPage" />} />
            <Route path="/issues/:issueId/time-entry" element={<Placeholder name="TimeEntryPage" />} />
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
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
