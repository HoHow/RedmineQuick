## MODIFIED Requirements

### Requirement: 測試 Redmine 連線
系統 SHALL 提供連線測試功能，透過呼叫 Redmine API (`GET /users/current.json`) 驗證 URL 和 API Key 是否正確。系統 SHALL 停用 HTTP 自動 redirect，並在收到 401、302、或非 JSON 回應時顯示明確的認證失敗訊息。

#### Scenario: 連線成功
- **WHEN** 使用者點擊「測試連線」且 URL 和 API Key 有效
- **THEN** 系統 SHALL 顯示連線成功訊息，包含目前登入的使用者名稱

#### Scenario: 連線失敗 — 無效 URL
- **WHEN** 使用者點擊「測試連線」且 URL 無法連線
- **THEN** 系統 SHALL 顯示錯誤訊息，說明無法連線至該伺服器

#### Scenario: 連線失敗 — 無效 API Key（401）
- **WHEN** 使用者點擊「測試連線」且 API Key 無效，API 回傳 401
- **THEN** 系統 SHALL 顯示「認證失敗：API Key 無效或已過期」

#### Scenario: 連線失敗 — 無效 API Key（redirect）
- **WHEN** 使用者點擊「測試連線」且 API Key 無效，伺服器回傳 302 redirect
- **THEN** 系統 SHALL 顯示「認證失敗：伺服器重新導向，請確認 API Key 是否正確」

#### Scenario: 連線失敗 — 非 JSON 回應
- **WHEN** 使用者點擊「測試連線」且伺服器回傳成功但 Content-Type 不含 JSON
- **THEN** 系統 SHALL 顯示「認證失敗：伺服器回傳非 JSON 回應，請確認 URL 與 API Key 是否正確」

### Requirement: 設定 Redmine 連線資訊
系統 SHALL 提供設定頁面，讓使用者輸入 Redmine 伺服器 URL 和 API Key。URL 欄位 SHALL 提供下拉選項供快速選取，同時允許手動輸入自訂 URL。

#### Scenario: 首次啟動無設定
- **WHEN** 使用者首次啟動應用程式且尚無設定資料
- **THEN** 系統 SHALL 導向設定頁面

#### Scenario: 輸入連線資訊
- **WHEN** 使用者在設定頁面輸入 Redmine URL 和 API Key
- **THEN** 系統 SHALL 顯示「測試連線」按鈕

#### Scenario: 從下拉選項選取 URL
- **WHEN** 使用者點擊 URL 輸入欄位
- **THEN** 系統 SHALL 顯示預設 URL 選項（包含 `https://your-redmine.example.com/`），使用者可選取或繼續手動輸入

## ADDED Requirements

### Requirement: API 回應統一檢查
系統所有 Redmine API 呼叫 SHALL 在解析 JSON 前先檢查回應狀態與 Content-Type，對 401/302/非 JSON 回應回傳明確的認證失敗錯誤訊息，而非 JSON 解析錯誤。

#### Scenario: 任意 API 呼叫遇到 401
- **WHEN** 任何 Redmine API 呼叫回傳 HTTP 401
- **THEN** 系統 SHALL 回傳「認證失敗：API Key 無效或已過期」錯誤

#### Scenario: 任意 API 呼叫遇到 redirect
- **WHEN** 任何 Redmine API 呼叫回傳 3xx redirect
- **THEN** 系統 SHALL 回傳認證失敗相關錯誤訊息
