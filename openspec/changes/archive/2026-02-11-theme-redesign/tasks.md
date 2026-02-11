## 1. CSS 變數架構

- [x] 1.1 在 `:root` 定義所有亮色主題 CSS 變數（15 個變數）
- [x] 1.2 新增 `[data-theme="dark"]` 區塊定義暗色主題 CSS 變數
- [x] 1.3 移除現有的 `@media (prefers-color-scheme: dark)` 區塊

## 2. 全面替換色碼為 CSS 變數

- [x] 2.1 替換 Layout 相關樣式（navbar、main-content、背景色）
- [x] 2.2 替換通用元素樣式（loading、error、success、link、empty-state）
- [x] 2.3 替換按鈕樣式（button、primary-button、back-button、navbar-settings）
- [x] 2.4 替換表單樣式（input、select、textarea）
- [x] 2.5 替換面板與列表樣式（panel、project-item、issue-table、issue-row）
- [x] 2.6 替換 Issue 詳情樣式（detail-row、detail-label、description、journal-item）

## 3. 主題切換邏輯

- [x] 3.1 在 Layout 組件新增主題 state 與初始化邏輯（讀取 localStorage，fallback 系統偏好）
- [x] 3.2 新增 `toggleTheme` 函式，切換 `data-theme` 並寫入 localStorage
- [x] 3.3 在 Navbar 新增主題切換按鈕（亮色顯示 🌙、暗色顯示 ☀️）

## 4. 版面佈局調整

- [x] 4.1 Dashboard 改為 sidebar（專案列表 ~200px）+ main（Issue table）佈局
- [x] 4.2 Issue table 精簡為 #、主旨、狀態、優先權（Dashboard 額外顯示專案欄）
- [x] 4.3 Issue 詳情頁 detail-section 改為兩欄 grid 佈局
