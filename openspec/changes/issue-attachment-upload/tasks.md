## 1. Rust 後端：資料模型與依賴

- [x] 1.1 在 `Cargo.toml` 的 `reqwest` features 新增 `stream`
- [x] 1.2 在 `models.rs` 新增 `UploadResponse`（`{ upload: { token } }`）、`UploadInfo`（`{ token, filename, content_type }`）struct
- [x] 1.3 在 `IssueParams` 新增 `uploads: Option<Vec<UploadInfo>>` 欄位（含 `skip_serializing_if`）
- [x] 1.4 在 `models.rs` 新增 `FileMetadata`（`{ name, size, path }`）struct
- [x] 1.5 撰寫 `models.rs` 新增 struct 的單元測試（序列化/反序列化驗證）

## 2. Rust 後端：upload_file API client 方法

- [x] 2.1 在 `client.rs` 新增 `upload_file(&self, file_bytes: Vec<u8>, filename: &str) -> Result<String, String>` 方法，POST `/uploads.json`，`Content-Type: application/octet-stream`，回傳 token
- [x] 2.2 撰寫 `upload_file` 的單元測試（mock HTTP 或結構驗證）

## 3. Rust 後端：Tauri commands

- [x] 3.1 在 `commands/issues.rs` 新增 `upload_attachment(app, file_path) -> UploadToken` command，讀取本地檔案並呼叫 `client.upload_file`
- [x] 3.2 在 `commands/issues.rs` 新增 `get_file_metadata(file_path) -> FileMetadata` command
- [x] 3.3 在 `lib.rs` 的 `invoke_handler![]` 中註冊 `upload_attachment` 和 `get_file_metadata`
- [x] 3.4 撰寫 `get_file_metadata` 的單元測試（使用 tempfile 驗證）

## 4. 前端：型別定義與 API 函式

- [x] 4.1 在 `api.ts` 新增 `UploadInfo`、`FileMetadata` 型別
- [x] 4.2 在 `IssueParams` 新增 `uploads?: UploadInfo[]` 欄位
- [x] 4.3 在 `api.ts` 新增 `uploadAttachment(filePath: string): Promise<UploadInfo>` 函式
- [x] 4.4 在 `api.ts` 新增 `getFileMetadata(filePath: string): Promise<FileMetadata>` 函式

## 5. 前端：IssueForm 附件 UI

- [x] 5.1 在 `IssueForm` 新增 `pendingFiles` state（`PendingFile[]`，含 path、name、size）
- [x] 5.2 新增「選擇檔案」按鈕，點擊呼叫 Tauri dialog plugin 開啟系統檔案選擇器，取得路徑後透過 `getFileMetadata` 取得檔名和大小，加入 `pendingFiles`
- [x] 5.3 新增 Drag & Drop 區域，使用 Tauri window 的 `onDragDropEvent` 監聽拖曳事件，取得檔案路徑加入 `pendingFiles`
- [x] 5.4 新增待上傳檔案列表顯示（檔名、大小、移除按鈕）
- [x] 5.5 修改 `onSubmit` callback 簽名，同時傳遞 `IssueParams` 和 `PendingFile[]`
- [x] 5.6 新增附件區域和檔案列表的 CSS 樣式（含 Drag & Drop hover 高亮效果）

## 6. 前端：Submit 流程整合

- [x] 6.1 修改 `IssueCreatePage` 的 `handleSubmit` / `handleSubmitContinue`：先呼叫 `uploadAttachment` 上傳所有檔案取得 token，再帶入 `uploads` 呼叫 `createIssue`
- [x] 6.2 修改 `IssueDetailPage` 的編輯 submit handler：同上邏輯，上傳檔案後帶入 `uploads` 呼叫 `updateIssue`
- [x] 6.3 Submit 過程中顯示上傳狀態（例如「上傳中 (2/5)...」）
- [x] 6.4 處理上傳失敗：顯示錯誤訊息，保留表單和待上傳列表
- [x] 6.5 「繼續建立」成功後清除待上傳附件列表

## 7. 測試

- [x] 7.1 安裝前端測試框架（vitest + @testing-library/react）
- [x] 7.2 撰寫 `IssueForm` 附件 UI 元件測試：檔案列表顯示、移除檔案、空狀態提示
- [x] 7.3 撰寫 submit 流程測試：mock uploadAttachment，驗證先上傳再 create/update 的呼叫順序
- [x] 7.4 撰寫 Rust 端 integration test：驗證 `IssueParams` 含 `uploads` 時的 JSON 序列化格式正確
