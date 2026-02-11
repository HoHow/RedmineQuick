## ADDED Requirements

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
