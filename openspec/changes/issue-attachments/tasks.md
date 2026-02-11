## 1. Rust 端 Attachment 擴充

- [x] 1.1 新增 `Attachment` struct（id, filename, filesize, content_type, content_url, author, created_on）
- [x] 1.2 `Issue` struct 新增 `attachments: Option<Vec<Attachment>>` 欄位
- [x] 1.3 `get_issue` 的 include 參數加入 `attachments`

## 2. Rust 端附件代理

- [x] 2.1 RedmineClient 新增 `download_attachment_base64(url: &str) -> Result<String, String>` 方法（GET URL + API Key，回傳 base64）
- [x] 2.2 新增 Tauri command `download_attachment(url: String) -> String`（回傳 base64）
- [x] 2.3 新增 Tauri command `save_attachment(url: String, filename: String) -> ()`（透過 dialog 選路徑，下載後寫入檔案）

## 3. TypeScript 型別與 API

- [x] 3.1 新增 `Attachment` 介面，`Issue` 介面加入 `attachments: Attachment[] | null`
- [x] 3.2 新增 `downloadAttachment(url: string): Promise<string>` function（回傳 base64）
- [x] 3.3 新增 `saveAttachment(url: string, filename: string): Promise<void>` function

## 4. 附件 UI

- [x] 4.1 IssueDetailPage 新增附件區塊，列出所有附件（檔名、大小、上傳者、時間）
- [x] 4.2 圖片附件以縮圖顯示（載入時 fetch base64，顯示 loading placeholder）
- [x] 4.3 點擊圖片開啟 lightbox（fixed overlay + 原始大小圖片 + Escape/點擊背景關閉）
- [x] 4.4 非圖片附件顯示下載按鈕，點擊觸發 saveAttachment

## 5. 樣式

- [x] 5.1 附件列表樣式（grid 排版、圖片縮圖、檔案項目）
- [x] 5.2 Lightbox 樣式（overlay、置中圖片、關閉按鈕）
