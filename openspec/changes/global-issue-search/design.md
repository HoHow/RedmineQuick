## Context

RedmineQuick 目前缺少搜尋功能，使用者需逐一進入專案列表查找 Issue。既有的 `getIssue(id)` API 可直接用於編號跳轉，但缺少依主旨搜尋的 API command。前端使用 React Context 管理全域狀態（AppContext），Navbar 為全域元件，適合放置搜尋入口。

## Goals / Non-Goals

**Goals:**
- 提供 Cmd+K / 搜尋圖示觸發的浮動搜尋對話框
- 數字輸入即時預覽 Issue，文字輸入按 Enter 搜尋
- 情境感知：專案頁面限搜該專案，其他頁面搜全部
- 完整鍵盤操作支援

**Non-Goals:**
- 不做全文搜尋（Redmine API 不支援 Issue 描述全文搜尋）
- 不做搜尋歷史記錄
- 不做進階篩選（狀態、追蹤標籤等條件）

## Decisions

### 使用 React Context 管理搜尋框狀態

搜尋框的開/關需要從 Navbar（圖示按鈕）和全域鍵盤事件（Cmd+K）兩處觸發，使用 SearchContext 統一管理。沿用既有的 Context 模式（AppContext）保持一致。

### 搜尋 API 使用 Redmine 原生 issues.json 端點

Redmine `GET /issues.json?subject=~{query}` 支援主旨模糊搜尋（`~` 為 contains 運算子）。比起使用 `/search.json`（回傳結構不同、需額外處理），直接用 issues 端點可重用既有的 Issue model。

### 情境感知透過 React Router 的 useParams 實現

SearchDialog 元件內部使用 `useParams()` 偵測目前是否在 `/projects/:projectId/` 路徑下，有則帶入 `project_id` 參數，無則搜全部。不需要額外 prop 傳遞。

### 編號跳轉使用既有 getIssue API

輸入純數字時，debounce 300ms 後呼叫既有的 `getIssue(id)`。若 Issue 存在則顯示預覽，不存在則顯示「找不到 Issue #N」。不需新 API。

## Risks / Trade-offs

- [Redmine 搜尋效能] 大型 Redmine 實例搜尋可能較慢 → 顯示 loading 狀態，限制回傳筆數（limit=10）
- [快速連續輸入] 使用者快速輸入時可能產生多個並行請求 → debounce + 取消過期請求（AbortController 或忽略舊結果）
