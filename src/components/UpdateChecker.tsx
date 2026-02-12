import { useState, useEffect, useCallback } from "react";
import { check, Update } from "@tauri-apps/plugin-updater";

interface UpdateState {
  available: boolean;
  version: string;
  downloading: boolean;
  progress: number;
  error: string | null;
  dismissed: boolean;
}

function UpdateChecker() {
  const [state, setState] = useState<UpdateState>({
    available: false,
    version: "",
    downloading: false,
    progress: 0,
    error: null,
    dismissed: false,
  });
  const [update, setUpdate] = useState<Update | null>(null);

  const checkForUpdate = useCallback(async () => {
    try {
      const result = await check();
      if (result) {
        setState((s) => ({
          ...s,
          available: true,
          version: result.version,
          error: null,
          dismissed: false,
        }));
        setUpdate(result);
        (window as unknown as Record<string, unknown>).__updateAvailable = true;
        window.dispatchEvent(new Event("update-available"));
      }
      return result;
    } catch {
      // 啟動時靜默忽略錯誤
      return null;
    }
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  // 暴露 checkForUpdate 給外部使用（手動檢查）
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__checkForUpdate = async () => {
      setState((s) => ({ ...s, error: null }));
      try {
        const result = await check();
        if (result) {
          setState((s) => ({
            ...s,
            available: true,
            version: result.version,
            error: null,
            dismissed: false,
          }));
          setUpdate(result);
          (window as unknown as Record<string, unknown>).__updateAvailable = true;
          window.dispatchEvent(new Event("update-available"));
          return { available: true, version: result.version };
        }
        return { available: false };
      } catch {
        return { available: false, error: "無法檢查更新，請確認網路連線" };
      }
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__checkForUpdate;
    };
  }, []);

  async function handleUpdate() {
    if (!update) return;
    setState((s) => ({ ...s, downloading: true, error: null, progress: 0 }));
    try {
      let downloaded = 0;
      let contentLength = 0;
      await update.downloadAndInstall((event) => {
        if (event.event === "Started" && event.data.contentLength) {
          contentLength = event.data.contentLength;
        } else if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          if (contentLength > 0) {
            setState((s) => ({
              ...s,
              progress: Math.round((downloaded / contentLength) * 100),
            }));
          }
        } else if (event.event === "Finished") {
          setState((s) => ({ ...s, progress: 100 }));
        }
      });
      // 安裝完成後重啟（Tauri 會自動處理）
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("Update failed:", msg);
      setState((s) => ({
        ...s,
        downloading: false,
        error: `更新失敗：${msg}`,
      }));
    }
  }

  function handleDismiss() {
    setState((s) => ({ ...s, dismissed: true }));
    (window as unknown as Record<string, unknown>).__updateAvailable = false;
    window.dispatchEvent(new Event("update-dismissed"));
  }

  if (!state.available || state.dismissed) return null;

  return (
    <div className="update-overlay">
      <div className="update-dialog">
        <h3>有新版本可用</h3>
        <p className="update-version">v{state.version}</p>

        {state.error && <div className="update-error">{state.error}</div>}

        {state.downloading ? (
          <div className="update-progress">
            <div className="update-progress-bar">
              <div
                className="update-progress-fill"
                style={{ width: `${state.progress}%` }}
              />
            </div>
            <span className="update-progress-text">{state.progress}%</span>
          </div>
        ) : (
          <div className="update-actions">
            <button className="btn-primary" onClick={handleUpdate}>
              立即更新
            </button>
            <button className="btn-secondary" onClick={handleDismiss}>
              稍後再說
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UpdateChecker;
