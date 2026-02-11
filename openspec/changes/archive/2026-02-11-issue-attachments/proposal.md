## Why

Issue 詳情頁目前無法查看附件。使用者若要查看 issue 的附件（特別是截圖或文件），需要切回 Redmine 網頁。附件是 issue 的重要組成部分，應在 app 內直接顯示。

## What Changes

- Rust `Issue` struct 新增 `attachments` 欄位，接收 Redmine API 回傳的附件資訊
- Rust 端新增 `get_issue` 的 include 參數加入 `attachments`
- Rust 端新增附件下載代理 command（透過 API key 驗證後回傳二進位資料）
- TypeScript 新增 `Attachment` 型別，`Issue` 介面加入 `attachments`
- Issue 詳情頁新增附件區塊：
  - 圖片附件以縮圖 inline 預覽，可點擊放大
  - 其他檔案顯示檔名、大小、下載連結
- 新增前端附件下載 API function

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`: 新增 issue 附件顯示需求（附件列表、圖片預覽、檔案下載）

## Impact

- `src-tauri/src/redmine/models.rs` — 新增 Attachment struct，Issue 加 attachments
- `src-tauri/src/redmine/client.rs` — get_issue include 加 attachments，新增下載方法
- `src-tauri/src/commands/issues.rs` — 新增 download_attachment command
- `src/lib/api.ts` — 新增 Attachment 型別，Issue 加 attachments，新增下載 function
- `src/pages/IssueDetailPage.tsx` — 附件區塊 UI
- `src/App.css` — 附件列表與圖片預覽樣式
