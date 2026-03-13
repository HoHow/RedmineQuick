## Context

DashboardPage 是使用者每次開啟 app 的首頁，目前包含「我的專案」清單和「我的 Issue」表格。`listMyIssues("open")` 已回傳完整的 `Issue[]`，包含 `due_date`、`priority`、`status` 等欄位，足以在前端聚合統計數據。

## Goals / Non-Goals

**Goals:**

- 在「我的 Issue」panel 上方新增四張數字摘要卡片
- 從現有 `myIssues` 陣列聚合計算，不新增後端 API
- 逾期卡片以視覺提示（紅色）突顯

**Non-Goals:**

- 不做圖表或分布視覺化
- 不做按專案篩選的統計
- 不新增後端 API

## Decisions

### 統計卡片內容與計算邏輯

四張卡片皆從 `myIssues`（open status）聚合：

| 卡片 | 計算方式 |
|------|---------|
| 待處理 | `myIssues.length` |
| 逾期 | `due_date < today` 且 `due_date` 不為 null |
| 本週到期 | `due_date` 在本週一到本週日之間 |
| 高優先 | `priority.id >= 4`（Redmine 預設：4=高, 5=緊急） |

### 高優先判斷方式

Redmine 預設 priority id 為 1=低, 2=一般, 3=中, 4=高, 5=緊急。使用 `priority.id >= 4` 作為高優先閾值，涵蓋「高」和「緊急」兩個等級。

### UI 佈局

統計卡片以橫排 flex 排列，放在 tab 切換按鈕上方。僅在 `tab === "open"` 時顯示（已完成的 issue 不需要這些統計）。

### 卡片樣式

- 統一寬度，flex 等分
- 逾期數量 > 0 時，數字以紅色顯示
- 每張卡片顯示：標籤（上）+ 數字（下）

## Risks / Trade-offs

- **Priority ID 假設**：假設 Redmine 預設 priority id >= 4 為高優先。若使用者自訂 priority，可能不準確。但對大多數 Redmine 部署是正確的，且避免了額外的字串比對邏輯。
- **本週範圍**：使用 ISO 週（週一起算）。不同文化可能以週日起算，但 ISO 週在專案管理場景較通用。
