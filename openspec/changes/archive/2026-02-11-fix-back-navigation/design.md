## Context

IssueCreatePage 的路由為 `/projects/:projectId/issues/new`，已有 `projectId` 參數可用。目前返回按鈕使用 `navigate(-1)` 回到瀏覽器上一頁。

## Goals / Non-Goals

**Goals:**
- 返回按鈕和取消按鈕導向 `/projects/${projectId}/issues`

**Non-Goals:**
- 不改動其他頁面的返回按鈕行為

## Decisions

將 `navigate(-1)` 替換為 `navigate(`/projects/${projectId}/issues`)`。共兩處：返回按鈕的 onClick 和 IssueForm 的 onCancel prop。

不需要新增依賴或修改其他檔案。
