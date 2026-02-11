## Why

Initial MVP 完成後，實際使用發現多個問題：API 認證錯誤訊息不明確（顯示「解析回應失敗」而非認證錯誤）、Redmine API 回傳的 snake_case 欄位與 Rust serde 設定的 camelCase 不匹配導致 JSON 解析失敗、建立 Issue 的表單預設值不符合實際使用習慣。需要修正這些問題以讓應用程式能正常運作並提升使用體驗。

## What Changes

- 修正 Redmine API 認證錯誤處理：停用 reqwest 自動 redirect，偵測 401/302/非 JSON 回應並顯示明確的認證失敗訊息
- 修正 serde 序列化不匹配：移除 Rust models 的 `rename_all = "camelCase"`，統一前後端使用 snake_case 欄位名稱
- 新增 Redmine URL 預設下拉選項（`https://your-redmine.example.com/`），同時保留手動輸入
- 建立 Issue 表單預設值優化：追蹤標籤預設「工作」、優先權預設「正常」、被分派者預設登入本人、日期欄位預設為空

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `redmine-connection`：改善 API 認證錯誤處理與錯誤訊息，新增 URL 預設選項
- `issue-management`：修正 JSON 欄位序列化，優化建立 Issue 表單預設值

## Impact

- `src-tauri/src/redmine/client.rs`：HTTP client redirect policy、回應檢查邏輯
- `src-tauri/src/redmine/models.rs`：移除所有 `rename_all = "camelCase"`
- `src/lib/api.ts`：TypeScript 型別欄位名改為 snake_case
- `src/components/IssueForm.tsx`：表單預設值邏輯
- `src/components/IssueList.tsx`：欄位引用更新
- `src/pages/IssueDetailPage.tsx`：欄位引用更新
- `src/pages/TimeEntryPage.tsx`：欄位引用更新
- `src/pages/SetupPage.tsx`：URL datalist 下拉選項
