## 1. 一次性設定：簽署金鑰

- [x] 1.1 使用 `tauri signer generate` 產生更新簽署金鑰對，記錄公鑰
- [x] 1.2 將私鑰和密碼存為 GitHub Secrets（`TAURI_SIGNING_PRIVATE_KEY`、`TAURI_SIGNING_PRIVATE_KEY_PASSWORD`）
- [x] 1.3 在 GitHub 上建立公開 repo `RedmineQuick-releases`
- [x] 1.4 建立 fine-grained Personal Access Token（只授權公開 repo），存為 GitHub Secret `RELEASE_REPO_TOKEN`

## 2. Tauri updater plugin 設定

- [x] 2.1 `Cargo.toml` 新增 `tauri-plugin-updater = "2"` 依賴
- [x] 2.2 `npm install @tauri-apps/plugin-updater`
- [x] 2.3 `tauri.conf.json` 新增 `plugins.updater` 設定（endpoints、pubkey）
- [x] 2.4 `src-tauri/capabilities/default.json` 新增 updater 權限
- [x] 2.5 `src-tauri/src/lib.rs` 註冊 `tauri_plugin_updater::init()`

## 3. GitHub Actions 更新

- [x] 3.1 `release.yml` 新增 `TAURI_SIGNING_PRIVATE_KEY` 和 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` 環境變數
- [x] 3.2 新增 build 完成後推送 release assets 到公開 repo 的步驟

## 4. 前端更新元件

- [x] 4.1 新增 `src/components/UpdateChecker.tsx`：啟動時自動檢查更新，管理更新狀態（updateAvailable、downloading、progress、error）
- [x] 4.2 更新對話框 UI：顯示新版本號、下載進度條、「立即更新」/「稍後再說」按鈕、錯誤訊息
- [x] 4.3 `src/App.tsx` 掛載 UpdateChecker 元件

## 5. 手動檢查更新

- [x] 5.1 DashboardPage 底部新增版本號顯示（使用 `getVersion()` API）
- [x] 5.2 DashboardPage 底部新增「檢查更新」連結，觸發與自動檢查相同的邏輯

## 6. 樣式

- [x] 6.1 更新對話框樣式（modal overlay、進度條、按鈕）
- [x] 6.2 DashboardPage 底部版本資訊樣式
