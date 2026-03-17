## 1. 後端：已追蹤 Issue 查詢

- [x] 1.1 在 `src-tauri/src/redmine/client.rs` 新增 `list_watched_issues()` 方法（使用 `watcher_id=me` 查詢）
- [x] 1.2 在 `src-tauri/src/commands/issues.rs` 新增 `list_watched_issues` Tauri command，在 `src-tauri/src/lib.rs` 註冊

## 2. 前端：已追蹤 Issue 列表，display watched issues on dashboard

- [x] 2.1 在 `src/lib/api.ts` 新增 `listWatchedIssues()` 函式
- [x] 2.2 在 `src/pages/DashboardPage.tsx` 新增「追蹤中」tab，切換時呼叫 `listWatchedIssues()`，統計卡片僅在 open tab 顯示

## 3. 前端：Issue 列表排序，sort issue list by column header

- [x] 3.1 在 `src/components/IssueList.tsx` 新增排序邏輯（sortKey / sortDir state）、可點擊表頭含排序指示器（▲▼）、新增「更新」欄位顯示相對時間
- [x] 3.2 在 `src/App.css` 新增排序表頭與更新欄位樣式

## 4. 前端：最近瀏覽記錄，track and display recently viewed issues

- [x] 4.1 在 `src/pages/IssueDetailPage.tsx` 的 `fetchIssue` 成功後，將 issue 資訊存入 localStorage `recent-issues`（最多 10 筆）
- [x] 4.2 在 `src/components/SearchDialog.tsx` query 為空時顯示「最近瀏覽」清單，點擊導航至 issue
