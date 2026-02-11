## Why

Issue 詳情頁目前只顯示有筆記的 journal，沒有顯示欄位變更記錄（如狀態變更、完成百分比調整等）。使用者無法在 app 內追蹤 issue 的完整歷程，需要切回 Redmine 網頁才能看到。

## What Changes

- Rust `Journal` struct 新增 `details` 欄位，接收 Redmine API 回傳的欄位變更記錄
- TypeScript 新增 `JournalDetail` 型別，`Journal` 介面加入 `details`
- Issue 詳情頁歷程區塊改版：
  - 顯示所有 journal（含純變更、純筆記、混合）
  - 變更記錄以「欄位 從 舊值 變更為 新值」格式呈現，舊值紅底、新值綠底
  - 新增 全部 / 筆記 / 變更 tab 篩選
- 載入 issue 時同步拉取 statuses、priorities、trackers、memberships 建立 ID→名稱 lookup，讓變更記錄顯示可讀名稱而非 ID

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`: 新增 issue 歷程顯示需求（journal details 欄位變更記錄、tab 篩選、名稱對照）

## Impact

- `src-tauri/src/redmine/models.rs` — Journal struct 新增 details
- `src/lib/api.ts` — Journal 介面、新增 JournalDetail 型別
- `src/pages/IssueDetailPage.tsx` — 歷程區塊改版、載入 lookup 資料
- `src/App.css` — 變更記錄樣式（紅底舊值、綠底新值、tab）
