import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { listProjects, listMyIssues, type Project, type Issue } from "../lib/api";
import IssueList from "../components/IssueList";

function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectList, issueList] = await Promise.all([
          listProjects(),
          listMyIssues(),
        ]);
        setProjects(projectList);
        setMyIssues(issueList);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
          <h2>我的待處理 Issue</h2>
          {myIssues.length === 0 ? (
            <p className="empty-state">目前沒有待處理的 Issue</p>
          ) : (
            <IssueList issues={myIssues} showProject />
          )}
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
