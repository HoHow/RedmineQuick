## Why

Issue 詳情頁目前能顯示父議題連結，但無法看到該 issue 底下有哪些子議題。使用者必須回到列表或手動搜尋才能找到子議題，不利於掌握任務拆分的全貌。

## What Changes

- Issue 詳情頁新增「子議題」區塊，列出所有直接子議題
- 每個子議題顯示 tracker、編號、主旨、狀態、被分派者
- 點擊子議題可直接導航至該子議題詳情頁
- 沒有子議題時不顯示此區塊

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`: 新增 issue 詳情頁的子議題清單顯示需求

## Impact

- 後端：新增 Tauri command `list_child_issues`，透過 `GET /issues.json?parent_id={id}` 取得子議題
- 前端 API 層：新增 `listChildIssues()` 函式
- 前端頁面：`IssueDetailPage.tsx` 新增 `ChildrenSection` 元件
- 資料模型：不需要修改現有 Issue 結構
