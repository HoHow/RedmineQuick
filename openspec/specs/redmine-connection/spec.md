## ADDED Requirements

### Requirement: 設定 Redmine 連線資訊
系統 SHALL 提供登入頁面，讓使用者輸入 Redmine 伺服器 URL 和 API Key。URL 欄位 SHALL 提供下拉選項供快速選取，同時允許手動輸入自訂 URL。登入頁面 SHALL 自動填入上次儲存的 URL 和 API Key（若有）。

#### Scenario: 首次啟動無設定
- **WHEN** 使用者首次啟動應用程式且尚無設定資料
- **THEN** 系統 SHALL 導向登入頁面

#### Scenario: 輸入連線資訊
- **WHEN** 使用者在登入頁面輸入 Redmine URL 和 API Key
- **THEN** 系統 SHALL 顯示「登入」按鈕

#### Scenario: 從下拉選項選取 URL
- **WHEN** 使用者點擊 URL 輸入欄位
- **THEN** 系統 SHALL 顯示預設 URL 選項（包含 `https://your-redmine.example.com/`），使用者可選取或繼續手動輸入

#### Scenario: 登入頁面預填已儲存的連線資訊
- **WHEN** 使用者進入登入頁面且本機已有儲存的 URL 和 API Key
- **THEN** 系統 SHALL 自動填入已儲存的 URL 和 API Key

### Requirement: 測試 Redmine 連線
系統 SHALL 透過呼叫 Redmine API (`GET /users/current.json`) 驗證 URL 和 API Key 是否正確。使用者點擊「登入」按鈕時，系統 SHALL 執行連線測試，成功後自動儲存設定並進入主畫面。系統 SHALL 停用 HTTP 自動 redirect，並在收到 401、302、或非 JSON 回應時顯示明確的認證失敗訊息。

#### Scenario: 登入成功
- **WHEN** 使用者點擊「登入」且 URL 和 API Key 有效
- **THEN** 系統 SHALL 儲存設定、記錄使用者資訊、並導向主畫面（Dashboard）

#### Scenario: 連線失敗 — 無效 URL
- **WHEN** 使用者點擊「登入」且 URL 無法連線
- **THEN** 系統 SHALL 顯示錯誤訊息，說明無法連線至該伺服器

#### Scenario: 連線失敗 — 無效 API Key（401）
- **WHEN** 使用者點擊「登入」且 API Key 無效，API 回傳 401
- **THEN** 系統 SHALL 顯示「認證失敗：API Key 無效或已過期」

#### Scenario: 連線失敗 — 無效 API Key（redirect）
- **WHEN** 使用者點擊「登入」且 API Key 無效，伺服器回傳 302 redirect
- **THEN** 系統 SHALL 顯示「認證失敗：伺服器重新導向，請確認 API Key 是否正確」

#### Scenario: 連線失敗 — 非 JSON 回應
- **WHEN** 使用者點擊「登入」且伺服器回傳成功但 Content-Type 不含 JSON
- **THEN** 系統 SHALL 顯示「認證失敗：伺服器回傳非 JSON 回應，請確認 URL 與 API Key 是否正確」

### Requirement: 儲存連線設定
系統 SHALL 在登入成功時，將 Redmine URL 和 API Key 持久化儲存於本機。登出時 SHALL 保留已儲存的設定，以便下次登入時自動填入。

#### Scenario: 登入時自動儲存
- **WHEN** 使用者登入成功
- **THEN** 系統 SHALL 自動儲存 URL 和 API Key 至本機

#### Scenario: 登出後保留設定
- **WHEN** 使用者登出
- **THEN** 系統 SHALL 保留本機已儲存的 URL 和 API Key，不清除

### Requirement: 修改連線設定
系統 SHALL 允許使用者透過 Navbar 使用者下拉選單進入設定頁面，修改已儲存的 Redmine 連線設定。

#### Scenario: 從使用者下拉選單進入設定
- **WHEN** 使用者點擊 Navbar 上的使用者名稱，再點擊下拉選單中的「設定」
- **THEN** 系統 SHALL 顯示登入頁面，並預填目前已儲存的 URL 和 API Key

### Requirement: 自動登入
系統 SHALL 在啟動時，若本機已有儲存的連線設定，自動進行連線驗證。

#### Scenario: 自動登入成功
- **WHEN** 應用程式啟動且本機有已儲存的 URL 和 API Key，且連線驗證成功
- **THEN** 系統 SHALL 自動設定使用者資訊並導向主畫面

#### Scenario: 自動登入失敗
- **WHEN** 應用程式啟動且本機有已儲存的 URL 和 API Key，但連線驗證失敗
- **THEN** 系統 SHALL 導向登入頁面，並預填已儲存的 URL 和 API Key

#### Scenario: 自動登入期間顯示載入狀態
- **WHEN** 應用程式正在進行自動登入驗證
- **THEN** 系統 SHALL 顯示載入畫面

### Requirement: 登出功能
系統 SHALL 提供登出功能，讓使用者清除目前的登入狀態並返回登入頁面。

#### Scenario: 使用者登出
- **WHEN** 使用者點擊 Navbar 使用者下拉選單中的「登出」
- **THEN** 系統 SHALL 清除使用者狀態並導向登入頁面

#### Scenario: 登出後 config 保留
- **WHEN** 使用者登出後進入登入頁面
- **THEN** 登入頁面 SHALL 自動填入上次使用的 URL 和 API Key

### Requirement: Navbar 使用者資訊顯示
系統 SHALL 在 Navbar 右側顯示已登入使用者的名稱，並提供下拉選單。

#### Scenario: 顯示使用者名稱
- **WHEN** 使用者已登入
- **THEN** Navbar 右側 SHALL 顯示使用者的姓名

#### Scenario: 使用者下拉選單
- **WHEN** 使用者點擊 Navbar 上的使用者名稱
- **THEN** 系統 SHALL 顯示下拉選單，包含「設定」和「登出」選項

#### Scenario: 點擊外部關閉下拉選單
- **WHEN** 下拉選單已展開，使用者點擊選單外部區域
- **THEN** 系統 SHALL 關閉下拉選單

### Requirement: API 回應統一檢查
系統所有 Redmine API 呼叫 SHALL 在解析 JSON 前先檢查回應狀態與 Content-Type，對 401/302 回應、以及帶有 body 但 Content-Type 不含 json 的成功回應，回傳明確的認證失敗錯誤訊息，而非 JSON 解析錯誤。無 body 的成功回應（HTTP 204 No Content，或 Content-Length 為 0）SHALL 視為操作成功，SHALL NOT 因缺少 JSON Content-Type 而誤判為認證失敗。

#### Scenario: 任意 API 呼叫遇到 401
- **WHEN** 任何 Redmine API 呼叫回傳 HTTP 401
- **THEN** 系統 SHALL 回傳「認證失敗：API Key 無效或已過期」錯誤

#### Scenario: 任意 API 呼叫遇到 redirect
- **WHEN** 任何 Redmine API 呼叫回傳 3xx redirect
- **THEN** 系統 SHALL 回傳認證失敗相關錯誤訊息

#### Scenario: 更新 Issue 收到 204 No Content
- **WHEN** client 發出 `PUT /issues/{id}.json` 且伺服器回傳 204 No Content（無 body、無 Content-Type）
- **THEN** 系統 SHALL 視為操作成功，不顯示錯誤訊息

#### Scenario: 伺服器回傳 HTML 網頁
- **WHEN** 伺服器對 API 請求回傳成功狀態碼，但帶有 body 且 Content-Type 不含 `json`（例如 HTML 登入頁）
- **THEN** 系統 SHALL 回報認證失敗錯誤，提示使用者確認 URL 與 API Key

##### Example: 回應分類邊界
| 狀態碼 | Content-Type | Content-Length | 判定 |
| ------ | ------------ | -------------- | ---- |
| 204 | (無) | (無) | 成功 |
| 200 | (無) | 0 | 成功 |
| 200 | application/json | >0 | 成功 |
| 200 | text/html | >0 | 認證失敗錯誤 |

## Requirements

