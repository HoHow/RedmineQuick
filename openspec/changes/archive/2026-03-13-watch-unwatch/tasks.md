## 1. 後端：使用專用 API 端點實作 watch/unwatch

- [x] 1.1 在 `src-tauri/src/redmine/client.rs` 新增 `add_watcher()` 和 `remove_watcher()` 方法
- [x] 1.2 在 `src-tauri/src/commands/issues.rs` 新增 `add_watcher` 和 `remove_watcher` Tauri commands，在 `src-tauri/src/lib.rs` 註冊

## 2. 前端：Watch/Unwatch 按鈕位置在 header

- [x] 2.1 在 `src/lib/api.ts` 新增 `addWatcher()` 和 `removeWatcher()` 函式
- [x] 2.2 在 `src/pages/IssueDetailPage.tsx` 實作 quick watch and unwatch issue：header 區塊新增 toggle 按鈕，利用 AppContext 的 user.id 判斷追蹤狀態，操作後更新 issue 資料
