## Why

專案 Issue 列表目前只顯示「被分派者」，無法直接看到是誰建立（提出）了該 Issue。使用者需要逐一點入詳情才能確認建立者，影響瀏覽效率。

## What Changes

- 在 `IssueList` 元件新增 `showAuthor` prop，支援顯示建立者欄位
- 專案 Issue 列表頁面啟用建立者欄位，顯示於「主旨」與「被分派者」之間

## Capabilities

### New Capabilities

（無新增 capability）

### Modified Capabilities

- `issue-management`: Issue 列表新增「建立者」欄位顯示需求

## Impact

- `src/components/IssueList.tsx`：新增 `showAuthor` prop 與對應欄位渲染
- `src/pages/ProjectIssuesPage.tsx`：傳入 `showAuthor` 啟用建立者欄位
