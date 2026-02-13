## Why

macOS 上點擊視窗左上角紅色關閉按鈕後，視窗正確隱藏（app 仍在背景執行），但再次點擊 Dock 圖示時視窗無法重新開啟，必須完全退出 app 才能重新啟動。原因是目前只處理了 System Tray 圖示的點擊事件，缺少 macOS Dock `Reopen` 事件的處理。

## What Changes

- 處理 Tauri `RunEvent::Reopen` 事件，在 macOS 點擊 Dock 圖示時重新顯示已隱藏的主視窗

## Capabilities

### New Capabilities

（無新增 capability）

### Modified Capabilities

- `redmine-connection`: 補充 macOS 視窗關閉後點擊 Dock 圖示應重新開啟視窗的行為需求

## Impact

- `src-tauri/src/lib.rs`：需將 `.run()` 改為 `.build()` + `app.run()` 以攔截 `RunEvent::Reopen`
- 僅影響 macOS 平台，Windows 不受影響
