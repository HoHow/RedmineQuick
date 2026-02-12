import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getVersion } from "@tauri-apps/api/app";

interface Release {
  tag_name: string;
  published_at: string;
  body: string;
}

function SettingsPage() {
  const navigate = useNavigate();
  const [appVersion, setAppVersion] = useState("");
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [releasesLoading, setReleasesLoading] = useState(true);
  const [releasesError, setReleasesError] = useState<string | null>(null);

  useEffect(() => {
    getVersion().then(setAppVersion).catch(() => {});
  }, []);

  useEffect(() => {
    async function fetchReleases() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/HoHow/RedmineQuick-releases/releases"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Release[] = await res.json();
        setReleases(data);
      } catch {
        setReleasesError("無法載入更新紀錄");
      } finally {
        setReleasesLoading(false);
      }
    }
    fetchReleases();
  }, []);

  async function handleCheckUpdate() {
    setCheckingUpdate(true);
    setUpdateMsg(null);
    try {
      const checker = (window as unknown as Record<string, unknown>)
        .__checkForUpdate as
        | (() => Promise<{
            available: boolean;
            version?: string;
            error?: string;
          }>)
        | undefined;
      if (checker) {
        const result = await checker();
        if (result.error) {
          setUpdateMsg(result.error);
        } else if (!result.available) {
          setUpdateMsg("目前已是最新版本");
        }
      }
    } catch {
      setUpdateMsg("無法檢查更新，請確認網路連線");
    } finally {
      setCheckingUpdate(false);
      setTimeout(() => setUpdateMsg(null), 3000);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h2>設定</h2>
      </div>

      <section className="settings-section">
        <div className="settings-version-row">
          <span className="settings-version-label">目前版本</span>
          <span className="settings-version-value">v{appVersion}</span>
          <button
            className="settings-check-update"
            onClick={handleCheckUpdate}
            disabled={checkingUpdate}
          >
            {checkingUpdate ? "檢查中..." : "檢查更新"}
          </button>
        </div>
        {updateMsg && <div className="settings-update-msg">{updateMsg}</div>}
      </section>

      <section className="settings-section">
        <h3>更新紀錄</h3>
        {releasesLoading ? (
          <div className="loading">載入中...</div>
        ) : releasesError ? (
          <div className="error-message">{releasesError}</div>
        ) : releases.length === 0 ? (
          <p className="empty-state">目前沒有更新紀錄</p>
        ) : (
          <div className="release-list">
            {releases.map((release) => (
              <div key={release.tag_name} className="release-item">
                <div className="release-header">
                  <span className="release-version">{release.tag_name}</span>
                  <span className="release-date">
                    {formatDate(release.published_at)}
                  </span>
                </div>
                {release.body && (
                  <pre className="release-body">{release.body}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SettingsPage;
