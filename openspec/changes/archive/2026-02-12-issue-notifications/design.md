## Context

目前 App 只在使用者主動開啟時顯示 Issue 資訊。Redmine 沒有 WebSocket 或 Push 機制，需要 App 端定時 polling 來偵測新 Issue。

Credentials（Redmine URL + API Key）已透過 `tauri-plugin-store` 存在 `config.json`，Rust 後端可直接讀取（`src-tauri/src/config.rs`）。

現有的 Redmine API 呼叫邏輯在 `src-tauri/src/redmine.rs`，可以複用。

## Goals / Non-Goals

**Goals:**
- App 背景常駐於 System Tray，關閉視窗不退出
- Rust 背景 polling 每 2 分鐘檢查新指派的 Issue
- 偵測到新 Issue 時發送 OS 原生通知 + App 內通知
- 點擊通知跳轉到 Issue 詳情頁
- 通知記錄持久化到 localStorage

**Non-Goals:**
- 不做 polling 頻率設定（固定 2 分鐘）
- 不做 Issue 更新通知（僅新指派的 Issue）
- 不做通知分類或篩選
- 不做勿擾模式

## Decisions

### 1. Polling 架構

在 Rust 端用 `tokio::spawn` 建立背景 task，使用 `tokio::time::interval` 定時 polling。

```
App 啟動
  │
  ▼
setup hook 中啟動 polling task
  │
  ▼
polling task loop:
  1. 讀取 config（URL + API Key）
  2. 若無 config → sleep 後重試
  3. GET /issues.json?assigned_to_id=me&status_id=open&sort=created_on:desc&limit=25
  4. 比對 last_known_ids（HashSet<u64>）
  5. 新 Issue → emit("new-issue", issue_data) + 發送 OS 通知
  6. 更新 last_known_ids
  7. sleep 2 分鐘
```

使用 `AppHandle` 來 emit 事件和讀取 config。`last_known_ids` 存在記憶體中（不需持久化，每次啟動重新建立 baseline）。

### 2. System Tray

使用 Tauri 2 的 `tray-icon` API（內建，不需額外 plugin）。

```rust
// src-tauri/src/tray.rs
use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    menu::{Menu, MenuItem},
    Manager,
};
```

- `TrayIconBuilder` 設定圖示和選單
- 攔截視窗 `close_requested` 事件，改為 `window.hide()`
- 左鍵點擊 Tray → `window.show()` + `window.set_focus()`
- 右鍵選單：「打開 RedmineQuick」、「退出」

Tray 圖示使用現有的 App icon（`icons/` 目錄）。

### 3. OS 通知

使用 `tauri-plugin-notification`。

```toml
# src-tauri/Cargo.toml
tauri-plugin-notification = "2"
```

通知格式：
- 標題：`新 Issue`
- 內容：`#123 修復登入頁面 Bug`

點擊通知的 deep link 處理：通知帶上 Issue ID，App 收到 action 事件後 emit 到前端，前端 navigate 到 `/issues/{id}`。

### 4. 前端通知系統

新增 `NotificationContext`，管理通知狀態和 localStorage 持久化。

```typescript
// src/contexts/NotificationContext.tsx
interface Notification {
  id: string;           // 唯一 ID（用 issue_id + timestamp）
  issueId: number;
  issueSubject: string;
  projectName: string;
  createdAt: string;    // ISO string
  read: boolean;
}
```

- 監聽 Tauri event `new-issue`，收到後加入通知列表
- 存入 `localStorage` key `notifications`
- App 啟動時從 localStorage 載入
- 登出時清除

### 5. Navbar 鈴鐺 UI

在 Layout.tsx 齒輪圖示旁新增鈴鐺 SVG 按鈕：

```
[🌙] [🔔 3] [⚙️] [使用者名 ▾]
```

- 紅點顯示未讀數量
- 點擊展開下拉列表（與 user dropdown 類似的 pattern）
- 每筆通知顯示 Issue 編號、主題、時間
- 點擊某筆 → navigate 到 Issue 詳情 + 標為已讀
- 底部「清除全部」按鈕

### 6. 深層連結（通知跳轉）

OS 通知點擊 → Rust 端 emit `navigate-to-issue` 事件 → 前端監聯 → `navigate(/issues/{id})`

需要在 Layout 或 App 層級監聽此事件。

## Risks / Trade-offs

- **首次啟動 baseline** — 第一次 fetch 記錄所有 Issue ID，不通知。若使用者在 App 關閉期間收到很多 Issue，重啟後會一次通知 → 可接受，使用者需要知道
- **Credentials 變更** — 使用者登出再登入時，polling 需要重新讀取 config → polling loop 每次都從 store 讀取，自然處理
- **macOS 通知權限** — 首次會彈授權框，使用者拒絕後 OS 通知不會顯示，但 App 內通知不受影響
- **Redmine API 負擔** — 每 2 分鐘一次 GET 請求，負擔極小
