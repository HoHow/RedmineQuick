## Why

Redmine API Key 透過 HTTP Header 傳送，若使用者輸入 `http://` URL，API Key 會以明文在網路上傳輸，存在被攔截的風險。強制使用 HTTPS 可確保 API Key 在傳輸過程中被加密。

## What Changes

- 登入時驗證 URL 必須為 HTTPS，拒絕 HTTP 連線
- 無協議前綴的 URL 自動補上 `https://`

## Capabilities

### New Capabilities

（無新增 capability）

### Modified Capabilities

- `redmine-connection`: 新增 URL 協議驗證規則（強制 HTTPS）

## Impact

- `src/pages/LoginPage.tsx`：登入流程新增 URL 驗證邏輯
