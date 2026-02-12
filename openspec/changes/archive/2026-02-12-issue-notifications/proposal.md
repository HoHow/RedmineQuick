## Why

目前使用者只能主動開啟 App 查看是否有新指派的 Issue，容易遺漏。需要讓 App 能在背景常駐（System Tray），定時檢查 Redmine 是否有新指派的 Issue，並透過系統通知和 App 內通知提醒使用者。

## What Changes

- 新增 System Tray 常駐功能，關閉視窗時隱藏而非退出
- 新增 Rust 背景 polling，每 2 分鐘檢查指派給自己的新 Issue
- 收到新 Issue 時發送 OS 原生通知，點擊通知可直接跳到該 Issue 詳情頁
- Navbar 新增通知鈴鐺按鈕 + 未讀紅點 + 通知下拉列表
- 通知記錄持久化到 localStorage，App 重啟後保留

## Capabilities

### New Capabilities
- `issue-polling`: Rust 背景定時 polling Redmine API，偵測新指派的 Issue
- `system-tray`: System Tray 常駐、視窗關閉改為隱藏、Tray 選單
- `notifications`: OS 原生通知 + App 內通知列表（鈴鐺 + 紅點 + 下拉列表 + localStorage 持久化）

### Modified Capabilities

（無既有 spec 需要修改）

## Impact

- **Rust 後端**：新增 polling 背景執行緒、System Tray 設定、通知 plugin 整合、需要讀取前端 credentials（API Key + URL）
- **Tauri 設定**：新增 `tray-icon`、`notification` plugin、相關 capabilities 權限
- **前端**：新增通知 Context、Navbar 鈴鐺 UI、deep link 導航
- **依賴**：`tauri-plugin-notification`、Tauri tray icon API
