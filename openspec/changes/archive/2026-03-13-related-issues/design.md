## Context

Issue 詳情頁已有子議題清單（ChildrenSection），使用 `GET /issues.json?parent_id={id}` 取得完整子議題資訊。現在需要新增相關議題（relations）顯示。

Redmine API 的 `include=relations` 只回傳關聯 metadata（issue_id、issue_to_id、relation_type），不含 issue 的 subject、status 等資訊。需要額外取得每個相關 issue 的基本資料。

## Goals / Non-Goals

**Goals:**

- 在 Issue 詳情頁顯示所有相關議題，包含關聯類型、tracker、編號、主旨、狀態、被分派者
- 自動處理關聯方向反轉（blocks ↔ blocked 等）
- 點擊可導航至相關議題

**Non-Goals:**

- 不提供新增、編輯、刪除 relation 的功能
- 不顯示 delay 值（precedes/follows 的天數延遲）

## Decisions

### 後端一站式處理相關議題

新增 `list_related_issues` Tauri command，由後端完成：取得 relations metadata → 方向反轉 → 逐一 fetch 相關 issue 基本資訊 → 回傳豐富化結果。

理由：與 sub-issues 相同模式，前端只需一次呼叫。後端處理方向反轉邏輯更乾淨。

### 在 Issue 結構加入 relations 欄位

在現有 `Issue` struct 加 `relations: Option<Vec<Relation>>`，而非建立獨立的 response 結構。

理由：`Issue` 的其他可選欄位（watchers、journals、attachments）已使用 `Option` 模式。relations 也是 Redmine 的 include 欄位，統一處理。

### 使用 get_issue_basic 取得相關 issue 資訊

新增 `get_issue_basic` 方法（`GET /issues/{id}.json` 不帶 include），避免載入 journals、attachments 等不必要的資料。

理由：每個相關 issue 只需 subject、status、tracker、assigned_to 等基本資訊，不需要完整的 include 資料。

### 方向反轉邏輯

`relation_type` 從 `issue_id` 角度描述。若當前 issue 是 `issue_to_id`，需反轉類型：
- duplicates ↔ duplicated
- blocks ↔ blocked
- precedes ↔ follows
- copied_to ↔ copied_from
- relates 不變（對稱）

反轉邏輯在後端處理，前端收到的已是正確方向。

### 相關議題區塊位置

放在 ChildrenSection 之後、AttachmentSection 之前。

## Risks / Trade-offs

- [N+1 查詢] → 每個相關 issue 需要一次額外的 API 請求。relations 通常少於 10 個，逐一查詢的延遲可接受。
- [權限問題] → 部分相關 issue 可能因權限不足無法存取，後端靜默跳過這些 issue。
