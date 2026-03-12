## Context

`IssueList` 元件已有 `showProject` 和 `showAssignee` 兩個可選欄位 prop。`Issue` 型別已包含 `author: IdName`，Rust 後端也已回傳此欄位，前端無需額外 API 呼叫。

## Goals / Non-Goals

**Goals:**
- 在 `IssueList` 元件新增 `showAuthor` prop，以相同模式支援建立者欄位
- 專案 Issue 列表頁面啟用建立者欄位

**Non-Goals:**
- 不修改「我的 Issue」列表（Dashboard）的欄位配置
- 不新增建立者篩選功能

## Decisions

### 沿用既有的可選欄位 prop 模式

`IssueList` 已有 `showProject` 和 `showAssignee` boolean prop 控制欄位顯示。新增 `showAuthor` prop 遵循相同模式，保持一致性。

### 欄位順序：主旨 → 建立者 → 被分派者

建立者放在主旨之後、被分派者之前，因為「誰提出」和「誰負責」是相關但不同的資訊，放在一起方便比對。

## Risks / Trade-offs

- 多一欄可能壓縮主旨欄位寬度 → 影響有限，主旨欄位本身已有 CSS class 可控制
