## 1. 篩選按鈕文字修改

- [x] 1.1 ProjectIssuesPage：「未關閉」→「進行中」、「已關閉」→「已結束」

## 2. Issue 列表 inline 優先權變更

- [x] 2.1 IssueList 新增 `priorities` 和 `onPriorityChange` props
- [x] 2.2 優先權欄位改為 `<select>` 下拉選單，`e.stopPropagation()` 防止觸發行導航
- [x] 2.3 ProjectIssuesPage fetch priorities，傳入 IssueList，實作 onPriorityChange（optimistic update + refetch）
- [x] 2.4 DashboardPage 同樣 fetch priorities，傳入 IssueList，實作 onPriorityChange（optimistic update + refetch）

## 3. 狀態變更後 refetch 列表

- [x] 3.1 ProjectIssuesPage 的 handleStatusChange：API 成功後 refetch listProjectIssues
- [x] 3.2 DashboardPage 的 handleStatusChange：API 成功後 refetch listMyIssues

## 4. 更新提示限定登入後

- [x] 4.1 UpdateChecker 使用 `useApp()` 取得 `user`，未登入時不檢查更新也不顯示提示

## 5. 樣式

- [x] 5.1 `.inline-status-select` 重命名為 `.inline-select`，IssueList 中同步更新 className
