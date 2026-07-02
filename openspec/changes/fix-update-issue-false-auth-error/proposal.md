# 修復更新 Issue 後誤報認證失敗的問題

## Problem

在 Issue 詳情頁更新狀態(或任何欄位)後,畫面顯示錯誤訊息「認證失敗:伺服器回傳非 JSON 回應,請確認 URL 與 API Key 是否正確」。實際上更新已成功寫入 Redmine,但使用者看到的是認證失敗,誤以為操作失敗或連線設定壞掉。

## Root Cause

Redmine 的 `PUT /issues/{id}.json` 成功時回傳 **204 No Content** — 沒有 body、也沒有 JSON Content-Type header。

`check_response()`(`src-tauri/src/redmine/client.rs`)在登入流程重構(auth-flow-redesign)時加入,目的是偵測「URL 指到 HTML 網頁而非 API」的設定錯誤。但它對**所有**成功回應一律要求 Content-Type 含 `json`,導致無 body 的 204 回應被誤判為認證失敗。

同樣的誤判也影響所有回傳 204 的操作:`delete`(移除追蹤者)、`post_empty`(加入追蹤者)、`create_time_entry`(工時登錄)。

## Proposed Solution

`check_response()` 對「成功但無 body」的回應(HTTP 204,或 Content-Length 為 0)跳過 Content-Type 檢查。

原本的保護力不變:HTML 登入頁必定有 body,仍會被 Content-Type 檢查攔截。

以 TDD 方式修復:先寫失敗測試 `update_issue_accepts_204_no_content`(mockito 模擬 204 回應)重現錯誤,再修正 `check_response` 使測試轉綠。

## Success Criteria

- 更新 Issue 狀態成功後,不再顯示「認證失敗:伺服器回傳非 JSON 回應」錯誤
- `cargo test` 全數通過,含新增的 204 回歸測試
- URL 指到非 API 網頁(回傳 HTML)時,仍正確回報認證失敗錯誤
- `cargo clippy` 無新增警告

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `redmine-connection`: 新增「無 body 成功回應的處理」需求 — API client 對 HTTP 204(或 Content-Length 為 0)的成功回應 SHALL 視為成功,不得誤判為認證失敗

## Impact

- Affected specs: `redmine-connection`(ADDED 一條需求,既有需求不變)
- Affected code:
  - `src-tauri/src/redmine/client.rs` — 修正 `check_response` 並新增回歸測試
  - `src-tauri/src/redmine/models.rs` — `IssueParams` 補 `Default` derive(供測試建構參數)
