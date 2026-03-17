## Context

RedmineQuick 的 Dashboard 已有「待處理」「已完成」兩個 tab，IssueList 元件被 DashboardPage 和 ProjectIssuesPage 共用。SearchDialog 以 Cmd+K 開啟，支援 ID 跳轉和全文搜尋。

## Goals / Non-Goals

**Goals:**

- Dashboard 新增「追蹤中」tab 顯示 watched issues
- IssueList 支援點擊表頭排序
- SearchDialog 在空白搜尋時顯示最近瀏覽記錄

**Non-Goals:**

- 不做伺服器端排序
- 不做持久化的排序偏好設定
- 不做 ProjectIssuesPage 的追蹤 tab（只在 Dashboard）

## Decisions

### A. 已追蹤 Issue 列表

**後端**：在 `RedmineClient` 新增 `list_watched_issues()`，使用 `list_issues(&[("watcher_id", "me")])` 查詢。新增對應的 Tauri command 和前端 API 函式。

**前端**：DashboardPage 的 tab 從 `"open" | "closed"` 擴展為 `"open" | "closed" | "watched"`。切換到 `watched` 時呼叫 `listWatchedIssues()`。統計卡片僅在 `tab === "open"` 時顯示（維持現有行為）。

### B. Issue 列表排序

**排序欄位與鍵值**：

| 欄位 | 排序鍵 | 型別 |
|------|--------|------|
| # | `id` | 數字 |
| 優先權 | `priority.id` | 數字 |
| 狀態 | `status.name` | 字串 |
| 更新日期 | `updated_on` | 日期字串（ISO） |

**排序邏輯**：IssueList 內部管理 `sortKey` 和 `sortDir` state。點擊表頭：同一欄位切換升降序，不同欄位預設升序。排序在 render 時對 `issues` 做 `[...issues].sort()`，不修改原始陣列。

**表頭指示器**：當前排序欄位顯示 ▲ 或 ▼。

**新增「更新日期」欄位**：IssueList 新增一個固定顯示的「更新」欄位，顯示相對時間（如「2小時前」「3天前」），讓排序結果直觀可見。

### C. 最近瀏覽記錄

**儲存**：在 `IssueDetailPage` 的 `fetchIssue` 成功後，將 `{ id, subject, projectName }` 存入 localStorage key `recent-issues`。最多 10 筆，新的在前，重複 ID 移到最前。

**顯示**：`SearchDialog` 在 `query` 為空且有最近瀏覽記錄時，顯示「最近瀏覽」清單，取代空白狀態。點擊直接導航。

**清理**：登出時不清理（瀏覽記錄不含敏感資訊，且方便重新登入後使用）。

## Risks / Trade-offs

- **前端排序限制**：Redmine API 有分頁（預設 25 筆），前端排序只能排已載入的資料。對大多數使用者來說夠用，因為「我的 Issue」和「專案 Issue」通常不超過百筆。
- **updated_on 可能為 null**：排序時 null 值排到最後。
