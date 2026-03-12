## Context

Issue 詳情頁目前已顯示父議題連結，但無法看到一個 issue 底下有哪些子議題。Redmine API 提供兩種方式取得子議題資料：

1. `GET /issues/{id}.json?include=children` — 回傳精簡資訊（僅 id、tracker、subject）
2. `GET /issues.json?parent_id={id}` — 回傳完整 Issue 物件（含 status、assigned_to 等）

## Goals / Non-Goals

**Goals:**

- 在 Issue 詳情頁顯示該 issue 的所有直接子議題
- 每個子議題顯示足夠的資訊供使用者判斷狀態（tracker、編號、主旨、狀態、被分派者）
- 點擊子議題可導航至詳情頁

**Non-Goals:**

- 不顯示巢狀子議題（只列直接子議題，不遞迴）
- 不提供子議題的新增、編輯、刪除操作
- 不顯示子議題的完成度進度條或彙總

## Decisions

### 使用 parent_id filter 取得子議題

採用 `GET /issues.json?parent_id={id}` 取得子議題，而非 `include=children`。

理由：`include=children` 只回傳 id、tracker、subject，缺少 status 和 assigned_to 等使用者最需要的資訊。`parent_id` filter 回傳完整 Issue 物件，不需要額外請求。

### 子議題資料併入 fetchIssue 載入

在 `fetchIssue()` 的 `Promise.all` 中加入 `listChildIssues(issueId)` 一併取得。

理由：避免子議題區塊獨立載入造成的畫面閃爍，且空結果的查詢成本極低。

### 子議題區塊位置

放在「概述」和「附件」之間，因為子議題屬於 issue 的結構資訊，比歷程更重要。

## Risks / Trade-offs

- [子議題數量過多] → 目前使用 `limit=100`，與其他列表查詢一致。對於絕大多數使用情境已足夠。
- [多一次 API 請求] → 即使 issue 沒有子議題也會發出請求。但空查詢回應速度快，影響可忽略。
