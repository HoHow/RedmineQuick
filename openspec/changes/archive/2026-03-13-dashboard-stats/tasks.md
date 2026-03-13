## 1. 前端：Dashboard 新增數字摘要卡片，display issue summary statistics cards on dashboard

- [x] 1.1 在 `src/pages/DashboardPage.tsx` 新增 `StatsCards` 元件：計算待處理、逾期、本週到期、高優先四項數據，以卡片橫排顯示於「我的 Issue」tab 上方，僅在 open tab 顯示
- [x] 1.2 在 `src/App.css` 新增 `.stats-cards` 容器與 `.stat-card` 卡片樣式，逾期數字 > 0 時以紅色顯示
