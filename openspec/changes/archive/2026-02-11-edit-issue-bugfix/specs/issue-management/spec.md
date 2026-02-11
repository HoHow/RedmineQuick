## MODIFIED Requirements

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

#### Scenario: 建立 Issue 不顯示筆記欄位
- **WHEN** 使用者在建立 Issue 表單中
- **THEN** 系統 SHALL 不顯示筆記輸入欄位（Redmine 建立 API 不支援 notes）

### Requirement: 快速更新完成日期
系統 SHALL 允許使用者在 Issue 詳情頁面直接修改完成日期，無需進入完整編輯模式。

#### Scenario: 快速更新完成日期
- **WHEN** 使用者在 Issue 詳情頁面變更完成日期的日期選擇器
- **THEN** 系統 SHALL 立即透過 Redmine API 更新該 issue 的完成日期

#### Scenario: 清除完成日期
- **WHEN** 使用者在 Issue 詳情頁面清空完成日期欄位
- **THEN** 系統 SHALL 立即透過 Redmine API 清除該 issue 的完成日期

#### Scenario: 快速更新成功提示 — 狀態
- **WHEN** 使用者在 Issue 詳情頁面變更狀態且 API 更新成功
- **THEN** 系統 SHALL 在狀態欄位旁顯示「✓ 已更新」提示，約 2 秒後自動消失

#### Scenario: 快速更新成功提示 — 完成日期
- **WHEN** 使用者在 Issue 詳情頁面變更完成日期且 API 更新成功
- **THEN** 系統 SHALL 在完成日期欄位旁顯示「✓ 已更新」提示，約 2 秒後自動消失

### Requirement: 快速更新完成日期空值處理
系統 SHALL 在 Issue 詳情頁的完成日期欄位未設定時，顯示「未設定」提示文字，點擊後才顯示日期選擇器。

#### Scenario: 完成日期為空
- **WHEN** Issue 的完成日期為空（未設定）
- **THEN** 系統 SHALL 顯示「未設定」文字，點擊後切換為日期選擇器供使用者選取

#### Scenario: 完成日期已有值
- **WHEN** Issue 的完成日期已有值
- **THEN** 系統 SHALL 直接顯示日期選擇器，帶入現有日期

## MODIFIED Requirements

### Requirement: 建立新 Issue
系統 SHALL 在建立 Issue 表單中，將開始日期預設為當天日期。

#### Scenario: 開啟建立表單時的開始日期
- **WHEN** 使用者開啟建立 Issue 表單
- **THEN** 系統 SHALL 將開始日期預設為當天日期，使用者可自行修改或清除

### Requirement: 完成度唯讀顯示
系統 SHALL 在 Issue 詳情頁面以唯讀方式顯示完成度百分比，不提供互動式滑桿。

#### Scenario: 顯示完成度
- **WHEN** 使用者查看 Issue 詳情頁面
- **THEN** 系統 SHALL 以純文字顯示完成度百分比（如「50%」），不可直接修改
