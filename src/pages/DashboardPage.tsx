import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { listProjects, listMyIssues, listStatuses, listPriorities, updateIssue, type Project, type Issue, type IdName } from "../lib/api";
import IssueList from "../components/IssueList";

function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [statuses, setStatuses] = useState<IdName[]>([]);
  const [priorities, setPriorities] = useState<IdName[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"open" | "closed">("open");

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectList, issueList, statusList, priorityList] = await Promise.all([
          listProjects(),
          listMyIssues("open"),
          listStatuses(),
          listPriorities(),
        ]);
        setProjects(projectList);
        setMyIssues(issueList);
        setStatuses(statusList);
        setPriorities(priorityList);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    setIssuesLoading(true);
    listMyIssues(tab)
      .then(setMyIssues)
      .catch((e) => setError(String(e)))
      .finally(() => setIssuesLoading(false));
  }, [tab]);

  async function handleStatusChange(issueId: number, statusId: number) {
    const original = myIssues;
    setMyIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: { ...i.status, id: statusId, name: statuses.find((s) => s.id === statusId)?.name ?? i.status.name } } : i))
    );
    try {
      await updateIssue(issueId, { status_id: statusId });
      const updated = await listMyIssues(tab);
      setMyIssues(updated);
    } catch (e) {
      setMyIssues(original);
      setError(String(e));
    }
  }

  async function handlePriorityChange(issueId: number, priorityId: number) {
    const original = myIssues;
    setMyIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, priority: { ...i.priority, id: priorityId, name: priorities.find((p) => p.id === priorityId)?.name ?? i.priority.name } } : i))
    );
    try {
      await updateIssue(issueId, { priority_id: priorityId });
    } catch (e) {
      setMyIssues(original);
      setError(String(e));
    }
  }

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-panels">
        <section className="panel">
          <h2>我的專案</h2>
          {projects.length === 0 ? (
            <p className="empty-state">目前沒有所屬專案</p>
          ) : (
            <ul className="project-list">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="project-item"
                  onClick={() => navigate(`/projects/${project.id}/issues`)}
                >
                  <span className="project-name">{project.name}</span>
                  <span className="project-id">{project.identifier}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>我的 Issue</h2>
          <div className="tab-group">
            <button
              className={`tab-button ${tab === "open" ? "active" : ""}`}
              onClick={() => setTab("open")}
            >
              待處理
            </button>
            <button
              className={`tab-button ${tab === "closed" ? "active" : ""}`}
              onClick={() => setTab("closed")}
            >
              已完成
            </button>
          </div>
          {issuesLoading ? (
            <div className="loading">載入中...</div>
          ) : myIssues.length === 0 ? (
            <p className="empty-state">
              {tab === "open" ? "目前沒有待處理的 Issue" : "目前沒有已完成的 Issue"}
            </p>
          ) : (
            <IssueList issues={myIssues} showProject statuses={statuses} onStatusChange={handleStatusChange} priorities={priorities} onPriorityChange={handlePriorityChange} />
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
