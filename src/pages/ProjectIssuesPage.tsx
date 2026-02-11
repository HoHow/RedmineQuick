import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { listProjectIssues, listProjects, type Issue, type Project } from "../lib/api";
import IssueList from "../components/IssueList";

function ProjectIssuesPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!projectId) return;
      const pid = Number(projectId);
      try {
        const [issueList, projects] = await Promise.all([
          listProjectIssues(pid),
          listProjects(),
        ]);
        setIssues(issueList);
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

      {issues.length === 0 ? (
        <p className="empty-state">此專案目前沒有 Issue</p>
      ) : (
        <IssueList issues={issues} />
      )}
    </div>
  );
}

export default ProjectIssuesPage;
