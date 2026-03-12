## Why

目前背景 polling 只偵測「新 Issue 指派」，當有人在指派給我的 Issue 留言（journal with notes）時，使用者不會收到通知，必須手動進入詳情頁才能發現。對於需要即時回應的團隊協作場景，這是明顯的缺口。

## What Changes

- 擴展 polling 邏輯：記錄每筆 Issue 的 `updated_on` 時間戳，偵測變動
- 當 `updated_on` 變化時，呼叫單筆 Issue API 取得最新 journals，判斷是否有新留言
- 有新留言時發送 OS 原生通知和 in-app 通知，顯示留言者和 Issue 主旨
- Issue model 新增 `updated_on` 欄位

## Capabilities

### New Capabilities

（無新增 capability）

### Modified Capabilities

- `issue-management`: Issue model 新增 `updated_on` 欄位

## Impact

- `src-tauri/src/redmine/models.rs`：Issue struct 新增 `updated_on`
- `src-tauri/src/polling.rs`：擴展 polling 邏輯，偵測 `updated_on` 變化並比對 journals
- `src/lib/api.ts`：Issue interface 新增 `updated_on`
- `src/contexts/NotificationContext.tsx`：支援新的留言通知事件類型
