## ADDED Requirements

### Requirement: 無 body 成功回應的處理
API client SHALL 將無 body 的成功回應(HTTP 204 No Content,或 Content-Length 為 0)視為操作成功。API client SHALL NOT 因無 body 回應缺少 JSON Content-Type 而回報認證失敗。帶有 body 的成功回應若 Content-Type 不含 `json`,API client SHALL 回報認證失敗錯誤(偵測 URL 指向網頁而非 API 的設定錯誤)。

#### Scenario: 更新 Issue 收到 204 No Content
- **WHEN** client 發出 `PUT /issues/{id}.json` 且伺服器回傳 204 No Content(無 body、無 Content-Type)
- **THEN** client SHALL 回報操作成功,不顯示錯誤訊息

#### Scenario: 伺服器回傳 HTML 網頁
- **WHEN** 伺服器對 API 請求回傳成功狀態碼,但帶有 body 且 Content-Type 不含 `json`(例如 HTML 登入頁)
- **THEN** client SHALL 回報認證失敗錯誤,提示使用者確認 URL 與 API Key

##### Example: 回應分類邊界
| 狀態碼 | Content-Type | Content-Length | 判定 |
| ------ | ------------ | -------------- | ---- |
| 204 | (無) | (無) | 成功 |
| 200 | (無) | 0 | 成功 |
| 200 | application/json | >0 | 成功 |
| 200 | text/html | >0 | 認證失敗錯誤 |
