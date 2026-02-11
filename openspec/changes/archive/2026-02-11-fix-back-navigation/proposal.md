## Why

新增 Issue 頁面的「返回」按鈕使用 `navigate(-1)`（瀏覽器上一頁），當使用者多次使用「繼續建立」後按返回，不會回到專案 Issue 列表，而是回到不正確的歷史記錄。應該直接導向該專案的 Issue 列表頁面。

## What Changes

- IssueCreatePage 的返回按鈕從 `navigate(-1)` 改為 `navigate(`/projects/${projectId}/issues`)`
- IssueCreatePage 的 onCancel 同樣改為導向專案 Issue 列表

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`: 修正建立 Issue 頁面的返回導航目標

## Impact

- `src/pages/IssueCreatePage.tsx` — 修改返回按鈕和取消按鈕的導航路徑
