## Why

目前 Issue 詳情頁只能檢視歷程紀錄，無法直接在 app 內新增留言（筆記）。使用者必須跳回瀏覽器才能回覆，中斷了桌面工具的快速操作體驗。新增留言與引用功能可以讓使用者完整地在 app 內完成 Issue 討論。

## What Changes

- 新增 Issue 留言功能：在 Issue 詳情頁底部加入 textarea + 送出按鈕，可直接新增筆記
- 新增引用功能：Issue 描述與每則歷程留言皆可一鍵引用，以 `> ` 前綴格式插入留言輸入框
- 多次引用內容累加，不覆蓋已輸入的文字
- 引用後自動捲動至輸入框並 focus
- 後端新增 `add_issue_note` Tauri command，呼叫 Redmine API `PUT /issues/:id.json` 帶 `notes` 參數

## Capabilities

### New Capabilities

_無_

### Modified Capabilities

- `issue-management`: 新增 Issue 留言（筆記）與引用概述功能至 Issue 詳情頁

## Impact

- **後端**: `src-tauri/src/redmine/client.rs` 新增方法、`src-tauri/src/commands/issues.rs` 新增 command
- **前端**: `src/pages/IssueDetailPage.tsx` 新增 NoteForm 元件與引用按鈕、`src/lib/api.ts` 新增 API 函式
- **測試**: 新增 NoteForm 元件測試、引用功能測試
- **API 依賴**: Redmine REST API `PUT /issues/:id.json`（已有權限，無新依賴）
