## ADDED Requirements

### Requirement: 顯示我的待處理 Issue
系統 SHALL 在主畫面（Dashboard）提供 tab 切換，讓使用者檢視「待處理」和「已完成」的 issue。

#### Scenario: 預設顯示待處理 tab
- **WHEN** 使用者進入主畫面
- **THEN** 系統 SHALL 預設選取「待處理」tab，顯示指派給目前使用者且狀態為未關閉的 issue 列表

#### Scenario: 切換至已完成 tab
- **WHEN** 使用者點擊「已完成」tab
- **THEN** 系統 SHALL 顯示指派給目前使用者且狀態為已關閉的 issue 列表

#### Scenario: 無待處理 issue
- **WHEN** 使用者無任何指派的未關閉 issue
- **THEN** 系統 SHALL 顯示空狀態提示訊息

#### Scenario: 無已完成 issue
- **WHEN** 使用者無任何指派的已關閉 issue
- **THEN** 系統 SHALL 顯示空狀態提示訊息

### Requirement: 顯示專案內 Issue 列表
系統 SHALL 在專案 Issue 列表頁面提供狀態篩選，讓使用者依狀態檢視 issue。

#### Scenario: 預設顯示未關閉 issue
- **WHEN** 使用者進入某專案的 Issue 列表頁面
- **THEN** 系統 SHALL 預設選取「未關閉」篩選，顯示該專案下狀態為未關閉的 issue

#### Scenario: 篩選已關閉 issue
- **WHEN** 使用者點擊「已關閉」篩選按鈕
- **THEN** 系統 SHALL 顯示該專案下狀態為已關閉的 issue

#### Scenario: 篩選全部 issue
- **WHEN** 使用者點擊「全部」篩選按鈕
- **THEN** 系統 SHALL 顯示該專案下所有狀態的 issue

### Requirement: 查看 Issue 詳情
系統 SHALL 提供 Issue 詳情頁面，顯示 issue 的完整資訊。

#### Scenario: 從列表進入詳情
- **WHEN** 使用者在任何 issue 列表中點擊某筆 issue
- **THEN** 系統 SHALL 導向該 issue 的詳情頁面，顯示所有欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、完成百分比、監看者

### Requirement: 建立新 Issue
系統 SHALL 提供建立 issue 的表單，支援以下欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者、附件。表單 SHALL 提供合理的預設值以減少手動操作。

#### Scenario: 開啟建立表單
- **WHEN** 使用者在專案 Issue 列表頁面點擊「新增 Issue」
- **THEN** 系統 SHALL 顯示建立 issue 表單，各欄位預設值如下：
  - 追蹤標籤：預設為「工作」，若不存在則為列表第一項
  - 優先權：預設為「正常」，若不存在則為列表第一項
  - 被分派者：預設為目前登入使用者（需為該專案成員），若非成員則不預設
  - 狀態：預設為列表第一項
  - 開始日期：預設為當天日期，使用者可自行修改或清除
  - 完成日期：預設為空（未設定）
  - 附件：預設為空（無待上傳檔案）
  - 其他欄位：預設為空

#### Scenario: 成功建立 issue
- **WHEN** 使用者填寫必要欄位（至少主旨和追蹤標籤）並點擊「建立」
- **THEN** 系統 SHALL 先上傳所有待上傳附件取得 token，再透過 Redmine API 建立 issue（含 uploads），成功後導向新建 issue 的詳情頁面

#### Scenario: 繼續建立 issue
- **WHEN** 使用者填寫必要欄位並點擊「繼續建立」
- **THEN** 系統 SHALL 先上傳所有待上傳附件取得 token，再透過 Redmine API 建立 issue（含 uploads），成功後顯示「Issue #ID 已建立」提示（約 3 秒後消失），並清空主旨、概述、完成日期、預估工時、完成百分比、待上傳附件列表欄位，保留追蹤標籤、狀態、優先權、被分派者、開始日期，供使用者繼續建立下一筆

#### Scenario: 返回專案 Issue 列表
- **WHEN** 使用者在建立 Issue 頁面點擊「返回」按鈕或取消
- **THEN** 系統 SHALL 導向該專案的 Issue 列表頁面（`/projects/:projectId/issues`），而非瀏覽器上一頁

#### Scenario: 建立失敗
- **WHEN** 使用者送出建立表單但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，表單內容（含待上傳附件列表）SHALL 保留不清除

#### Scenario: 日期欄位互動
- **WHEN** 開始日期或完成日期欄位尚未設定
- **THEN** 系統 SHALL 顯示「未設定」提示文字，點擊後才顯示日期選擇器

#### Scenario: 建立 Issue 不顯示筆記欄位
- **WHEN** 使用者在建立 Issue 表單中
- **THEN** 系統 SHALL 不顯示筆記輸入欄位（Redmine 建立 API 不支援 notes）

### Requirement: 編輯 Issue
系統 SHALL 允許使用者在 Issue 詳情頁面編輯 issue，支援與建立相同的欄位，並額外提供筆記（notes）輸入欄位和附件上傳功能。筆記 SHALL 在更新時一併送出至 Redmine API，記錄於 issue 歷程中。

#### Scenario: 進入編輯模式
- **WHEN** 使用者在 Issue 詳情頁面點擊「編輯」
- **THEN** 系統 SHALL 將詳情頁面切換為編輯模式，預填目前的欄位值，顯示一個空白的筆記輸入欄位，以及一個空白的附件上傳區域

#### Scenario: 附加筆記更新 issue
- **WHEN** 使用者修改欄位、輸入筆記後送出
- **THEN** 系統 SHALL 先上傳所有待上傳附件取得 token，再透過 Redmine API 更新 issue（含 uploads）並附加筆記，成功後返回詳情檢視模式並顯示更新後的資料

#### Scenario: 不附加筆記更新 issue
- **WHEN** 使用者修改欄位但未輸入筆記後送出
- **THEN** 系統 SHALL 先上傳所有待上傳附件取得 token，再透過 Redmine API 更新 issue（含 uploads，不送出 notes 欄位），成功後返回詳情檢視模式

#### Scenario: 更新失敗
- **WHEN** 使用者送出更新但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，保持編輯模式不退出，待上傳附件列表 SHALL 保留不清除

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

### Requirement: Issue 歷程顯示
系統 SHALL 在 Issue 詳情頁面顯示完整歷程，包含欄位變更記錄和筆記，並提供 tab 篩選功能。

#### Scenario: 顯示所有歷程
- **WHEN** 使用者進入 Issue 詳情頁面
- **THEN** 系統 SHALL 在歷程區塊顯示該 issue 的所有 journal，每筆包含：作者、時間、編號（#N），以及該筆的欄位變更記錄和/或筆記

#### Scenario: 顯示欄位變更記錄
- **WHEN** journal 包含 details（欄位變更）
- **THEN** 系統 SHALL 以列表顯示每筆變更，格式為「欄位名 從 舊值 變更為 新值」，舊值以紅底標示、新值以綠底標示

#### Scenario: 欄位新設定（無舊值）
- **WHEN** journal detail 的 old_value 為空
- **THEN** 系統 SHALL 顯示「欄位名 設定為 新值」，新值以綠底標示

#### Scenario: 欄位清除（無新值）
- **WHEN** journal detail 的 new_value 為空
- **THEN** 系統 SHALL 顯示「欄位名 已清除（原值：舊值）」，舊值以紅底標示

#### Scenario: ID 欄位名稱對照
- **WHEN** journal detail 的欄位為 status_id、priority_id、tracker_id 或 assigned_to_id
- **THEN** 系統 SHALL 將 ID 值對照為可讀名稱顯示（如 status_id "1" 顯示為「新建立」）

#### Scenario: 欄位名稱中文化
- **WHEN** 系統顯示欄位變更記錄
- **THEN** 系統 SHALL 將欄位名轉換為中文（如 status_id → 狀態、priority_id → 優先權、done_ratio → 完成百分比、due_date → 完成日期、assigned_to_id → 分派給、tracker_id → 追蹤標籤、subject → 主旨、description → 概述、start_date → 開始日期、estimated_hours → 預估工時）

#### Scenario: 預設顯示全部 tab
- **WHEN** 使用者進入 Issue 詳情頁面的歷程區塊
- **THEN** 系統 SHALL 預設選取「全部」tab，顯示所有 journal

#### Scenario: 篩選筆記
- **WHEN** 使用者點擊「筆記」tab
- **THEN** 系統 SHALL 只顯示包含 notes 的 journal

#### Scenario: 篩選變更
- **WHEN** 使用者點擊「變更」tab
- **THEN** 系統 SHALL 只顯示包含 details 的 journal

#### Scenario: 無歷程記錄
- **WHEN** issue 沒有任何 journal
- **THEN** 系統 SHALL 顯示空狀態提示訊息

### Requirement: Issue 附件顯示
系統 SHALL 在 Issue 詳情頁面顯示該 issue 的所有附件，並區分圖片與非圖片檔案的呈現方式。

#### Scenario: 顯示附件區塊
- **WHEN** issue 包含附件
- **THEN** 系統 SHALL 在詳情頁面顯示「附件」區塊，列出所有附件，每筆包含：檔名、檔案大小、上傳者、上傳時間

#### Scenario: 圖片附件 inline 預覽
- **WHEN** 附件的 content_type 以 "image/" 開頭
- **THEN** 系統 SHALL 以縮圖方式 inline 顯示該圖片

#### Scenario: 點擊圖片放大檢視
- **WHEN** 使用者點擊圖片縮圖
- **THEN** 系統 SHALL 以燈箱（lightbox）方式顯示原始大小圖片，點擊背景或按 Escape 關閉

#### Scenario: 非圖片附件顯示
- **WHEN** 附件的 content_type 不是圖片類型
- **THEN** 系統 SHALL 顯示檔名與檔案大小，提供下載按鈕

#### Scenario: 下載附件
- **WHEN** 使用者點擊附件的下載按鈕
- **THEN** 系統 SHALL 透過 Rust 後端代理下載該附件（附帶 API Key 驗證），並儲存至使用者選擇的路徑

#### Scenario: 無附件
- **WHEN** issue 沒有任何附件
- **THEN** 系統 SHALL 不顯示附件區塊

#### Scenario: 附件圖片載入透過後端代理
- **WHEN** 系統需要顯示附件圖片
- **THEN** 系統 SHALL 透過 Rust 後端下載圖片資料並轉為 base64 data URL 供前端顯示，不直接使用 content_url（因需要 API Key 驗證）

## Requirements

### Requirement: Display child issues on issue detail page
The system SHALL display a list of direct child issues on the issue detail page, positioned between the description section and the attachments section.

#### Scenario: Issue has child issues
- **WHEN** the user views an issue detail page and the issue has child issues
- **THEN** the system SHALL display a "子議題" section showing all direct child issues, each displaying: tracker name, issue number (#ID), subject, status name, and assigned user name

#### Scenario: Issue has no child issues
- **WHEN** the user views an issue detail page and the issue has no child issues
- **THEN** the system SHALL NOT display the "子議題" section

#### Scenario: Child issue navigation
- **WHEN** the user clicks on a child issue row
- **THEN** the system SHALL navigate to that child issue's detail page

#### Scenario: Child issue with no assignee
- **WHEN** a child issue has no assigned user
- **THEN** the system SHALL display a dash ("—") in the assigned user column

<!-- @trace
source: sub-issues
updated: 2026-03-12
code:
  - src/lib/api.ts
  - src-tauri/src/redmine/models.rs
  - src-tauri/src/lib.rs
  - src/components/NoteForm.tsx
  - src-tauri/src/redmine/client.rs
  - CLAUDE.md
  - src-tauri/src/polling.rs
  - src/pages/IssueDetailPage.tsx
  - src/contexts/NotificationContext.tsx
  - src/App.css
  - src-tauri/src/commands/issues.rs
  - src/components/Layout.tsx
tests:
  - src/components/SearchDialog.test.tsx
  - src/components/IssueList.test.tsx
-->

---
### Requirement: Display related issues on issue detail page
The system SHALL display a list of related issues (Redmine relations) on the issue detail page, positioned between the children section and the attachments section.

#### Scenario: Issue has related issues
- **WHEN** the user views an issue detail page and the issue has relations
- **THEN** the system SHALL display a "相關議題" section showing all related issues, each displaying: relation type label in Chinese, tracker name, issue number (#ID), subject, status name, and assigned user name

#### Scenario: Issue has no related issues
- **WHEN** the user views an issue detail page and the issue has no relations
- **THEN** the system SHALL NOT display the "相關議題" section

#### Scenario: Related issue navigation
- **WHEN** the user clicks on a related issue row
- **THEN** the system SHALL navigate to that related issue's detail page

#### Scenario: Related issue with no assignee
- **WHEN** a related issue has no assigned user
- **THEN** the system SHALL display a dash ("—") in the assigned user column

#### Scenario: Relation type direction inversion
- **WHEN** the current issue is the target (issue_to_id) of a relation
- **THEN** the system SHALL display the inverted relation type label (e.g., "blocks" becomes "被阻擋", "duplicates" becomes "被重複")

#### Scenario: Relation type labels
- **WHEN** the system displays a relation type
- **THEN** the system SHALL use the following Chinese labels: relates→關聯, duplicates→重複, duplicated→被重複, blocks→阻擋, blocked→被阻擋, precedes→在前, follows→在後, copied_to→複製到, copied_from→從…複製

#### Scenario: Inaccessible related issue
- **WHEN** a related issue cannot be fetched due to permissions or deletion
- **THEN** the system SHALL silently omit that issue from the list without displaying an error

<!-- @trace
source: related-issues
updated: 2026-03-13
code:
  - src-tauri/src/redmine/models.rs
  - src/pages/IssueDetailPage.tsx
  - src/lib/api.ts
  - src-tauri/src/lib.rs
  - src-tauri/src/redmine/client.rs
  - src/App.css
  - src-tauri/src/commands/issues.rs
-->

---
### Requirement: Quick watch and unwatch issue
The system SHALL provide a toggle button on the issue detail page header to allow the current user to watch or unwatch the issue.

#### Scenario: User is not watching the issue
- **WHEN** the user views an issue detail page and is not in the watchers list
- **THEN** the system SHALL display a "追蹤" button in the header actions area

#### Scenario: User is watching the issue
- **WHEN** the user views an issue detail page and is in the watchers list
- **THEN** the system SHALL display a "取消追蹤" button in the header actions area

#### Scenario: Watch an issue
- **WHEN** the user clicks the "追蹤" button
- **THEN** the system SHALL call the Redmine API to add the current user as a watcher and refresh the issue data to reflect the updated watchers list

#### Scenario: Unwatch an issue
- **WHEN** the user clicks the "取消追蹤" button
- **THEN** the system SHALL call the Redmine API to remove the current user from watchers and refresh the issue data to reflect the updated watchers list

#### Scenario: Watch or unwatch fails
- **WHEN** the watch or unwatch API call fails
- **THEN** the system SHALL display the error message returned by the API

<!-- @trace
source: watch-unwatch
updated: 2026-03-13
code:
  - src/pages/IssueDetailPage.tsx
  - src-tauri/src/lib.rs
  - src-tauri/src/commands/issues.rs
  - src-tauri/src/redmine/client.rs
  - src/lib/api.ts
-->