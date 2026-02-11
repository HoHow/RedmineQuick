## ADDED Requirements

### Requirement: 顯示我的待處理 Issue
系統 SHALL 在主畫面（Dashboard）顯示所有指派給目前使用者且狀態為未關閉的 issue，跨所有專案。

#### Scenario: 載入待處理 issue
- **WHEN** 使用者進入主畫面
- **THEN** 系統 SHALL 從 Redmine API 取得指派給我的未關閉 issue 列表，每筆顯示：主旨、專案名稱、追蹤標籤、狀態、優先權、完成百分比

#### Scenario: 無待處理 issue
- **WHEN** 使用者無任何指派的未關閉 issue
- **THEN** 系統 SHALL 顯示空狀態提示訊息

### Requirement: 顯示專案內 Issue 列表
系統 SHALL 在專案 Issue 列表頁面顯示該專案下的所有 issue。

#### Scenario: 載入專案 issue
- **WHEN** 使用者進入某專案的 Issue 列表頁面
- **THEN** 系統 SHALL 顯示該專案下的 issue 列表，每筆顯示：主旨、追蹤標籤、狀態、優先權、被分派者、完成百分比

### Requirement: 查看 Issue 詳情
系統 SHALL 提供 Issue 詳情頁面，顯示 issue 的完整資訊。

#### Scenario: 從列表進入詳情
- **WHEN** 使用者在任何 issue 列表中點擊某筆 issue
- **THEN** 系統 SHALL 導向該 issue 的詳情頁面，顯示所有欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、完成百分比、監看者

### Requirement: 建立新 Issue
系統 SHALL 提供建立 issue 的表單，支援以下欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者。表單 SHALL 提供合理的預設值以減少手動操作。

#### Scenario: 開啟建立表單
- **WHEN** 使用者在專案 Issue 列表頁面點擊「新增 Issue」
- **THEN** 系統 SHALL 顯示建立 issue 表單，各欄位預設值如下：
  - 追蹤標籤：預設為「工作」，若不存在則為列表第一項
  - 優先權：預設為「正常」，若不存在則為列表第一項
  - 被分派者：預設為目前登入使用者（需為該專案成員），若非成員則不預設
  - 狀態：預設為列表第一項
  - 開始日期：預設為當天日期，使用者可自行修改或清除
  - 完成日期：預設為空（未設定）
  - 其他欄位：預設為空

#### Scenario: 成功建立 issue
- **WHEN** 使用者填寫必要欄位（至少主旨和追蹤標籤）並點擊「建立」
- **THEN** 系統 SHALL 透過 Redmine API 建立 issue，成功後導向新建 issue 的詳情頁面

#### Scenario: 繼續建立 issue
- **WHEN** 使用者填寫必要欄位並點擊「繼續建立」
- **THEN** 系統 SHALL 透過 Redmine API 建立 issue，成功後顯示「Issue #ID 已建立」提示（約 3 秒後消失），並清空主旨、概述、完成日期、預估工時、完成百分比欄位，保留追蹤標籤、狀態、優先權、被分派者、開始日期，供使用者繼續建立下一筆

#### Scenario: 建立失敗
- **WHEN** 使用者送出建立表單但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，表單內容 SHALL 保留不清除

#### Scenario: 日期欄位互動
- **WHEN** 開始日期或完成日期欄位尚未設定
- **THEN** 系統 SHALL 顯示「未設定」提示文字，點擊後才顯示日期選擇器

#### Scenario: 建立 Issue 不顯示筆記欄位
- **WHEN** 使用者在建立 Issue 表單中
- **THEN** 系統 SHALL 不顯示筆記輸入欄位（Redmine 建立 API 不支援 notes）

### Requirement: 編輯 Issue
系統 SHALL 允許使用者在 Issue 詳情頁面編輯 issue，支援與建立相同的欄位，並額外提供筆記（notes）輸入欄位。筆記 SHALL 在更新時一併送出至 Redmine API，記錄於 issue 歷程中。

#### Scenario: 進入編輯模式
- **WHEN** 使用者在 Issue 詳情頁面點擊「編輯」
- **THEN** 系統 SHALL 將詳情頁面切換為編輯模式，預填目前的欄位值，並顯示一個空白的筆記輸入欄位

#### Scenario: 附加筆記更新 issue
- **WHEN** 使用者修改欄位、輸入筆記後送出
- **THEN** 系統 SHALL 透過 Redmine API 更新 issue 並附加筆記，成功後返回詳情檢視模式並顯示更新後的資料

#### Scenario: 不附加筆記更新 issue
- **WHEN** 使用者修改欄位但未輸入筆記後送出
- **THEN** 系統 SHALL 透過 Redmine API 更新 issue（不送出 notes 欄位），成功後返回詳情檢視模式

#### Scenario: 更新失敗
- **WHEN** 使用者送出更新但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，保持編輯模式不退出

### Requirement: 完成度唯讀顯示
系統 SHALL 在 Issue 詳情頁面以唯讀方式顯示完成度百分比，不提供互動式滑桿。

#### Scenario: 顯示完成度
- **WHEN** 使用者查看 Issue 詳情頁面
- **THEN** 系統 SHALL 以純文字顯示完成度百分比（如「50%」），不可直接修改

### Requirement: 更新 Issue 狀態
系統 SHALL 允許使用者快速更新 issue 的狀態，無需進入完整編輯模式。

#### Scenario: 快速更新狀態
- **WHEN** 使用者在 Issue 詳情頁面變更狀態下拉選單
- **THEN** 系統 SHALL 立即透過 Redmine API 更新該 issue 的狀態

### Requirement: 快速更新完成日期
系統 SHALL 允許使用者在 Issue 詳情頁面直接修改完成日期，無需進入完整編輯模式。

#### Scenario: 快速更新完成日期
- **WHEN** 使用者在 Issue 詳情頁面變更完成日期的日期選擇器
- **THEN** 系統 SHALL 立即透過 Redmine API 更新該 issue 的完成日期

#### Scenario: 清除完成日期
- **WHEN** 使用者在 Issue 詳情頁面清空完成日期欄位
- **THEN** 系統 SHALL 立即透過 Redmine API 清除該 issue 的完成日期

### Requirement: 快速更新完成日期空值處理
系統 SHALL 在 Issue 詳情頁的完成日期欄位未設定時，顯示「未設定」提示文字，點擊後才顯示日期選擇器。

#### Scenario: 完成日期為空
- **WHEN** Issue 的完成日期為空（未設定）
- **THEN** 系統 SHALL 顯示「未設定」文字，點擊後切換為日期選擇器供使用者選取

#### Scenario: 完成日期已有值
- **WHEN** Issue 的完成日期已有值
- **THEN** 系統 SHALL 直接顯示日期選擇器，帶入現有日期

### Requirement: 快速更新成功提示
系統 SHALL 在快速更新欄位成功後，於欄位旁顯示短暫提示。

#### Scenario: 快速更新成功提示 — 狀態
- **WHEN** 使用者在 Issue 詳情頁面變更狀態且 API 更新成功
- **THEN** 系統 SHALL 在狀態欄位旁顯示「✓ 已更新」提示，約 2 秒後自動消失

#### Scenario: 快速更新成功提示 — 完成日期
- **WHEN** 使用者在 Issue 詳情頁面變更完成日期且 API 更新成功
- **THEN** 系統 SHALL 在完成日期欄位旁顯示「✓ 已更新」提示，約 2 秒後自動消失

### Requirement: 前後端欄位名稱統一使用 snake_case
所有 Rust serde model struct SHALL 不使用 `rename_all = "camelCase"`，直接以 snake_case 欄位名對應 Redmine API 回傳格式。前端 TypeScript 型別 SHALL 使用對應的 snake_case 欄位名。

#### Scenario: Issue 欄位正確解析
- **WHEN** Redmine API 回傳 issue 資料（包含 `assigned_to`、`start_date`、`due_date`、`estimated_hours`、`done_ratio`）
- **THEN** 系統 SHALL 正確解析並顯示所有欄位，不產生解析錯誤

#### Scenario: IssueParams 正確序列化
- **WHEN** 前端送出建立或更新 issue 請求
- **THEN** 系統 SHALL 使用 snake_case 欄位名（`tracker_id`、`status_id`、`priority_id`、`assigned_to_id` 等）序列化至 Redmine API
