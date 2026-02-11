## Context

Redmine REST API 的 `PUT /issues/<id>.json` 支援在 issue payload 中包含 `notes` 欄位，更新時附加的筆記會記錄在 issue 的 journal 歷程中。目前 `IssueParams` 沒有 `notes` 欄位，IssueForm 也沒有對應的輸入區域。

## Goals / Non-Goals

**Goals:**
- 在編輯 Issue 時提供筆記輸入欄位
- 筆記隨 issue 更新一併送出至 Redmine API
- Issue 詳情頁可直接修改完成日期（與快速更新狀態相同模式）
- 完成度改為唯讀顯示
- 快速更新成功後在欄位旁顯示短暫提示

**Non-Goals:**
- 不顯示歷史筆記列表（journal history）
- 不在建立 Issue 時提供筆記（Redmine 建立 API 不支援 notes）

## Decisions

### 1. notes 欄位加在 IssueParams

**選擇**：直接在既有的 `IssueParams` struct 新增 `notes: Option<String>`，搭配 `skip_serializing_if`。

**理由**：`IssueParams` 已用於建立和更新，`notes` 設為 `Option` 且 skip_serializing_if 可確保建立時不會送出空的 notes 欄位。不需要額外的 struct。

### 2. 筆記欄位僅在編輯模式顯示

**選擇**：IssueForm 透過判斷是否有 `initialValues`（即編輯模式）來決定是否顯示筆記欄位。

**理由**：Redmine 建立 issue 時不支援 notes，只有更新時才能附加筆記。

### 3. 完成日期在詳情頁直接編輯

**選擇**：沿用快速更新狀態和完成度的模式，將完成日期的純文字顯示改為 `<input type="date">`，`onChange` 時立即呼叫 `updateIssue` API。

**理由**：與既有的快速更新 pattern 一致，使用者無需進入編輯模式即可修改常用欄位。

### 4. 完成度改為唯讀

**選擇**：移除完成度的互動式 range slider，改為純文字顯示百分比。

**理由**：Redmine 可設定完成度由議題狀態自動計算，此時手動更新 `done_ratio` 會導致 API 回傳 422 錯誤。改為唯讀可避免此問題，使用者仍可透過編輯模式修改（如果 Redmine 允許）。

### 5. 快速更新成功提示

**選擇**：在剛更新的欄位旁短暫顯示「✓ 已更新」文字，約 2 秒後自動消失。

**理由**：比頂部通知更貼近操作位置，使用者可以直覺地確認更新成功。使用 `setTimeout` 控制顯示時間，不需額外的 toast 套件。

## Risks / Trade-offs

- 完成度改唯讀後，若 Redmine 允許手動設定，使用者只能透過編輯模式修改，快速性稍降。
- 變更範圍仍然小且向後相容。
