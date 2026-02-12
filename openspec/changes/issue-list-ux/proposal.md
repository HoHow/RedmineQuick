## Why

建立 Issue 後導向到 Issue 詳情頁不符合工作流程，使用者通常想繼續在列表中操作。Issue 列表無法直接變更狀態，需要點進詳情才能改，效率低。「繼續建立」後畫面停在表單下方，需要手動滾動回頂部。

## What Changes

- 建立 Issue 成功後，導向回 Issue 列表頁（而非 Issue 詳情頁）
- Issue 列表的狀態欄位改為可直接點擊切換的下拉選單
- 「繼續建立」按鈕送出後，自動滾動到頁面頂部

## Capabilities

### New Capabilities
- `issue-list-inline-status`: Issue 列表中直接變更 Issue 狀態的下拉選單功能

### Modified Capabilities

（無）

## Impact

- `src/pages/IssueCreatePage.tsx`：修改建立成功後的導向目標
- `src/components/IssueForm.tsx`：繼續建立後 scrollTo 頂部
- `src/components/IssueList.tsx`：狀態欄位改為 inline 下拉選單
- `src/App.css`：inline 狀態下拉選單樣式
- `src/lib/api.ts`：可能需要新增更新 Issue 狀態的 API 呼叫（檢查是否已有）
