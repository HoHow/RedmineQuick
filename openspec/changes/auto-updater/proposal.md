## Why

使用者安裝 App 後無法得知是否有新版本，每次更新都需要手動傳送安裝檔。透過 Tauri 內建的 updater 機制，App 可以自動檢查 GitHub Releases 上的最新版本，讓使用者一鍵更新。程式碼放在私有 repo，安裝檔發佈到另一個公開的 releases repo。

## What Changes

- 安裝 `tauri-plugin-updater`，設定 updater endpoint 指向公開 releases repo 的 GitHub Releases
- 產生 Tauri 更新簽署金鑰對（公鑰寫入 tauri.conf.json，私鑰存 GitHub Secrets）
- 更新 GitHub Actions workflow：build 時簽署安裝檔，完成後推送 release 到公開 repo
- 前端新增更新檢查邏輯：啟動時自動檢查 + 設定頁手動「檢查更新」按鈕
- 前端新增更新對話框：顯示新版本號、下載進度、[立即更新] / [稍後再說] 選項

## Capabilities

### New Capabilities

- `auto-update`: App 自動更新檢查、下載、安裝流程

### Modified Capabilities

（無）

## Impact

- `src-tauri/Cargo.toml` — 新增 `tauri-plugin-updater` 依賴
- `src-tauri/tauri.conf.json` — 新增 updater 設定（endpoint、公鑰）
- `src-tauri/capabilities/default.json` — 新增 updater 權限
- `src-tauri/src/lib.rs` — 註冊 updater plugin
- `src/components/UpdateChecker.tsx` — 更新檢查 + 對話框元件
- `src/App.tsx` — 掛載 UpdateChecker
- `src/pages/SettingsPage.tsx`（或現有頁面） — 手動檢查更新按鈕
- `.github/workflows/release.yml` — 新增簽署 + 推送到公開 repo
- `RELEASE.md` — 更新發版流程文件
