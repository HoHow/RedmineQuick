## Context

目前 `LoginPage.tsx` 的 `handleLogin` 直接將使用者輸入的 URL 傳給 `testConnection`，沒有協議驗證。API Key 透過 `X-Redmine-API-Key` Header 傳送，HTTP 連線會導致明文洩漏。

## Goals / Non-Goals

**Goals:**
- 防止 API Key 透過 HTTP 明文傳輸

**Non-Goals:**
- 不在 Rust 後端重複驗證（前端即阻擋，後端不會收到 HTTP URL）
- 不支援 `http://localhost` 例外（開發環境可用 dev server）

## Decisions

### 在前端 LoginPage 驗證 URL 協議

在 `handleLogin` 中，呼叫 `testConnection` 前：
1. `url.trim()` 去除空白
2. 若不含 `https://` 或 `http://` 前綴 → 自動補 `https://`
3. 若為 `http://` → 設定錯誤訊息並 return

**替代方案：**
- 在 Rust `test_connection` command 驗證 → 多一層保護，但前端已阻擋，不必要
- 在 input onChange 即時驗證 → 使用者體驗不佳，打字中途就報錯

## Risks / Trade-offs

- [風險] 內網使用 HTTP 的 Redmine 無法連線 → 這是有意為之的安全限制，內網應部署 HTTPS
