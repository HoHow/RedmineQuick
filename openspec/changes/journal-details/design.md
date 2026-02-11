## Context

Issue 詳情頁目前的歷程區塊只顯示有 notes 的 journal，Rust `Journal` struct 和 TypeScript `Journal` 介面都沒有 `details` 欄位。Redmine API 在 `include=journals` 時已經回傳 details 陣列，但因 struct 未定義而被 serde 忽略。

## Goals / Non-Goals

**Goals:**
- 顯示 journal 的完整欄位變更記錄（details）
- ID 值對照為可讀名稱（statuses、priorities、trackers、members）
- 提供全部 / 筆記 / 變更 tab 篩選
- 舊值紅底、新值綠底的視覺標示

**Non-Goals:**
- 不做 journal 的編輯/刪除功能（截圖中的筆、刪除圖示）
- 不做相對時間顯示（如「約 10 小時前」），維持目前的絕對時間格式
- 不做 attachment 變更顯示

## Decisions

### 1. Rust Journal struct 加 details

新增 `JournalDetail` struct 和 `Journal.details` 欄位：

```rust
pub struct JournalDetail {
    pub property: String,    // "attr", "attachment", "cf" 等
    pub name: String,        // "status_id", "done_ratio" 等
    pub old_value: Option<String>,
    pub new_value: Option<String>,
}

pub struct Journal {
    // ...existing fields
    pub details: Vec<JournalDetail>,
}
```

不需要修改 API 請求路徑，Redmine 已在 journals 中回傳 details。

### 2. 名稱對照策略

在 `IssueDetailPage` 載入時，額外 fetch statuses、priorities、trackers、memberships，建立 lookup map：

```typescript
type LookupMap = Record<string, Record<string, string>>;
// { "status_id": { "1": "新建立", "5": "進行中" }, ... }
```

只對照以下欄位，其他欄位直接顯示原始值：
- `status_id` → listStatuses()
- `priority_id` → listPriorities()
- `tracker_id` → listTrackers()
- `assigned_to_id` → listMemberships(projectId)

**替代方案**：在 Rust 端做對照 — 但這需要額外 API 呼叫在後端，增加複雜度。前端已有現成的 API function，直接在前端做更簡單。

### 3. 欄位名中文對照

前端維護一個靜態 map：

```typescript
const FIELD_LABELS: Record<string, string> = {
  status_id: "狀態",
  priority_id: "優先權",
  tracker_id: "追蹤標籤",
  assigned_to_id: "分派給",
  done_ratio: "完成百分比",
  due_date: "完成日期",
  start_date: "開始日期",
  subject: "主旨",
  description: "概述",
  estimated_hours: "預估工時",
};
```

未知欄位直接顯示原始 name。

### 4. Tab 篩選

使用 `useState<"all" | "notes" | "changes">` 控制 journal 過濾：
- `all`: 顯示所有 journal
- `notes`: 只顯示 `journal.notes` 不為空的
- `changes`: 只顯示 `journal.details.length > 0` 的

複用現有的 `.tab-group` / `.tab-button` CSS 樣式。

### 5. 載入時機

將 lookup 資料的 fetch 與 getIssue 合併到同一個 `Promise.all`，不影響現有載入流程：

```
Promise.all([
  getIssue(id),
  listStatuses(),
  listPriorities(),
  listTrackers(),
  listMemberships(projectId)  // 需要先知道 projectId
])
```

注意：`projectId` 需從 issue 取得，所以 memberships 必須在 getIssue 之後再 fetch，或分兩階段載入。

決定：先 getIssue 取得 projectId，再 fetch 其餘 lookup 資料。statuses、priorities、trackers 可與 getIssue 並行。

## Risks / Trade-offs

- **額外 API 呼叫**：每次進入 issue 詳情會多 3-4 個 API 呼叫（statuses、priorities、trackers、memberships）→ 可接受，這些資料量小且回應快
- **memberships 需要 projectId**：必須等 getIssue 完成後才能 fetch → 分兩階段載入，memberships 稍晚到位
- **未知欄位**：Redmine 自訂欄位（cf_xxx）無法對照名稱 → 直接顯示原始 name，未來可擴充
