## ADDED Requirements

### Requirement: URL 協議驗證
系統 SHALL 強制使用 HTTPS 連線至 Redmine 伺服器，以保護 API Key 傳輸安全。

#### Scenario: 無協議前綴自動補 HTTPS
- **WHEN** 使用者輸入的 URL 不含協議前綴（如 `redmine.example.com`）
- **THEN** 系統 SHALL 自動補上 `https://` 前綴

#### Scenario: HTTP URL 拒絕連線
- **WHEN** 使用者輸入以 `http://` 開頭的 URL 並點擊登入
- **THEN** 系統 SHALL 顯示錯誤訊息「基於安全考量，僅支援 HTTPS 連線」，並阻止登入

#### Scenario: HTTPS URL 正常連線
- **WHEN** 使用者輸入以 `https://` 開頭的 URL 並點擊登入
- **THEN** 系統 SHALL 正常執行連線測試
