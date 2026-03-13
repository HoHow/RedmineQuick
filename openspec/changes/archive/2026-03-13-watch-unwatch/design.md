## Context

Issue 詳情頁已有 watchers 顯示（在 detail grid 中列出監看者名單）。`AppContext` 提供 `user.id` 可判斷當前使用者是否為監看者。Redmine API 提供專用的 watcher 端點：
- `POST /issues/{id}/watchers.json` body `{"user_id": N}` — 新增
- `DELETE /issues/{id}/watchers/{user_id}.json` — 移除

## Goals / Non-Goals

**Goals:**

- 在 Issue 詳情頁快速切換自己的 watch/unwatch 狀態
- 按鈕清楚顯示當前追蹤狀態

**Non-Goals:**

- 不提供替其他使用者 watch/unwatch 的功能
- 不修改現有編輯模式中的監看者 checkbox 功能

## Decisions

### Watch/Unwatch 按鈕位置

放在 header 區塊的操作按鈕列（與「記錄工時」「編輯」同排）。

理由：watch/unwatch 是高頻操作，應放在最容易觸及的位置。

### 使用專用 API 端點

使用 `POST /issues/{id}/watchers.json` 和 `DELETE /issues/{id}/watchers/{user_id}.json`，而非透過 issue update 修改 `watcher_user_ids`。

理由：專用端點語意明確，不會觸發 issue 的 updated_on 更新，也不需要送出完整的 watcher 列表。

### 操作後更新 issue 資料

操作完成後呼叫 `refreshIssue()` 更新 watchers 清單，確保 UI 狀態一致。

## Risks / Trade-offs

- [權限問題] → 部分 Redmine 設定可能不允許使用者自行 watch/unwatch，API 呼叫會回傳錯誤，前端顯示錯誤訊息即可。
