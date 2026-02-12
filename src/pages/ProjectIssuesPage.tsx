import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { listProjectIssues, listProjects, listStatuses, updateIssue, type Issue, type Project, type IdName } from "../lib/api";
import IssueList from "../components/IssueList";

function ProjectIssuesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [statuses, setStatuses] = useState<IdName[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"open" | "closed" | "*">("open");

  useEffect(() => {
    async function fetchData() {
      if (!projectId) return;
      const pid = Number(projectId);
      try {
        const [issueList, projects, statusList] = await Promise.all([
          listProjectIssues(pid, "open"),
          listProjects(),
          listStatuses(),
        ]);
        setIssues(issueList);
        setStatuses(statusList);
        const found = projects.find((p) => p.id === pid);
        setProject(found ?? null);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (loading || !projectId) return;
    setIssuesLoading(true);
    listProjectIssues(Number(projectId), statusFilter)
      .then(setIssues)
      .catch((e) => setError(String(e)))
      .finally(() => setIssuesLoading(false));
  }, [statusFilter]);

  async function handleStatusChange(issueId: number, statusId: number) {
    const original = issues;
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: { ...i.status, id: statusId, name: statuses.find((s) => s.id === statusId)?.name ?? i.status.name } } : i))
    );
    try {
      await updateIssue(issueId, { status_id: statusId });
    } catch (e) {
      setIssues(original);
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
    <div className="project-issues-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← 返回
        </button>
        <h2>{project?.name ?? `專案 #${projectId}`}</h2>
        <button
          className="primary-button"
          onClick={() => navigate(`/projects/${projectId}/issues/new`)}
        >
          新增 Issue
        </button>
      </div>

      <div className="filter-group">
        <button
          className={`filter-button ${statusFilter === "open" ? "active" : ""}`}
          onClick={() => setStatusFilter("open")}
        >
          未關閉
        </button>
        <button
          className={`filter-button ${statusFilter === "closed" ? "active" : ""}`}
          onClick={() => setStatusFilter("closed")}
        >
          已關閉
        </button>
        <button
          className={`filter-button ${statusFilter === "*" ? "active" : ""}`}
          onClick={() => setStatusFilter("*")}
        >
          全部
        </button>
      </div>

      {issuesLoading ? (
        <div className="loading">載入中...</div>
      ) : issues.length === 0 ? (
        <p className="empty-state">此專案目前沒有 Issue</p>
      ) : (
        <IssueList issues={issues} statuses={statuses} onStatusChange={handleStatusChange} />
      )}
    </div>
  );
}

export default ProjectIssuesPage;
