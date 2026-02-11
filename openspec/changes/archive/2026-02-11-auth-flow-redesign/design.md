## Context

目前 RedmineQuick 的連線流程是「設定」模式：SetupPage 提供兩步驟（測試連線 → 儲存並進入），Navbar 只有「設定」按鈕。App 啟動時若有 config 直接進入 Dashboard，但 user 狀態為 null。沒有登出機制。

需要改造為「登入/登出」模式，讓使用者感受到明確的身份認證流程。

## Goals / Non-Goals

**Goals:**
- 將兩步驟（測試+儲存）合併為一鍵「登入」
- App 啟動時自動驗證已儲存的 config（auto-login）
- Navbar 顯示使用者名稱 + 下拉選單（設定、登出）
- 登出清除 user 狀態但保留 config 在 disk

**Non-Goals:**
- 不做多帳號切換
- 不做 session token / 過期管理
- 不改動 Rust 後端 API 邏輯

## Decisions

### 1. Route guard 改為檢查 user 而非 config

**選擇**: `AppRoutes` 中 `!config` → `!user` 作為 redirect 條件

**理由**: 登出後 config 仍保留在 disk（記住 API key），但 user 為 null 代表未登入。檢查 user 才能正確區分「已登入」與「已登出但有儲存設定」。

**替代方案**: 新增 `isAuthenticated` boolean — 多餘，user !== null 已足夠表達。

### 2. Auto-login 放在 AppContext useEffect

**選擇**: 在 `AppProvider` 的 `useEffect` 中，loadConfig 成功後接著 testConnection

```
loadConfig() → 有 config → testConnection(url, apiKey)
                              → 成功 → setUser(user)
                              → 失敗 → 保持 user = null（自動導向 /login）
           → 沒有 config → 保持 config = null, user = null（導向 /login）
```

**理由**: 集中在一處處理啟動邏輯，loading 狀態自然覆蓋整個過程。

### 3. 登入頁面重用 SetupPage 檔案

**選擇**: 重命名 `SetupPage.tsx` → `LoginPage.tsx`，修改內容

**理由**: 功能本質相同（輸入 URL + API Key），只是 UX 語意不同。不需要新建檔案。

### 4. Navbar 使用者下拉選單

**選擇**: 在 Layout.tsx 中用 `useState<boolean>` 控制 dropdown 顯示/隱藏，用 `useEffect` + document click listener 處理點擊外部關閉。

**結構**:
```
navbar-actions:
  [theme-toggle]
  [user-dropdown]
    ├── 觸發: 使用者名稱 ▾
    └── 選單:
        ├── 設定
        └── 登出
```

**理由**: 簡單的 boolean state + click outside 足夠，不需要 headless UI 或 portal。

### 5. logout 函數放在 AppContext

**選擇**: AppContext 新增 `logout()` 函數，清除 user 狀態（`setUser(null)`）

**理由**: user 狀態管理已在 AppContext，logout 邏輯也應在此。不清除 config（保留 disk 設定）。navigate 由呼叫端（Layout）負責。

## Risks / Trade-offs

- **Auto-login 延遲**: 啟動時多一次 HTTP 請求，增加載入時間約 0.5-2 秒 → 可接受，顯示 loading 即可
- **離線啟動**: 無網路時 auto-login 會失敗，導向登入頁 → 合理行為，使用者可等網路恢復後再按「登入」
- **Config 不清除**: 登出後 API Key 仍存在 disk → 在桌面應用情境下可接受，與瀏覽器記住密碼類似
