## Why

目前 DashboardPage 首頁只有「我的專案」清單和「我的 Issue」表格，使用者每次開 app 需要自行掃描列表才能掌握工作狀態。新增數字摘要卡片可以讓使用者一眼掌握待處理 issue 的重點資訊。

## What Changes

在「我的 Issue」panel 上方新增四張統計摘要卡片，從現有的 `listMyIssues("open")` 資料聚合計算，不需要新的後端 API：

- **待處理**：open issues 總數
- **逾期**：`due_date < 今天` 且仍 open 的 issue 數量
- **本週到期**：`due_date` 在本週範圍內的 issue 數量
- **高優先**：priority 為「高」或「緊急」等級的 issue 數量

## Capabilities

### New Capabilities

- `dashboard-stats`: Dashboard 首頁顯示數字摘要卡片（待處理、逾期、本週到期、高優先）

### Modified Capabilities

(none)

## Impact

- Affected specs: `dashboard-stats`（新增）
- Affected code:
  - `src/pages/DashboardPage.tsx`
  - `src/App.css`
