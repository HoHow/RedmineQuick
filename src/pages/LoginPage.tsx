import { useState } from "react";
import { useNavigate } from "react-router";
import { testConnection, saveConfig } from "../lib/api";
import { useApp } from "../contexts/AppContext";

const REMEMBERED_URL_KEY = "rememberedRedmineUrl";

function LoginPage() {
  const { config, setConfig, setUser } = useApp();
  const navigate = useNavigate();

  const savedUrl = localStorage.getItem(REMEMBERED_URL_KEY);
  const [url, setUrl] = useState(config?.url ?? savedUrl ?? "");
  const [apiKey, setApiKey] = useState("");
  const [rememberUrl, setRememberUrl] = useState(savedUrl !== null);
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleUrlChange(newUrl: string) {
    setUrl(newUrl);
    if (rememberUrl) {
      localStorage.setItem(REMEMBERED_URL_KEY, newUrl);
    }
  }

  function handleRememberToggle(checked: boolean) {
    setRememberUrl(checked);
    if (checked) {
      localStorage.setItem(REMEMBERED_URL_KEY, url);
    } else {
      localStorage.removeItem(REMEMBERED_URL_KEY);
    }
  }

  async function handleLogin() {
    setLogging(true);
    setError(null);

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
      setUrl(finalUrl);
      if (rememberUrl) localStorage.setItem(REMEMBERED_URL_KEY, finalUrl);
    }
    if (/^http:\/\//i.test(finalUrl)) {
      setError("基於安全考量，僅支援 HTTPS 連線");
      setLogging(false);
      return;
    }

    try {
      const user = await testConnection(finalUrl, apiKey);
      await saveConfig(finalUrl, apiKey);
      setConfig({ url: finalUrl, apiKey });
      setUser(user);
      navigate("/");
    } catch (e) {
      setError(String(e));
    } finally {
      setLogging(false);
    }
  }

  return (
    <div className="setup-page">
      <h2>登入 Redmine</h2>

      <div className="form-group">
        <label htmlFor="url">Redmine URL</label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://redmine.example.com"
        />
        <label className="remember-url-label">
          <input
            type="checkbox"
            checked={rememberUrl}
            onChange={(e) => handleRememberToggle(e.target.checked)}
          />
          記住 Redmine URL
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="apiKey">API Key</label>
        <input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="輸入你的 API Key"
        />
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={handleLogin} disabled={logging || !url || !apiKey}>
          {logging ? "登入中..." : "登入"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default LoginPage;
