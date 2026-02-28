import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { listProjectIssues, listProjects, listStatuses, listPriorities, updateIssue, type Issue, type Project, type IdName } from "../lib/api";
import IssueList from "../components/IssueList";

function ProjectIssuesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [statuses, setStatuses] = useState<IdName[]>([]);
  const [priorities, setPriorities] = useState<IdName[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"open" | "closed" | "*">("open");

  useEffect(() => {
    async function fetchData() {
      if (!projectId) return;
      const pid = Number(projectId);
      try {
        const [issueList, projects, statusList, priorityList] = await Promise.all([
          listProjectIssues(pid, "open"),
          listProjects(),
          listStatuses(),
          listPriorities(),
        ]);
        setIssues(issueList);
        setStatuses(statusList);
        setPriorities(priorityList);
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
      const updated = await listProjectIssues(Number(projectId), statusFilter);
      setIssues(updated);
    } catch (e) {
      setIssues(original);
      setError(String(e));
    }
  }

  async function handlePriorityChange(issueId: number, priorityId: number) {
    const original = issues;
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, priority: { ...i.priority, id: priorityId, name: priorities.find((p) => p.id === priorityId)?.name ?? i.priority.name } } : i))
    );
    try {
      await updateIssue(issueId, { priority_id: priorityId });
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
          進行中
        </button>
        <button
          className={`filter-button ${statusFilter === "closed" ? "active" : ""}`}
          onClick={() => setStatusFilter("closed")}
        >
          已結束
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
        <IssueList issues={issues} showAssignee statuses={statuses} onStatusChange={handleStatusChange} priorities={priorities} onPriorityChange={handlePriorityChange} />
      )}
    </div>
  );
}

export default ProjectIssuesPage;
