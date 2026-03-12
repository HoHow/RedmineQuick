## Context

現有的 `polling.rs` 每 2 分鐘 poll `GET /issues.json?assigned_to_id=me&status_id=open`，記錄已知 Issue ID 集合，偵測新增的 Issue。前端 `NotificationContext` 監聽 `new-issue` 事件，在 Navbar 鈴鐺顯示通知。

Issue struct 目前沒有 `updated_on` 欄位。Redmine API 的 `/issues.json` 回傳中包含 `updated_on`，但 `journals` 需透過 `?include=journals` 或單筆 `GET /issues/{id}.json?include=journals` 取得。

## Goals / Non-Goals

**Goals:**
- 偵測「指派給我的 Issue」有新留言時發送通知
- 通知內容包含留言者名稱和 Issue 主旨
- 最小化額外 API 呼叫（只查 `updated_on` 有變動的 Issue）

**Non-Goals:**
- 不偵測欄位變更（狀態、優先權等變動不通知）
- 不偵測非指派給我的 Issue
- 不做 WebSocket/即時推送（維持 polling 架構）

## Decisions

### 使用 updated_on 差異偵測 + 單筆 API 確認

polling 每次取得 Issue 列表時，比對每筆 Issue 的 `updated_on` 與上次記錄值。只有變動的 Issue 才額外呼叫 `GET /issues/{id}.json?include=journals` 取得完整 journals，再比對最新 journal 是否含有 notes（留言）。

替代方案：對每筆 Issue 都打單筆 API → 太重，25 筆就是 25 次呼叫。

### 新增獨立事件類型 `new-comment`

與既有的 `new-issue` 事件分開，前端可分別處理顯示邏輯。`new-comment` 事件包含 `issueId`、`subject`、`projectName`、`authorName`（留言者）。

### 記錄 HashMap<issue_id, updated_on> 取代 HashSet<issue_id>

將 `known_ids: HashSet<u64>` 改為 `known_issues: HashMap<u64, String>`，key 為 Issue ID，value 為 `updated_on` 時間戳。首次 poll 建立 baseline（不通知），後續偵測差異。

### 排除自己的留言

取得新 journal 時，比對留言者 ID 與目前使用者 ID，排除自己的留言，避免自己留言自己收到通知。需要在 polling 時持有使用者資訊。

## Risks / Trade-offs

- [Issue 更新但不是留言] `updated_on` 變化後查 journals 發現只是欄位變更（無 notes），此次查詢浪費 → 接受，因為多數更新伴隨留言，且只是單筆 API call
- [polling 間隔內多次留言] 只會通知最新一筆 → 可接受，2 分鐘內多次留言是少見情況
