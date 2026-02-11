## Why

目前編輯 Issue 時只能修改欄位值，但無法在更新時附加筆記（notes）。Redmine 的 issue 更新 API 支援 `notes` 欄位，更新時附加的筆記會記錄在 issue 的歷程（journal）中。此外，Issue 詳情頁的完成日期目前是純顯示，無法像狀態和完成度一樣快速修改。

## What Changes

- 在 IssueParams 加入 `notes` 欄位（Rust + TypeScript）
- 在 IssueForm 編輯模式新增「筆記」文字輸入區域
- 更新 issue 時將筆記一併送出至 Redmine API
- Issue 詳情頁的完成日期改為可直接編輯的日期選擇器，修改後立即透過 API 更新
- 完成度改為唯讀顯示（Redmine 可能設定為由狀態自動計算，手動更新會導致 422 錯誤）
- 快速更新狀態或完成日期成功後，在欄位旁顯示「✓ 已更新」短暫提示
- 詳情頁完成日期空值時顯示「未設定」，點擊後才顯示日期選擇器
- 建立 Issue 時開始日期預設帶入當天日期

## Capabilities

### New Capabilities

（無）

### Modified Capabilities

- `issue-management`：編輯 Issue 時新增筆記輸入欄位、詳情頁快速修改完成日期、完成度改唯讀、快速更新成功提示

## Impact

- `src-tauri/src/redmine/models.rs`：IssueParams 新增 `notes` 欄位
- `src/lib/api.ts`：IssueParams 型別新增 `notes`
- `src/components/IssueForm.tsx`：新增筆記 textarea
- `src/pages/IssueDetailPage.tsx`：完成日期改為可直接編輯的 date input
