import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import "./App.css";

function Placeholder({ name }: { name: string }) {
  return <div>{name} - Coming soon</div>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/setup" element={<Placeholder name="SetupPage" />} />
          <Route path="/" element={<Placeholder name="DashboardPage" />} />
          <Route path="/projects/:projectId/issues" element={<Placeholder name="ProjectIssuesPage" />} />
          <Route path="/projects/:projectId/issues/new" element={<Placeholder name="IssueCreatePage" />} />
          <Route path="/issues/:issueId" element={<Placeholder name="IssueDetailPage" />} />
          <Route path="/issues/:issueId/time-entry" element={<Placeholder name="TimeEntryPage" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
