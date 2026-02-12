# Changelog

## v0.3.0

- 新增 System Tray：關閉視窗自動隱藏至系統匣，左鍵開啟、右鍵選單
- 新增背景 Polling：每 2 分鐘輪詢指派給自己的新 Issue
- 新增 OS 原生通知：新 Issue 時推送系統通知，點擊直接跳轉至 Issue 詳情
- 新增 Navbar 鈴鐺通知：未讀數量紅點、通知下拉列表、標記已讀、清除全部
- 通知紀錄持久化至 localStorage，登出時自動清除

## v0.2.0

- 新增自動更新功能（tauri-plugin-updater，雙 repo 架構）
- 新增設定頁面：版本資訊、檢查更新按鈕、更新紀錄
- Navbar 新增齒輪圖示，有更新時顯示紅點提示
- 新增 GitHub Actions 跨平台 build（macOS ARM/Intel + Windows）
- 移除 Dashboard 底部版本號與檢查更新

## v0.1.0

- 初始版本
- 登入 Redmine（API Key 驗證）
- Dashboard：我的專案列表、我的 Issue 列表（待處理/已完成）
- 專案 Issue 列表：篩選、排序、分頁
- Issue 詳情：屬性即時編輯、歷程紀錄、附件圖片預覽
- 新增 Issue、記錄工時
- 亮色/暗色主題切換
