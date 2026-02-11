## Context

目前 `App.css` 使用寫死的色碼值，dark mode 透過 `@media (prefers-color-scheme: dark)` 實作但覆蓋不完整（缺少 detail-label、journal-item、issue-table 等）。Navbar 為紅色 `#b71c1c` 搭配藍色按鈕 `#1976d2`，兩個強色衝突。

版面方面，Dashboard 使用 1:1 兩欄 grid，但專案列表短、Issue table 寬（8 欄），比例不適合。Issue 詳情頁所有欄位單行排列，資訊密度低。

## Goals / Non-Goals

**Goals:**
- 統一配色為沉穩深色系（Slate + Blue）
- 使用 CSS 變數實現完整的亮暗模式
- 提供手動切換按鈕，並持久化偏好
- 所有 UI 元素在兩種主題下都正確顯示
- Dashboard 改為 sidebar + main 佈局，提升空間利用率
- Issue table 精簡欄位，減少擁擠
- Issue 詳情頁改為兩欄 grid，提高資訊密度

**Non-Goals:**
- 不提供自訂主題色彩功能
- 不新增第三方 CSS 框架
- 不做 RWD（此為桌面工具，視窗大小固定）

## Decisions

### 1. CSS 變數命名與分組

**選擇**：依語義分組命名，如 `--color-bg`、`--color-bg-secondary`、`--color-text`、`--color-text-secondary`、`--color-primary`、`--color-border`、`--color-navbar`。

**理由**：語義命名讓變數與用途對應，比 `--slate-800` 更易維護。變數數量控制在 15 個以內，避免過度抽象。

### 2. 主題切換機制

**選擇**：在 `<html>` 元素加 `data-theme="dark"` 屬性，用 `[data-theme="dark"]` CSS 選擇器覆寫變數。

**理由**：data attribute 是業界標準做法，與 Tailwind、Radix 等框架慣例一致。

### 3. 主題邏輯放置位置

**選擇**：在現有的 Layout 組件（`src/components/Layout.tsx`）中處理主題初始化與切換邏輯。

**理由**：Layout 已包覆所有頁面，是放置全域邏輯的合適位置。不需要新建 Context，用 `useState` + `useEffect` 即可。

### 4. 色彩方案（Slate + Blue）

**Light mode：**
| 變數 | 值 | 用途 |
|------|------|------|
| `--color-bg` | `#f8fafc` | 頁面背景 |
| `--color-bg-secondary` | `#ffffff` | 卡片、面板背景 |
| `--color-bg-tertiary` | `#f1f5f9` | 程式碼區塊、描述背景 |
| `--color-text` | `#1e293b` | 主要文字 |
| `--color-text-secondary` | `#64748b` | 次要文字、標籤 |
| `--color-text-tertiary` | `#94a3b8` | 提示文字、日期 |
| `--color-primary` | `#3b82f6` | 主要按鈕、連結 |
| `--color-primary-hover` | `#2563eb` | 主要按鈕 hover |
| `--color-border` | `#e2e8f0` | 邊框、分隔線 |
| `--color-border-light` | `#f1f5f9` | 細分隔線 |
| `--color-navbar` | `#1e293b` | Navbar 背景 |
| `--color-error` | `#dc2626` | 錯誤文字 |
| `--color-error-bg` | `#fef2f2` | 錯誤背景 |
| `--color-success` | `#16a34a` | 成功文字 |
| `--color-success-bg` | `#f0fdf4` | 成功背景 |

**Dark mode：**
| 變數 | 值 |
|------|------|
| `--color-bg` | `#0f172a` |
| `--color-bg-secondary` | `#1e293b` |
| `--color-bg-tertiary` | `#334155` |
| `--color-text` | `#f1f5f9` |
| `--color-text-secondary` | `#94a3b8` |
| `--color-text-tertiary` | `#64748b` |
| `--color-primary` | `#60a5fa` |
| `--color-primary-hover` | `#3b82f6` |
| `--color-border` | `#334155` |
| `--color-border-light` | `#1e293b` |
| `--color-navbar` | `#0f172a` |
| `--color-error` | `#fca5a5` |
| `--color-error-bg` | `#451a1a` |
| `--color-success` | `#86efac` |
| `--color-success-bg` | `#14332a` |

### 5. Dashboard 改為 sidebar + main 佈局

**選擇**：專案列表作為左側 sidebar（寬度約 200px），Issue table 佔據右側主區域。

**理由**：專案列表項目少但需常駐，Issue table 需要橫向空間。sidebar 模式讓兩者各得其所，也更像傳統桌面應用的佈局。

### 6. Issue table 精簡欄位

**選擇**：保留 #、主旨、狀態、優先權 四欄。在 Dashboard 的 Issue table 額外顯示專案欄。

**理由**：追蹤標籤、被分派者、完成度在列表層級不常看，進詳情頁才需要。精簡後 table 不擁擠，主旨欄有更多空間顯示。

### 7. Issue 詳情頁兩欄 grid

**選擇**：detail-section 內的 detail-row 改為 `display: grid; grid-template-columns: 1fr 1fr`，每個欄位佔半行。

**理由**：詳情欄位多（10+），單行排列導致垂直滾動長。兩欄 grid 可將垂直高度減半，資訊一覽無遺。

## Risks / Trade-offs

- CSS 全面改寫，需確認所有元素在兩種主題下都正確顯示，特別是 select、input 等表單元素。
- `localStorage` 儲存主題偏好，若使用者清除瀏覽器資料會重置為系統預設，這是可接受的行為。
- Issue table 精簡欄位後，部分資訊需要進詳情頁才能看到，但這符合「快速存取」的工具定位。
