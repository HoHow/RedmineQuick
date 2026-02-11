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
系統 SHALL 提供建立 issue 的表單，支援以下欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者。

#### Scenario: 開啟建立表單
- **WHEN** 使用者在專案 Issue 列表頁面點擊「新增 Issue」
- **THEN** 系統 SHALL 顯示建立 issue 表單，追蹤標籤、狀態、優先權 SHALL 從 Redmine API 取得可用選項，被分派者和監看者 SHALL 從該專案成員中選取

#### Scenario: 成功建立 issue
- **WHEN** 使用者填寫必要欄位（至少主旨和追蹤標籤）並送出
- **THEN** 系統 SHALL 透過 Redmine API 建立 issue，成功後導向新建 issue 的詳情頁面

#### Scenario: 建立失敗
- **WHEN** 使用者送出建立表單但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，表單內容 SHALL 保留不清除

### Requirement: 編輯 Issue
系統 SHALL 允許使用者在 Issue 詳情頁面編輯 issue，支援與建立相同的欄位。

#### Scenario: 進入編輯模式
- **WHEN** 使用者在 Issue 詳情頁面點擊「編輯」
- **THEN** 系統 SHALL 將詳情頁面切換為編輯模式，預填目前的欄位值

#### Scenario: 成功更新 issue
- **WHEN** 使用者修改欄位後送出
- **THEN** 系統 SHALL 透過 Redmine API 更新 issue，成功後返回詳情檢視模式並顯示更新後的資料

#### Scenario: 更新失敗
- **WHEN** 使用者送出更新但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，保持編輯模式不退出

### Requirement: 更新 Issue 進度
系統 SHALL 允許使用者快速更新 issue 的完成百分比，無需進入完整編輯模式。

#### Scenario: 快速更新進度
- **WHEN** 使用者在 Issue 詳情頁面調整完成百分比數值
- **THEN** 系統 SHALL 立即透過 Redmine API 更新該 issue 的完成百分比

### Requirement: 更新 Issue 狀態
系統 SHALL 允許使用者快速更新 issue 的狀態，無需進入完整編輯模式。

#### Scenario: 快速更新狀態
- **WHEN** 使用者在 Issue 詳情頁面變更狀態下拉選單
- **THEN** 系統 SHALL 立即透過 Redmine API 更新該 issue 的狀態
