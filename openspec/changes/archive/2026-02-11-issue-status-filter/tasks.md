## 1. Rust 端 API 參數化

- [x] 1.1 `list_my_issues` 新增 `status: String` 參數，取代寫死的 `"open"`
- [x] 1.2 `list_project_issues` 新增 `status: String` 參數，傳給 Redmine API `status_id`

## 2. TypeScript API 對應

- [x] 2.1 `listMyIssues` 新增 `status` 參數
- [x] 2.2 `listProjectIssues` 新增 `status` 參數

## 3. Dashboard tab 切換

- [x] 3.1 DashboardPage 新增 `tab` state（"open" | "closed"），預設 "open"
- [x] 3.2 根據 tab 呼叫 `listMyIssues(status)`，切換時重新載入
- [x] 3.3 新增 tab 切換 UI（「待處理」「已完成」），標題改為「我的 Issue」

## 4. 專案 Issue 列表篩選

- [x] 4.1 ProjectIssuesPage 新增 `statusFilter` state（"open" | "closed" | "*"），預設 "open"
- [x] 4.2 根據 statusFilter 呼叫 `listProjectIssues(projectId, status)`，切換時重新載入
- [x] 4.3 新增篩選按鈕 UI（「未關閉」「已關閉」「全部」）

## 5. 樣式

- [x] 5.1 新增 tab 和 filter button group 的 CSS 樣式（active 狀態、hover、亮暗主題相容）
