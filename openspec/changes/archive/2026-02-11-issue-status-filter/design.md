## Context

目前 Rust 端 `list_my_issues` 寫死 `status_id=open`，`list_project_issues` 不傳 status（Redmine 預設只回 open）。需要讓前端能指定 status 參數。

Redmine API 支援的 `status_id` 值：
- `open` — 未關閉
- `closed` — 已關閉
- `*` — 全部

## Goals / Non-Goals

**Goals:**
- 讓 `list_my_issues` 和 `list_project_issues` 接受 status 參數
- Dashboard 加 tab 切換（待處理/已完成）
- 專案 Issue 列表加狀態篩選按鈕（未關閉/已關閉/全部）

**Non-Goals:**
- 不做個別狀態（如「進行中」「新建立」）的細粒度篩選
- 不做分頁（維持 limit=100）

## Decisions

### 1. Rust command 加 status 參數

**選擇**: `list_my_issues` 和 `list_project_issues` 各加一個 `status: String` 參數，直接傳給 Redmine API 的 `status_id`。

**理由**: 簡單直接，不需新增 command，前端控制篩選邏輯。

### 2. Dashboard tab 用 useState 控制

**選擇**: 用 `useState<"open" | "closed">` 管理 tab 狀態，切換時重新呼叫 API。

**理由**: 簡單，不需 cache 兩組資料。已完成 issue 不常看，每次切換重抓可接受。

### 3. 專案 Issue 列表用 filter button group

**選擇**: 三個按鈕 `[未關閉] [已關閉] [全部]`，用 `useState` 管理，切換時重新呼叫 API。

**理由**: 比 select dropdown 更直覺，一眼看到所有選項。

## Risks / Trade-offs

- **每次切換都打 API**: 不做 cache，但 Redmine API 回應通常很快（< 500ms），可接受
- **limit=100**: 已完成 issue 可能很多，只取前 100 筆。未來可加分頁
