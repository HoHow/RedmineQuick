## 1. Rust 端 Journal 擴充

- [x] 1.1 新增 `JournalDetail` struct（property, name, old_value, new_value）
- [x] 1.2 `Journal` struct 新增 `details: Vec<JournalDetail>` 欄位

## 2. TypeScript 型別對應

- [x] 2.1 新增 `JournalDetail` 介面，`Journal` 介面加入 `details: JournalDetail[]`

## 3. 名稱對照 lookup

- [x] 3.1 IssueDetailPage 載入時 fetch statuses、priorities、trackers（與 getIssue 並行）
- [x] 3.2 getIssue 完成後再 fetch memberships(projectId)，建立完整 lookup map
- [x] 3.3 建立 `FIELD_LABELS` 靜態 map（status_id→狀態、priority_id→優先權 等）
- [x] 3.4 建立 `resolveValue(fieldName, value, lookup)` 輔助函式，將 ID 轉為可讀名稱

## 4. 歷程 UI

- [x] 4.1 移除現有的 notesJournals 過濾，改為顯示所有 journal
- [x] 4.2 每筆 journal 顯示 details 列表：「欄位 從 舊值 變更為 新值」格式
- [x] 4.3 處理無舊值（設定為）和無新值（已清除）的顯示邏輯
- [x] 4.4 每筆 journal 顯示編號 #N（依序號）
- [x] 4.5 新增 全部 / 筆記 / 變更 tab 篩選（複用 .tab-group 樣式）

## 5. 樣式

- [x] 5.1 新增變更記錄樣式：舊值紅底（.detail-old-value）、新值綠底（.detail-new-value）
- [x] 5.2 調整 journal-item 樣式支援 details + notes 混合顯示
