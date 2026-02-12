## Context

目前版本號顯示在 Layout navbar 的 dropdown 裡和 DashboardPage 底部。更新檢查在 DashboardPage 底部。需要整合到獨立的設定頁面，並在 navbar 加入齒輪入口和更新紅點。

更新紀錄來源為公開 repo `Oliver/RedmineQuick-releases` 的 GitHub Releases API。

## Goals / Non-Goals

**Goals:**
- navbar 新增齒輪圖示 + 更新紅點
- 新增 SettingsPage：版本號、檢查更新、更新紀錄
- 更新紀錄從 GitHub Releases API 拉取
- 移除 DashboardPage 底部版本號和檢查更新

**Non-Goals:**
- 不做其他設定項（主題切換保留在 navbar）
- 不做 changelog 的本地快取
- 不做 release notes 的 markdown 渲染（純文字顯示）

## Decisions

### 1. 更新狀態共享

UpdateChecker 啟動時檢查更新，結果需要讓 Layout 知道（顯示紅點）。

使用 `window.__updateAvailable` 全域變數 + 自訂事件：

```typescript
// UpdateChecker 偵測到更新時
window.__updateAvailable = true;
window.dispatchEvent(new Event("update-available"));

// Layout 監聽事件
window.addEventListener("update-available", () => setHasUpdate(true));
```

不用 Context 的原因：UpdateChecker 掛在 AppProvider 外層（或內層但獨立），只需傳一個 boolean，用事件最簡單。

### 2. GitHub Releases API

直接從前端 fetch：

```
GET https://api.github.com/repos/Oliver/RedmineQuick-releases/releases
```

回傳陣列，每筆包含：
- `tag_name`: "v0.2.0"
- `published_at`: "2026-02-15T..."
- `body`: release notes 文字

不需要驗證（公開 repo），不透過 Rust 後端。

注意：GitHub API 對未驗證請求限制 60 次/小時，設定頁面只在進入時 fetch 一次，足夠使用。

### 3. 齒輪圖示

使用 SVG 齒輪圖示（內嵌 SVG），不引入 icon library。紅點使用 CSS `::after` 偽元素。

### 4. 移除 DashboardPage 底部

移除以下內容：
- `appVersion` state 和 `getVersion()` 呼叫
- `checkingUpdate`、`updateMsg` state
- `handleCheckUpdate` function
- `.app-footer` 區塊

### 5. Layout dropdown 版本號

目前 Layout dropdown 也有 `v{appVersion}`，保留或移除？

決定：移除。版本號統一在設定頁面顯示，dropdown 只保留「登出」。也移除 Layout 中的 `appVersion` state 和 `getVersion()` import（如果齒輪紅點不需要版本號的話）。

### 6. 路由

新增 `/settings` 路由，放在已登入的路由群組內。

## Risks / Trade-offs

- **GitHub API rate limit**：60 次/小時（未驗證），每次進入設定頁 fetch 一次 → 正常使用足夠
- **release notes 格式**：GitHub release body 是 markdown，但我們顯示為純文字 → 簡單處理，未來可加 markdown 渲染
- **首次使用無 release**：公開 repo 尚未有 release 時顯示空狀態提示
