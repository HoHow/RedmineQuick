## 1. 後端：Relation 資料模型與後端一站式處理相關議題

- [x] 1.1 在 `src-tauri/src/redmine/models.rs` 新增 `Relation` struct，在 Issue 結構加入 relations 欄位（`relations: Option<Vec<Relation>>`），新增 `RelatedIssue` struct
- [x] 1.2 在 `src-tauri/src/redmine/client.rs` 新增 `invert_relation_type()` 函式（方向反轉邏輯），新增 `get_issue_basic()` 方法（使用 get_issue_basic 取得相關 issue 資訊），新增 `list_related_issues()` 方法
- [x] 1.3 在 `src-tauri/src/commands/issues.rs` 新增 `list_related_issues` Tauri command，在 `src-tauri/src/lib.rs` 註冊

## 2. 前端：display related issues on issue detail page

- [x] 2.1 在 `src/lib/api.ts` 新增 `RelatedIssue` interface 與 `listRelatedIssues(issueId)` 函式
- [x] 2.2 在 `src/pages/IssueDetailPage.tsx` 新增 `RELATION_TYPE_LABELS` 對照表（relation type labels）、`RelationsSection` 元件以 display related issues on issue detail page（含 relation type direction inversion 顯示、related issue navigation、related issue with no assignee 處理、inaccessible related issue 靜默省略），在 `fetchIssue` 的 `Promise.all` 加入 `listRelatedIssues`，放在 ChildrenSection 和 AttachmentSection 之間（相關議題區塊位置）
- [x] 2.3 在 `src/App.css` 新增相關議題列表樣式
