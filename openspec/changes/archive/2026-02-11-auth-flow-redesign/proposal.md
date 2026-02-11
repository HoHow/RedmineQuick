## Why

目前的「設定連線」流程缺乏登入/登出概念——使用者無法從 Navbar 看到自己是誰，也沒有登出機制。重啟後雖然有 config 但 user 狀態為空。需要改造為完整的登入流程：自動驗證、顯示身份、支援登出。

## What Changes

- 將「測試連線」按鈕重新命名為「登入」，合併測試與儲存為一步操作
- 頁面標題從「Redmine 連線設定」改為「登入 Redmine」
- App 啟動時若有已儲存的 config，自動進行連線驗證（auto-login）
- 自動驗證成功 → 直接進入 Dashboard；失敗 → 導向登入頁面（pre-fill URL 與 API Key）
- Navbar 右側顯示已登入使用者的名稱，取代原本的「設定」按鈕
- 點擊使用者名稱 → 下拉選單（設定、登出）
- 登出 → 清除 user 狀態、導向登入頁面（config 保留在 disk 供下次快速登入）
- Route guard 從檢查 `config` 改為檢查 `user`

## Capabilities

### New Capabilities

（無新增）

### Modified Capabilities

- `redmine-connection`: 將「設定→測試→儲存」流程改為「登入」流程，新增自動驗證、登出功能、Navbar 使用者下拉選單

## Impact

- `src/contexts/AppContext.tsx` — 新增 auto-login 邏輯與 logout 函數
- `src/pages/SetupPage.tsx` — 重構為 LoginPage（登入頁面），合併測試+儲存
- `src/components/Layout.tsx` — Navbar 新增使用者名稱顯示與下拉選單
- `src/App.tsx` — Route guard 改為檢查 user 狀態
- `src/App.css` — 新增 user dropdown 樣式
