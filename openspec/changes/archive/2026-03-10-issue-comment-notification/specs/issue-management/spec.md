## ADDED Requirements

### Requirement: Issue 留言通知
系統 SHALL 在「指派給目前使用者的 Issue」有新留言時，發送 OS 原生通知和 in-app 通知。

#### Scenario: 偵測到新留言
- **WHEN** 背景 polling 偵測到指派給目前使用者的某筆 Issue 的 `updated_on` 改變，且最新 journal 包含 notes（留言）
- **THEN** 系統 SHALL 發送 OS 原生通知，標題為「新留言」，內容為「留言者名稱 在 #Issue編號 Issue主旨」

#### Scenario: in-app 通知顯示
- **WHEN** 系統偵測到新留言
- **THEN** 系統 SHALL 在 Navbar 通知鈴鐺新增一筆通知，包含留言者名稱、Issue 編號、Issue 主旨、專案名稱

#### Scenario: 排除自己的留言
- **WHEN** 最新 journal 的留言者為目前登入的使用者
- **THEN** 系統 SHALL 不發送通知

#### Scenario: updated_on 變化但非留言
- **WHEN** Issue 的 `updated_on` 改變，但最新 journal 不包含 notes（僅欄位變更）
- **THEN** 系統 SHALL 不發送通知

#### Scenario: 首次 polling 不通知
- **WHEN** 系統首次 poll 取得 Issue 列表
- **THEN** 系統 SHALL 建立 baseline 記錄，不發送任何留言通知

#### Scenario: 點擊留言通知跳轉
- **WHEN** 使用者點擊留言通知（OS 通知或 in-app 通知）
- **THEN** 系統 SHALL 導航至該 Issue 的詳情頁面

## MODIFIED Requirements

### Requirement: 前後端欄位名稱統一使用 snake_case
所有 Rust serde model struct SHALL 不使用 `rename_all = "camelCase"`，直接以 snake_case 欄位名對應 Redmine API 回傳格式。前端 TypeScript 型別 SHALL 使用對應的 snake_case 欄位名。

#### Scenario: Issue 欄位正確解析
- **WHEN** Redmine API 回傳 issue 資料（包含 `assigned_to`、`start_date`、`due_date`、`estimated_hours`、`done_ratio`、`updated_on`）
- **THEN** 系統 SHALL 正確解析並顯示所有欄位，不產生解析錯誤

#### Scenario: IssueParams 正確序列化
- **WHEN** 前端送出建立或更新 issue 請求
- **THEN** 系統 SHALL 使用 snake_case 欄位名（`tracker_id`、`status_id`、`priority_id`、`assigned_to_id` 等）序列化至 Redmine API
