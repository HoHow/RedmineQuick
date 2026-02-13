## 1. 處理 macOS Dock Reopen 事件

- [x] 1.1 將 `lib.rs` 的 `.run(tauri::generate_context!())` 改為 `.build(tauri::generate_context!())` + `app.run(callback)`
- [x] 1.2 在 `app.run()` callback 中攔截 `RunEvent::Reopen`，當 `has_visible_windows` 為 false 時呼叫 `window.show()` + `window.set_focus()`
