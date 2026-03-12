## 1. 後端：使用 parent_id filter 取得子議題

- [x] 1.1 在 `src-tauri/src/redmine/client.rs` 新增 `list_child_issues` 方法，透過 `list_issues(&[("parent_id", &id)])` 取得子議題
- [x] 1.2 在 `src-tauri/src/lib.rs` 新增 `list_child_issues` Tauri command

## 2. 前端：Display child issues on issue detail page，子議題資料併入 fetchIssue 載入

- [x] 2.1 在 `src/lib/api.ts` 新增 `listChildIssues(issueId)` 函式
- [x] 2.2 在 `src/pages/IssueDetailPage.tsx` 的 `fetchIssue` 中併入 `listChildIssues` 呼叫，實現子議題資料併入 fetchIssue 載入
- [x] 2.3 在 `src/pages/IssueDetailPage.tsx` 新增 `ChildrenSection` 元件以 display child issues on issue detail page，放在概述與附件之間（子議題區塊位置），顯示 tracker、#id、subject、status、assigned_to，點擊可導航（child issue navigation），無被分派者顯示「—」（child issue with no assignee），無子議題時不顯示區塊
