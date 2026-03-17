## Why

目前 app 缺少三個日常常用功能：
1. Watch/Unwatch 功能已實作，但沒有集中查看所有追蹤中 issue 的地方
2. Issue 列表無法排序，使用者難以快速找到優先或最近更新的 issue
3. 沒有瀏覽記錄，使用者需要手動搜尋才能回到之前看過的 issue

## What Changes

### A. 已追蹤 Issue 列表
- Dashboard「我的 Issue」panel 新增第三個 tab「追蹤中」
- 後端新增 `list_watched_issues` 查詢（Redmine `watcher_id=me`）
- 追蹤中 tab 不顯示統計卡片（卡片只對 open issues 有意義）

### B. Issue 列表排序
- IssueList 表頭可點擊排序
- 支援欄位：id、priority、status、updated_on
- 純前端排序（資料已載入），點一次升序、再點降序

### C. 最近瀏覽記錄
- Issue 詳情頁載入時，存入 localStorage（最多 10 筆，含 id、subject、project.name）
- SearchDialog 搜尋框為空時顯示「最近瀏覽」清單
- 點擊可直接導航到該 issue

## Capabilities

### New Capabilities

- `watched-issues`: Dashboard 顯示已追蹤 issue 列表
- `issue-sort`: Issue 列表欄位排序
- `recent-issues`: 最近瀏覽 issue 記錄

### Modified Capabilities

(none)

## Impact

- Affected specs: `watched-issues`（新增）、`issue-sort`（新增）、`recent-issues`（新增）
- Affected code:
  - `src-tauri/src/redmine/client.rs`
  - `src-tauri/src/commands/issues.rs`
  - `src-tauri/src/lib.rs`
  - `src/lib/api.ts`
  - `src/pages/DashboardPage.tsx`
  - `src/components/IssueList.tsx`
  - `src/components/SearchDialog.tsx`
  - `src/pages/IssueDetailPage.tsx`
  - `src/App.css`
