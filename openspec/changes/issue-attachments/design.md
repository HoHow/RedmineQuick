## Context

Redmine API 在 `include=attachments` 時回傳附件陣列。附件的 `content_url` 需要 API Key 才能存取。在 Tauri app 中，前端無法直接帶 API Key header 存取外部 URL，需要透過 Rust 後端代理。

## Goals / Non-Goals

**Goals:**
- 在 Issue 詳情頁顯示附件列表
- 圖片附件 inline 預覽 + 點擊放大
- 非圖片附件顯示檔名 + 大小 + 下載
- 透過 Rust 後端代理所有附件存取（解決 API Key 驗證問題）

**Non-Goals:**
- 不做附件上傳功能
- 不做附件刪除功能
- 不做非圖片檔案的 inline 預覽（如 PDF）

## Decisions

### 1. Rust Attachment struct

新增 `Attachment` struct：

```rust
pub struct Attachment {
    pub id: u64,
    pub filename: String,
    pub filesize: u64,
    pub content_type: String,
    pub content_url: String,
    pub author: IdName,
    pub created_on: String,
}
```

`Issue` struct 新增 `attachments: Option<Vec<Attachment>>`。

### 2. get_issue include 參數

將 `get_issue` 的 include 從 `watchers,journals` 改為 `watchers,journals,attachments`。

### 3. 附件下載代理

新增 Rust command `download_attachment(url: String) -> Vec<u8>`：
- 使用已存的 RedmineClient 的 HTTP client + API Key
- 直接 GET content_url，回傳 bytes

但 Tauri command 不方便直接回傳大量 bytes 給前端顯示圖片。改為：

**方案 A**：回傳 base64 string，前端用 `data:image/xxx;base64,...` 顯示
**方案 B**：Tauri custom protocol

選擇方案 A — 簡單直接，附件通常不大（截圖幾 MB 以內）。

```rust
pub async fn download_attachment(app: AppHandle, url: String) -> Result<String, String> {
    // GET url with API Key header
    // return base64 encoded content
}
```

前端呼叫 `downloadAttachment(url)` 取得 base64 string，轉為 data URL。

### 4. 檔案下載（存檔）

非圖片檔案的下載使用 Tauri 的 `dialog::save_file` 選擇路徑，再透過 Rust 寫入檔案。

新增 command `save_attachment(url: String, path: String) -> ()`。

### 5. 圖片載入策略

Issue 載入時不立即下載所有圖片。改為：
- 先顯示附件列表（檔名、大小等 metadata）
- 圖片附件各自獨立 fetch base64（useEffect per image，或批次）
- 顯示 loading placeholder 直到圖片載入完成

### 6. Lightbox

簡單的 lightbox：一個 fixed overlay + img，點擊背景或 Escape 關閉。不使用外部 library。

## Risks / Trade-offs

- **Base64 記憶體**：大圖片轉 base64 會膨脹約 33%。但 issue 附件通常是截圖，幾 MB 可接受。
- **多圖片載入**：如果 issue 有很多圖片附件，同時 fetch 可能造成延遲 → 可用逐一載入，先到先顯示
- **content_url 可能是絕對或相對路徑**：Redmine API 通常回傳絕對 URL，但需確認。如果是相對路徑需拼接 base_url。
