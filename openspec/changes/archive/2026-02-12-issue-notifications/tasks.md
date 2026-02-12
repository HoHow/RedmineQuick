## 1. Tauri Plugin 與依賴

- [x] 1.1 安裝 `tauri-plugin-notification`（Cargo.toml + npm + capabilities）
- [x] 1.2 在 `lib.rs` 註冊 notification plugin

## 2. System Tray

- [x] 2.1 新增 `src-tauri/src/tray.rs`：建立 TrayIcon + 右鍵選單（打開 / 退出）
- [x] 2.2 Tray 圖示左鍵點擊 → 顯示視窗
- [x] 2.3 攔截視窗 `close_requested` 事件，改為隱藏視窗
- [x] 2.4 在 `lib.rs` 的 setup hook 中初始化 Tray

## 3. 背景 Polling

- [x] 3.1 新增 `src-tauri/src/polling.rs`：背景 task 定時 fetch 指派給自己的 Issue
- [x] 3.2 比對 `last_known_ids` 偵測新 Issue，首次建立 baseline 不通知
- [x] 3.3 偵測到新 Issue 時 emit `new-issue` 事件到前端
- [x] 3.4 偵測到新 Issue 時發送 OS 原生通知（標題、Issue 編號 + 主題）
- [x] 3.5 在 `lib.rs` 的 setup hook 中啟動 polling task

## 4. 通知點擊跳轉

- [x] 4.1 OS 通知點擊後 emit `navigate-to-issue` 事件到前端
- [x] 4.2 前端監聯 `navigate-to-issue` 事件，navigate 到 `/issues/{id}`

## 5. 前端通知系統

- [x] 5.1 新增 `src/contexts/NotificationContext.tsx`：通知狀態管理 + localStorage 持久化
- [x] 5.2 在 App.tsx 掛載 NotificationProvider，監聽 `new-issue` 事件
- [x] 5.3 登出時清除通知記錄

## 6. Navbar 通知 UI

- [x] 6.1 Layout.tsx 新增鈴鐺 SVG 按鈕 + 未讀數量紅點
- [x] 6.2 通知下拉列表：顯示 Issue 編號、主題、時間
- [x] 6.3 點擊通知項目 → navigate 到 Issue 詳情 + 標為已讀
- [x] 6.4 「清除全部」按鈕

## 7. 樣式

- [x] 7.1 鈴鐺按鈕、紅點、通知下拉列表樣式
