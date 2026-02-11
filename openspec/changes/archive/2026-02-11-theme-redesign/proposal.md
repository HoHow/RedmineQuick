## Why

目前配色紅色 navbar 搭配藍色按鈕，兩個強色衝突，整體視覺不協調。Dark mode 僅透過 `prefers-color-scheme` 跟隨系統，覆蓋不完整且無法手動切換。此外，版面配置有數個問題：Dashboard 兩欄 1:1 比例不適合（專案列表短、Issue table 寬），Issue table 欄位過多導致擁擠，Issue 詳情頁資訊密度低（單行排列滾動長）。

## What Changes

- 將所有寫死的色碼改為 CSS 變數（`--color-bg`, `--color-text`, `--color-primary` 等）
- Light mode 配色：navbar `#1e293b`、背景 `#f8fafc`、主色 `#3b82f6`
- Dark mode 配色：navbar `#0f172a`、背景 `#0f172a`、主色 `#60a5fa`
- 移除現有的 `@media (prefers-color-scheme: dark)` 區塊，改用 `[data-theme="dark"]` 覆寫 CSS 變數
- Navbar 新增亮暗模式切換按鈕
- 使用 `localStorage` 記住使用者選擇，預設跟隨系統偏好
- Dashboard 改為 sidebar（專案列表）+ main（Issue table）佈局
- Issue table 精簡欄位（移除追蹤標籤、被分派者、完成度，改為 #、主旨、狀態、優先權）
- Issue 詳情頁欄位改為兩欄 grid 佈局，減少垂直滾動

## Capabilities

### New Capabilities

- `theme-system`: 亮暗模式切換系統，包含 CSS 變數架構、主題切換邏輯、偏好持久化

### Modified Capabilities

（無——版面調整屬於實作細節，不影響 spec 層級的功能需求）

## Impact

- `src/App.css`：全面改寫，所有色碼改為 CSS 變數 + 版面佈局調整
- `src/components/Layout.tsx`：新增主題切換按鈕與邏輯
- `src/pages/DashboardPage.tsx`：改為 sidebar + main 佈局
- `src/components/IssueList.tsx`：精簡 table 欄位
- `src/pages/IssueDetailPage.tsx`：詳情欄位改為兩欄 grid
- `localStorage`：新增 `theme` key 儲存偏好
