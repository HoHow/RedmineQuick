## 1. 建立 Issue 後返回列表

- [x] 1.1 修改 IssueCreatePage.handleSubmit，建立成功後導向回 `/projects/{projectId}/issues`

## 2. 繼續建立滾動到頂部

- [x] 2.1 修改 IssueForm，繼續建立成功後呼叫 `window.scrollTo(0, 0)`

## 3. Issue 列表 inline 狀態變更

- [x] 3.1 IssueList 新增 `statuses` 和 `onStatusChange` props
- [x] 3.2 狀態欄位改為 `<select>` 下拉選單，`e.stopPropagation()` 防止觸發行導航
- [x] 3.3 ProjectIssuesPage 傳入 statuses 和 onStatusChange callback（呼叫 updateIssue + 重新 fetch）
- [x] 3.4 DashboardPage 如有使用 IssueList，同樣傳入 statuses 和 onStatusChange

## 4. 樣式

- [x] 4.1 inline 狀態 select 的樣式（融入表格、不突兀）
