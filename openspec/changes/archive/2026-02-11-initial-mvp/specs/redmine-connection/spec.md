## ADDED Requirements

### Requirement: 設定 Redmine 連線資訊
系統 SHALL 提供設定頁面，讓使用者輸入 Redmine 伺服器 URL 和 API Key。

#### Scenario: 首次啟動無設定
- **WHEN** 使用者首次啟動應用程式且尚無設定資料
- **THEN** 系統 SHALL 導向設定頁面

#### Scenario: 輸入連線資訊
- **WHEN** 使用者在設定頁面輸入 Redmine URL 和 API Key
- **THEN** 系統 SHALL 顯示「測試連線」按鈕

### Requirement: 測試 Redmine 連線
系統 SHALL 提供連線測試功能，透過呼叫 Redmine API (`GET /users/current.json`) 驗證 URL 和 API Key 是否正確。

#### Scenario: 連線成功
- **WHEN** 使用者點擊「測試連線」且 URL 和 API Key 有效
- **THEN** 系統 SHALL 顯示連線成功訊息，包含目前登入的使用者名稱

#### Scenario: 連線失敗 — 無效 URL
- **WHEN** 使用者點擊「測試連線」且 URL 無法連線
- **THEN** 系統 SHALL 顯示錯誤訊息，說明無法連線至該伺服器

#### Scenario: 連線失敗 — 無效 API Key
- **WHEN** 使用者點擊「測試連線」且 API Key 無效（API 回傳 401）
- **THEN** 系統 SHALL 顯示錯誤訊息，說明 API Key 無效

### Requirement: 儲存連線設定
系統 SHALL 在連線測試成功後，將 Redmine URL 和 API Key 持久化儲存於本機。

#### Scenario: 儲存並進入主畫面
- **WHEN** 連線測試成功且使用者確認儲存
- **THEN** 系統 SHALL 儲存設定並導向主畫面（Dashboard）

#### Scenario: 重新啟動後自動載入
- **WHEN** 使用者重新啟動應用程式且已有儲存的設定
- **THEN** 系統 SHALL 自動載入設定並直接進入主畫面

### Requirement: 修改連線設定
系統 SHALL 允許使用者隨時修改已儲存的 Redmine 連線設定。

#### Scenario: 從主畫面進入設定
- **WHEN** 使用者在主畫面點擊設定入口
- **THEN** 系統 SHALL 顯示設定頁面，並預填目前已儲存的 URL 和 API Key
