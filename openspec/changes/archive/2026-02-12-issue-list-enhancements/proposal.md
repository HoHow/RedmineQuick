## Why

Issue 列表改了狀態後 UI 只做 optimistic update，沒有重新 fetch 列表（可能導致篩選狀態不一致）。篩選按鈕的文字「未關閉/已關閉」不夠直覺。優先權欄位是純文字，無法直接修改。

## What Changes

- 狀態變更成功後重新 fetch Issue 列表，確保篩選結果正確
- ProjectIssuesPage 篩選按鈕：「未關閉」→「進行中」、「已關閉」→「已結束」
- Issue 列表的優先權欄位改為 inline 下拉選單，可直接修改

## Capabilities

### New Capabilities

- `issue-list-inline-priority`: Issue 列表中直接變更 Issue 優先權的下拉選單功能

### Modified Capabilities

（無）

## Impact

- `src/components/IssueList.tsx`：新增 priorities + onPriorityChange props，優先權欄改為 select
- `src/pages/ProjectIssuesPage.tsx`：篩選文字修改、傳入 priorities/onPriorityChange、狀態變更後 refetch
- `src/pages/DashboardPage.tsx`：傳入 priorities/onPriorityChange、狀態變更後 refetch
- `src/App.css`：inline priority select 樣式（可複用 inline-status-select）
