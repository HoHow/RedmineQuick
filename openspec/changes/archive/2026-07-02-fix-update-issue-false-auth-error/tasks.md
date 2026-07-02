## 1. 修復 check_response 對 204 回應的誤判

- [x] 1.1 以 TDD 新增失敗測試 `update_issue_accepts_204_no_content`(mockito 模擬 `PUT /issues/1.json` 回傳 204、無 Content-Type),重現「認證失敗:伺服器回傳非 JSON 回應」錯誤 — 驗證:`cargo test update_issue_accepts_204_no_content` 紅燈且錯誤訊息與 bug 一致
- [x] 1.2 修正「API 回應統一檢查」行為,無 body 成功回應不再誤判:`check_response`(`src-tauri/src/redmine/client.rs`)對 HTTP 204 或 Content-Length 為 0 的成功回應跳過 Content-Type 檢查,帶 body 的非 JSON 成功回應仍回報認證失敗 — 驗證:1.1 測試轉綠、`cargo test` 全數通過、`cargo clippy` 無新增警告
- [x] 1.3 `IssueParams`(`src-tauri/src/redmine/models.rs`)補 `Default` derive,測試得以用預設值建構更新參數 — 驗證:`cargo test` 編譯並通過

## 2. 手動驗證

- [x] 2.1 在 app 中實際更新 Issue 狀態,確認畫面不再顯示「認證失敗:伺服器回傳非 JSON 回應」且狀態正確更新 — 驗證:手動操作確認
