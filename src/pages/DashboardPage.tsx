import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getVersion } from "@tauri-apps/api/app";
import { listProjects, listMyIssues, type Project, type Issue } from "../lib/api";
import IssueList from "../components/IssueList";

function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"open" | "closed">("open");
  const [appVersion, setAppVersion] = useState("");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  useEffect(() => {
    getVersion().then(setAppVersion).catch(() => {});
  }, []);

  async function handleCheckUpdate() {
    setCheckingUpdate(true);
    setUpdateMsg(null);
    try {
      const checker = (window as unknown as Record<string, unknown>).__checkForUpdate as (() => Promise<{ available: boolean; version?: string; error?: string }>) | undefined;
      if (checker) {
        const result = await checker();
        if (result.error) {
          setUpdateMsg(result.error);
        } else if (!result.available) {
          setUpdateMsg("目前已是最新版本");
        }
        // 如果有更新，UpdateChecker 會自動顯示對話框
      }
    } catch {
      setUpdateMsg("無法檢查更新，請確認網路連線");
    } finally {
      setCheckingUpdate(false);
      setTimeout(() => setUpdateMsg(null), 3000);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectList, issueList] = await Promise.all([
          listProjects(),
          listMyIssues("open"),
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

  useEffect(() => {
    if (loading) return;
    setIssuesLoading(true);
    listMyIssues(tab)
      .then(setMyIssues)
      .catch((e) => setError(String(e)))
      .finally(() => setIssuesLoading(false));
  }, [tab]);

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
            <IssueList issues={myIssues} showProject />
          )}
        </section>
      </div>

      <div className="app-footer">
        <span className="app-version">v{appVersion}</span>
        <span className="footer-separator">·</span>
        <button
          className="check-update-link"
          onClick={handleCheckUpdate}
          disabled={checkingUpdate}
        >
          {checkingUpdate ? "檢查中..." : "檢查更新"}
        </button>
        {updateMsg && <span className="update-msg">{updateMsg}</span>}
      </div>
    </div>
  );
}

export default DashboardPage;
