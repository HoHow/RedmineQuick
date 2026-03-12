## 1. Issue model 新增 updated_on 欄位

- [x] 1.1 Rust Issue struct 新增 `updated_on: Option<String>` 欄位
- [x] 1.2 前端 TypeScript Issue interface 新增 `updated_on: string | null`

## 2. Polling 邏輯擴展

- [x] 2.1 將 `known_ids: HashSet<u64>` 改為 `known_issues: HashMap<u64, String>`（ID → updated_on）
- [x] 2.2 新增 `NewCommentEvent` struct（issue_id、subject、project_name、author_name）
- [x] 2.3 偵測 `updated_on` 變化時，呼叫 `get_issue(id)` 取得最新 journals
- [x] 2.4 判斷最新 journal 是否包含 notes 且留言者非目前使用者，符合條件則 emit `new-comment` 事件並發送 OS 通知
- [x] 2.5 polling 啟動時取得目前使用者 ID（呼叫 `get_current_user`），用於排除自己的留言

## 3. 前端通知整合

- [x] 3.1 在 NotificationContext 監聽 `new-comment` 事件，新增通知記錄（含留言者資訊）
- [x] 3.2 通知顯示格式區分「新 Issue」和「新留言」
