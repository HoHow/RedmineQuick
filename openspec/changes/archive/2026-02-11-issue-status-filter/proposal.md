## Why

目前 Dashboard 只顯示未關閉的待處理 issue，專案 Issue 列表也預設只顯示 open 狀態。使用者無法查看已完成的 issue，無法回顧做過什麼工作。

## What Changes

- Dashboard「我的 Issue」區塊新增 tab 切換：「待處理」與「已完成」
- 專案 Issue 列表頁新增狀態篩選：「未關閉」「已關閉」「全部」
- Rust 端 `list_my_issues` 和 `list_project_issues` 改為接受 status 參數，由前端傳入
- 前端 TypeScript API 對應新增 status 參數

## Capabilities

### New Capabilities

（無新增）

### Modified Capabilities

- `issue-management`: Dashboard 新增已完成 issue tab、專案 Issue 列表新增狀態篩選

## Impact

- `src-tauri/src/commands/issues.rs` — `list_my_issues`、`list_project_issues` 新增 status 參數
- `src/lib/api.ts` — 對應 TypeScript 函數新增 status 參數
- `src/pages/DashboardPage.tsx` — 新增 tab 切換 UI
- `src/pages/ProjectIssuesPage.tsx` — 新增狀態篩選 UI
- `src/App.css` — tab 和篩選按鈕樣式
