## Context

RedmineQuick 目前的附件功能僅支援「讀取」：在 Issue 詳情頁顯示附件列表、圖片預覽、下載到本地。使用者無法在應用內上傳檔案。

Redmine REST API 的附件上傳為兩步驟流程：
1. `POST /uploads.json`（`Content-Type: application/octet-stream`，body 為 raw bytes）→ 回傳 `{ "upload": { "token": "..." } }`
2. 建立/更新 Issue 時在 payload 加入 `uploads: [{ token, filename, content_type }]`

現有架構：Tauri command → `RedmineClient` → Redmine API，前端透過 `invoke()` 呼叫後端。

## Goals / Non-Goals

**Goals:**
- 使用者可在建立 Issue 時選擇並上傳多個檔案附件
- 使用者可在編輯 Issue 時追加多個檔案附件
- 支援系統檔案對話框（點擊按鈕）和 Drag & Drop 兩種選檔方式
- 選完檔案後可在列表中預覽待上傳檔案並逐一移除
- 檔案在 Submit 時才上傳（非選檔即上傳）

**Non-Goals:**
- 不支援刪除已存在的附件（Redmine API 需要額外的 DELETE 權限）
- 不支援上傳進度條（單檔上傳為單次 HTTP request，難以追蹤進度）
- 不支援檔案大小限制檢查（由 Redmine server 端決定）
- 不在 Issue 列表頁顯示附件資訊

## Decisions

### 1. 檔案讀取方式：Tauri command 讀取本地檔案

**選擇**：前端透過 Tauri dialog plugin 取得檔案路徑，將路徑傳給 Rust 後端讀取並上傳。

**替代方案**：前端用 `<input type="file">` 讀取為 ArrayBuffer 再傳給後端。

**理由**：
- Tauri dialog 提供原生系統檔案選擇器體驗，已在 `save_attachment` 中使用
- 直接在 Rust 端讀取檔案避免大檔案跨 IPC 傳輸（前端 → 後端的 base64 encoding 會增加 33% 大小）
- Drag & Drop 的檔案路徑可透過 Tauri 的 drag-drop event 取得

### 2. Drag & Drop 實作：Tauri drag-drop event

**選擇**：使用 Tauri 的 `onDragDropEvent` window event 監聽拖曳事件，取得檔案的本地路徑。

**替代方案**：使用 HTML5 drag-and-drop API。

**理由**：
- Tauri window 的 drag-drop event 直接提供完整的本地檔案路徑陣列
- HTML5 drag-and-drop 在 webview 中取得的 `File` 物件無法直接取得完整路徑
- 與系統對話框方式統一為「路徑導向」，後端上傳邏輯一致

### 3. Upload 流程：Submit 時序列上傳

**選擇**：使用者點擊 Submit → 依序上傳每個檔案取得 token → 所有 token 收集完畢後建立/更新 Issue。

**流程**：
```
使用者按 Submit
  → setSubmitting(true)
  → for each file:
      invoke("upload_attachment", { filePath }) → token
  → invoke("create_issue", { params: { ...fields, uploads: tokens } })
  → 完成 / 錯誤處理
```

**替代方案**：選檔立即上傳（token 保留在 state 中，Submit 時直接帶入）。

**理由**：
- 流程更直覺：Submit = 全部動作一次完成
- 避免使用者選了檔案但未 Submit 造成 orphan uploads
- 實作較簡單，state 管理僅需本地檔案路徑列表

**Trade-off**：Submit 等待時間較長（含上傳時間），需顯示上傳進度狀態。

### 4. 前端附件 state：本地檔案路徑列表

**選擇**：`IssueForm` 內部維護 `pendingFiles: PendingFile[]` state，其中 `PendingFile` 包含 `path`（完整路徑）、`name`（檔名）、`size`（檔案大小）。

submit 時由上層 page component（`IssueCreatePage` / `IssueDetailPage`）負責呼叫 upload + create/update。`IssueForm` 的 `onSubmit` callback 簽名改為同時傳遞 `IssueParams` 和 `PendingFile[]`。

### 5. Rust upload_attachment command

新增 Tauri command：

```rust
#[tauri::command]
pub async fn upload_attachment(app: AppHandle, file_path: String) -> Result<UploadToken, String>
```

- 讀取本地檔案（`tokio::fs::read`）
- 從路徑推斷 filename
- POST 至 `/uploads.json`，`Content-Type: application/octet-stream`，body 為 raw bytes
- 回傳 `UploadToken { token, filename, content_type }`

`RedmineClient` 新增 `upload_file` 方法，使用 `reqwest` 直接傳送 bytes body（不需 multipart）。

### 6. IssueParams.uploads 欄位

Rust `IssueParams` 和 TypeScript `IssueParams` 都新增：

```rust
pub uploads: Option<Vec<UploadInfo>>
```

```typescript
uploads?: UploadInfo[]
```

其中 `UploadInfo = { token: string, filename: string, content_type: string }`。

### 7. 取得檔案 metadata：新增 get_file_metadata command

前端在顯示待上傳列表時需要檔名和檔案大小。由於檔案路徑來自 Tauri（dialog 或 drag-drop），前端無法直接讀取檔案 metadata。

新增 Tauri command：

```rust
#[tauri::command]
pub async fn get_file_metadata(file_path: String) -> Result<FileMetadata, String>
```

回傳 `FileMetadata { name, size, path }`。

## Risks / Trade-offs

- **大檔案上傳可能 timeout** → Redmine server 通常有 upload size limit（預設 5MB），此限制由 server 控制，錯誤訊息會由 API 回傳
- **多檔案序列上傳較慢** → 對於一般使用情境（1-5 個檔案）影響不大。未來可考慮並行上傳
- **Drag & Drop 在不同 OS 行為可能不同** → Tauri 的 drag-drop event 已跨平台處理，風險較低
- **Submit 中途某個檔案上傳失敗** → 已成功上傳的 token 會成為 orphan（Redmine 會自動清理未使用的 upload），向使用者顯示錯誤，保留表單內容讓使用者重試
