## Context

目前 `src-tauri/src/lib.rs` 使用 `on_window_event` 攔截 `CloseRequested` 事件，呼叫 `api.prevent_close()` + `window.hide()` 來隱藏視窗而非退出 app。System Tray 圖示的點擊已在 `tray.rs` 處理。

問題在於 macOS 的 Dock 圖示點擊觸發的是 `RunEvent::Reopen` 事件，而目前 `.run(tauri::generate_context!())` 沒有攔截任何 `RunEvent`，因此 Dock 點擊無法重新顯示視窗。

## Goals / Non-Goals

**Goals:**
- macOS 上點擊 Dock 圖示能重新顯示已隱藏的主視窗

**Non-Goals:**
- 不改變 System Tray 的行為（已正常運作）
- 不改變 Windows 平台的行為

## Decisions

### 使用 `.build()` + `app.run()` 取代 `.run()`

將 `lib.rs` 中的 `tauri::Builder::default().run()` 改為 `.build()` 取得 `App` 實例後，呼叫 `app.run(callback)` 來攔截 `RunEvent::Reopen`。

**替代方案：**
- 使用 Tauri plugin 監聽事件 → 過度工程化，`RunEvent` 是最直接的方式

**實作：**

```rust
let app = tauri::Builder::default()
    // ...setup...
    .build(tauri::generate_context!())
    .expect("error while building tauri application");

app.run(|app_handle, event| {
    if let tauri::RunEvent::Reopen { has_visible_windows, .. } = event {
        if !has_visible_windows {
            if let Some(window) = app_handle.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
    }
});
```

## Risks / Trade-offs

- [風險] `.build()` + `app.run()` 的 API 形式與目前的 `.run()` 不同 → 變更量極小，只影響 `lib.rs` 最後幾行
- [風險] `RunEvent::Reopen` 是否在所有 macOS 版本上可用 → Tauri 2 官方支援此事件，對應 `applicationShouldHandleReopen:hasVisibleWindows:`
