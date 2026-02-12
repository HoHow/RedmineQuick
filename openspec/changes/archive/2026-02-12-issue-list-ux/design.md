## Context

目前建立 Issue 後導向 Issue 詳情頁，但使用者通常想回到列表繼續操作。列表中的狀態欄位為純文字，無法直接修改。「繼續建立」後表單留在下方位置。

## Goals / Non-Goals

**Goals:**
- 建立 Issue 後返回列表頁
- 列表中直接變更 Issue 狀態
- 繼續建立後自動滾動到頂部

**Non-Goals:**
- 不做列表中的其他欄位 inline 編輯（只做狀態）
- 不改變列表的篩選或排序邏輯

## Decisions

### 狀態下拉選單實作方式
- 使用原生 `<select>` 元素取代純文字狀態顯示
- 需要在 IssueList 接收 `statuses` 清單和 `onStatusChange` callback
- 點擊 `<select>` 時用 `e.stopPropagation()` 防止觸發整行導航
- 更新成功後由父元件重新 fetch 列表（或 optimistic update）

**理由**: 原生 select 簡單直覺，不需要額外的 UI 元件。

### 狀態更新流程
- 使用已有的 `updateIssue(issueId, { status_id })` API
- 採用 optimistic update：先更新 UI，API 失敗再 rollback
- 父元件（ProjectIssuesPage / DashboardPage）傳入 statuses 和 callback

### 建立後導向
- `IssueCreatePage.handleSubmit` 改為 `navigate(-1)` 或 `navigate(\`/projects/\${projectId}/issues\`)`
- 使用明確路徑確保導向正確

### 繼續建立滾動
- 在 `IssueForm` 的 `handleSubmit` 中，`onSubmitContinue` 成功後呼叫 `window.scrollTo(0, 0)`

## Risks / Trade-offs

- [原生 select 樣式] → 不同瀏覽器可能有差異，但 Tauri WebView 一致性足夠
- [Optimistic update] → API 失敗時需要 rollback，但狀態變更很少失敗
