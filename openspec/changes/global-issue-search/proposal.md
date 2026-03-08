## Why

目前要找特定 Issue 只能逐一進入專案翻閱列表，或記住 Issue 編號後手動輸入 URL。缺少全域搜尋功能，影響日常使用效率。

## What Changes

- 新增浮動搜尋對話框，透過 Cmd+K 或 Navbar 搜尋圖示觸發
- 輸入數字即時預覽 Issue（by ID），輸入文字按 Enter 搜尋 Issue 主旨
- 情境感知：在專案頁面搜該專案，在 Dashboard 搜全部專案
- 支援鍵盤操作（↑/↓ 選擇、Enter 確認、ESC 關閉）
- Rust 後端新增搜尋 Issue API command

## Capabilities

### New Capabilities

- `issue-search`: 全域搜尋與快速跳轉 Issue 功能，包含搜尋對話框 UI、鍵盤快捷鍵、情境感知搜尋邏輯

### Modified Capabilities

（無）

## Impact

- `src-tauri/src/commands/issues.rs`：新增 `search_issues` command
- `src-tauri/src/redmine/client.rs`：新增搜尋 API 呼叫方法
- `src/components/`：新增 SearchDialog 元件群組
- `src/contexts/`：新增 SearchContext 管理搜尋框開關狀態
- `src/components/Navbar.tsx`：新增搜尋圖示按鈕
- `src/lib/api.ts`：新增 `searchIssues` 函式
