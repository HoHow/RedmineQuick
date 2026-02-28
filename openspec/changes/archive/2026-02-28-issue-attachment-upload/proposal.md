## Why

目前 RedmineQuick 只能在 Issue 詳情頁**檢視和下載**附件，無法在建立或編輯 Issue 時上傳檔案。使用者必須切回瀏覽器的 Redmine 網頁才能附加檔案，中斷了桌面應用的工作流程。

## What Changes

- Rust 後端新增 `upload_file` 方法，透過 `POST /uploads.json`（`application/octet-stream`）上傳檔案至 Redmine 並取得 upload token
- Rust 後端新增 `upload_attachment` Tauri command，接收本地檔案路徑，讀取並上傳
- `IssueParams` 新增 `uploads` 欄位，支援在建立/更新 Issue 時附帶 upload token
- 前端 `IssueForm` 新增附件選擇區域，支援：
  - 系統檔案對話框（透過 Tauri dialog plugin 開啟原生檔案選擇器）
  - Drag & Drop 拖曳檔案
  - 多檔案選擇
  - 已選檔案列表顯示（含檔名、大小），可逐一移除
- Submit 流程改為：先上傳所有檔案取得 token → 再帶 uploads 建立/更新 Issue
- `reqwest` 啟用 `stream` feature 以支援原始 binary 上傳

## Capabilities

### New Capabilities
- `attachment-upload`: 在建立或編輯 Issue 時上傳檔案附件至 Redmine

### Modified Capabilities
- `issue-management`: 建立與編輯 Issue 的表單新增附件上傳欄位，submit 流程加入檔案上傳步驟

## Impact

- **Cargo.toml**: `reqwest` 需新增 `stream` feature
- **models.rs**: 新增 `UploadResponse`、`UploadInfo` struct，`IssueParams` 新增 `uploads` 欄位
- **client.rs**: 新增 `upload_file()` 方法
- **commands/issues.rs**: 新增 `upload_attachment` command
- **lib.rs**: 註冊新 command
- **api.ts**: 新增 `uploadAttachment()` 函式和 `UploadInfo` 型別，`IssueParams` 新增 `uploads` 欄位
- **IssueForm.tsx**: 新增檔案選擇 UI（按鈕 + Drag & Drop）、已選檔案列表、submit 流程修改
- **IssueCreatePage.tsx** / **IssueDetailPage.tsx**: 傳遞上傳相關 props
- **CSS**: 新增 Drag & Drop 區域和檔案列表樣式
- **capabilities/default.json**: 可能需新增 `dialog:allow-open` 權限（需確認）
