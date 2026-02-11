import { useState } from "react";
import { useNavigate } from "react-router";
import { testConnection, saveConfig, type User } from "../lib/api";
import { useApp } from "../contexts/AppContext";

function SetupPage() {
  const { config, setConfig, setUser } = useApp();
  const navigate = useNavigate();

  const [url, setUrl] = useState(config?.url ?? "");
  const [apiKey, setApiKey] = useState(config?.apiKey ?? "");
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testedUser, setTestedUser] = useState<User | null>(null);

  async function handleTest() {
    setTesting(true);
    setError(null);
    setTestedUser(null);

    try {
      const user = await testConnection(url, apiKey);
      setTestedUser(user);
    } catch (e) {
      setError(String(e));
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    try {
      await saveConfig(url, apiKey);
      setConfig({ url, apiKey });
      if (testedUser) {
        setUser(testedUser);
      }
      navigate("/");
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div className="setup-page">
      <h2>Redmine 連線設定</h2>

      <div className="form-group">
        <label htmlFor="url">Redmine URL</label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://redmine.example.com"
        />
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
        <button onClick={handleTest} disabled={testing || !url || !apiKey}>
          {testing ? "測試中..." : "測試連線"}
        </button>

        {testedUser && (
          <button onClick={handleSave}>
            儲存並進入
          </button>
        )}
      </div>

      {testedUser && (
        <div className="success-message">
          連線成功！目前使用者：{testedUser.firstname} {testedUser.lastname}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default SetupPage;
