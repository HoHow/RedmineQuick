## MODIFIED Requirements

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
