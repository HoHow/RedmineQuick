## Context

目前 Issue 列表已有 inline 狀態下拉選單（使用 optimistic update）。優先權欄位仍為純文字。狀態變更後只做 optimistic update 而未 refetch，可能導致篩選不一致。篩選按鈕文字不夠直覺。

## Goals / Non-Goals

**Goals:**
- 優先權欄位改為 inline 下拉選單
- 狀態/優先權變更後 refetch 列表
- 篩選按鈕文字「未關閉」→「進行中」、「已關閉」→「已結束」

**Non-Goals:**
- 不改變其他欄位的 inline 編輯
- 不改變 DashboardPage 的 tab 文字（待處理/已完成）

## Decisions

### 優先權下拉選單
- 複用與狀態相同的 inline select 模式
- IssueList 新增 `priorities` 和 `onPriorityChange` props
- 樣式複用 `.inline-status-select`（改為通用 class `.inline-select`）

### 狀態/優先權變更後 refetch
- 保留 optimistic update（UI 即時回饋）
- API 成功後 refetch 列表（確保篩選一致性）
- API 失敗則 rollback + 不 refetch
- 父元件的 `onStatusChange` / `onPriorityChange` callback 負責 refetch 邏輯

### 篩選文字
- 直接修改 JSX 中的按鈕文字，無其他邏輯變更

## Risks / Trade-offs

- [refetch 開銷] → 每次變更多一次 API 呼叫，但列表資料量小，影響可忽略
- [CSS class 重命名] → `.inline-status-select` 改為 `.inline-select` 需同步更新
