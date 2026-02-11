## ADDED Requirements

### Requirement: 顯示我的專案列表
系統 SHALL 在主畫面（Dashboard）顯示目前使用者所屬的所有 Redmine 專案。

#### Scenario: 載入專案列表
- **WHEN** 使用者進入主畫面
- **THEN** 系統 SHALL 從 Redmine API 取得使用者所屬的專案列表，並顯示每個專案的名稱與識別碼

#### Scenario: 無所屬專案
- **WHEN** 使用者無任何所屬專案
- **THEN** 系統 SHALL 顯示空狀態提示訊息

### Requirement: 進入專案 Issue 列表
系統 SHALL 允許使用者點擊專案名稱，進入該專案的 Issue 列表頁面。

#### Scenario: 點擊專案
- **WHEN** 使用者在主畫面點擊某個專案
- **THEN** 系統 SHALL 導向該專案的 Issue 列表頁面，顯示該專案下的所有 issue
