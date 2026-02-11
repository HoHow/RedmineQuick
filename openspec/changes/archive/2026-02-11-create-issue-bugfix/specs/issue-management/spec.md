## MODIFIED Requirements

### Requirement: 建立新 Issue
系統 SHALL 提供建立 issue 的表單，支援以下欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者。表單 SHALL 提供合理的預設值以減少手動操作。

#### Scenario: 開啟建立表單
- **WHEN** 使用者在專案 Issue 列表頁面點擊「新增 Issue」
- **THEN** 系統 SHALL 顯示建立 issue 表單，各欄位預設值如下：
  - 追蹤標籤：預設為「工作」，若不存在則為列表第一項
  - 優先權：預設為「正常」，若不存在則為列表第一項
  - 被分派者：預設為目前登入使用者（需為該專案成員），若非成員則不預設
  - 狀態：預設為列表第一項
  - 開始日期、完成日期：預設為空（未設定）
  - 其他欄位：預設為空

#### Scenario: 成功建立 issue
- **WHEN** 使用者填寫必要欄位（至少主旨和追蹤標籤）並送出
- **THEN** 系統 SHALL 透過 Redmine API 建立 issue，成功後導向新建 issue 的詳情頁面

#### Scenario: 建立失敗
- **WHEN** 使用者送出建立表單但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，表單內容 SHALL 保留不清除

#### Scenario: 日期欄位互動
- **WHEN** 開始日期或完成日期欄位尚未設定
- **THEN** 系統 SHALL 顯示「未設定」提示文字，點擊後才顯示日期選擇器

## ADDED Requirements

### Requirement: 前後端欄位名稱統一使用 snake_case
所有 Rust serde model struct SHALL 不使用 `rename_all = "camelCase"`，直接以 snake_case 欄位名對應 Redmine API 回傳格式。前端 TypeScript 型別 SHALL 使用對應的 snake_case 欄位名。

#### Scenario: Issue 欄位正確解析
- **WHEN** Redmine API 回傳 issue 資料（包含 `assigned_to`、`start_date`、`due_date`、`estimated_hours`、`done_ratio`）
- **THEN** 系統 SHALL 正確解析並顯示所有欄位，不產生解析錯誤

#### Scenario: IssueParams 正確序列化
- **WHEN** 前端送出建立或更新 issue 請求
- **THEN** 系統 SHALL 使用 snake_case 欄位名（`tracker_id`、`status_id`、`priority_id`、`assigned_to_id` 等）序列化至 Redmine API
