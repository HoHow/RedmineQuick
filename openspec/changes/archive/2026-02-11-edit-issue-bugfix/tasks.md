## 1. Rust 端新增 notes 欄位

- [x] 1.1 在 IssueParams 新增 `notes: Option<String>` 欄位（含 `skip_serializing_if`）

## 2. 前端型別與表單更新

- [x] 2.1 在 api.ts 的 IssueParams 型別新增 `notes?: string`
- [x] 2.2 在 IssueForm 新增筆記 textarea，僅在編輯模式（有 initialValues）時顯示
- [x] 2.3 將筆記值加入 handleSubmit 的 params 中送出

## 3. 詳情頁快速修改完成日期

- [x] 3.1 在 IssueDetailPage 新增 `handleQuickDueDateChange` 函式
- [x] 3.2 將完成日期的純文字顯示改為 `<input type="date">`，onChange 時立即呼叫 updateIssue API
- [x] 3.3 完成日期空值時使用 type="text" 顯示「未設定」，點擊後切換為 type="date"

## 4. 完成度改為唯讀

- [x] 4.1 移除 IssueDetailPage 的 `handleQuickDoneRatioChange` 函式
- [x] 4.2 將完成度的互動式 range slider 改為純文字顯示百分比

## 5. 快速更新成功提示

- [x] 5.1 新增 `updatedField` state 追蹤最近更新的欄位名稱
- [x] 5.2 快速更新狀態成功後，在狀態欄位旁顯示「✓ 已更新」，2 秒後自動消失
- [x] 5.3 快速更新完成日期成功後，在完成日期欄位旁顯示「✓ 已更新」，2 秒後自動消失

## 6. 建立 Issue 開始日期預設當天

- [x] 6.1 IssueForm 建立模式時，開始日期預設帶入當天日期（`new Date().toISOString().split("T")[0]`）

## 7. Issue 詳情頁顯示歷程筆記

- [x] 7.1 Rust 新增 `Journal` struct，Issue 新增 `journals` 欄位
- [x] 7.2 `get_issue` API 加入 `include=journals`
- [x] 7.3 TypeScript 新增 `Journal` 型別，`Issue` 新增 `journals`
- [x] 7.4 IssueDetailPage 在概述下方顯示有 notes 的 journal 列表（過濾空 notes）
