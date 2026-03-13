## Why

使用者目前只能透過完整編輯模式修改 issue 的監看者清單，無法快速切換自己的追蹤狀態。需要回 Redmine 網頁才能方便地 watch/unwatch issue。

## What Changes

- Issue 詳情頁 header 新增 Watch/Unwatch toggle 按鈕
- 按鈕根據當前使用者是否在 watchers 清單中顯示不同狀態
- 點擊按鈕透過 Redmine API 新增/移除自己為監看者
- 操作後自動更新 issue 資料

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`: 新增 issue 詳情頁的快速 watch/unwatch 功能

## Impact

- 後端：新增 `add_watcher`、`remove_watcher` client 方法與 Tauri commands
- 前端頁面：`IssueDetailPage.tsx` 新增 toggle 按鈕，利用 AppContext 取得當前使用者 ID
