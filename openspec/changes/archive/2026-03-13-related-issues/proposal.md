## Why

Issue 詳情頁目前無法顯示 Redmine 的 issue relations（如：關聯、阻擋、重複等關係）。使用者需要回到 Redmine 網頁才能查看相關議題，不利於快速掌握議題間的依賴與關聯。

## What Changes

- Issue 詳情頁新增「相關議題」區塊，列出所有 relations 及其對應的 issue 資訊
- 每個相關議題顯示：關聯類型（中文標籤）、tracker、編號、主旨、狀態、被分派者
- 關聯方向自動反轉（如：從對方角度的 blocks 顯示為「被阻擋」）
- 點擊相關議題可直接導航至該議題詳情頁
- 沒有相關議題時不顯示此區塊

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`: 新增 issue 詳情頁的相關議題（relations）顯示需求

## Impact

- 後端：新增 `Relation`、`RelatedIssue` 資料結構，新增 `list_related_issues` Tauri command（包含方向反轉與 issue 資訊解析邏輯）
- 前端 API 層：新增 `RelatedIssue` interface 與 `listRelatedIssues()` 函式
- 前端頁面：`IssueDetailPage.tsx` 新增 `RelationsSection` 元件
