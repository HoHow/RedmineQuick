import { useState } from "react";
import { useNavigate } from "react-router";
import { testConnection, saveConfig } from "../lib/api";
import { useApp } from "../contexts/AppContext";

function LoginPage() {
  const { config, setConfig, setUser } = useApp();
  const navigate = useNavigate();

  const [url, setUrl] = useState(config?.url ?? "");
  const [apiKey, setApiKey] = useState(config?.apiKey ?? "");
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLogging(true);
    setError(null);

    try {
      const user = await testConnection(url, apiKey);
      await saveConfig(url, apiKey);
      setConfig({ url, apiKey });
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
          list="url-options"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://redmine.example.com"
        />
        <datalist id="url-options">
          <option value="https://your-redmine.example.com/" />
        </datalist>
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
