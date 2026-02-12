## Why

目前版本號和檢查更新放在 DashboardPage 底部，不夠明顯。需要一個獨立的設定頁面，集中版本資訊、更新功能和更新紀錄。同時在 navbar 加入齒輪入口，有新版本時以紅點提示。

## What Changes

- Layout navbar 右側新增齒輪圖示，點擊導向設定頁面
- 有可用更新時，齒輪旁顯示紅點提示
- 新增 SettingsPage（`/settings`）：顯示目前版本、檢查更新按鈕、更新紀錄
- 更新紀錄從公開 repo 的 GitHub Releases API 拉取
- 移除 DashboardPage 底部的版本號和檢查更新連結
- 更新狀態（是否有新版本）改用 window 全域變數共享給 Layout 顯示紅點

## Capabilities

### New Capabilities

- `settings`: 設定頁面，包含版本資訊、更新功能、更新紀錄

### Modified Capabilities

- `auto-update`: 將更新檢查入口從 DashboardPage 移至 SettingsPage，新增齒輪紅點提示

## Impact

- `src/components/Layout.tsx` — navbar 新增齒輪圖示 + 紅點
- `src/pages/SettingsPage.tsx` — 新增設定頁面
- `src/pages/DashboardPage.tsx` — 移除底部版本號和檢查更新
- `src/components/UpdateChecker.tsx` — 共享更新狀態給 Layout
- `src/App.tsx` — 新增 `/settings` 路由
- `src/App.css` — 設定頁面與齒輪紅點樣式
