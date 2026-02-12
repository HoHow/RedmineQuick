## ADDED Requirements

### Requirement: 建立 Issue 後返回列表
建立 Issue 成功後，系統 SHALL 導向回專案 Issue 列表頁，而非 Issue 詳情頁。

#### Scenario: 正常建立 Issue
- **WHEN** 使用者在建立 Issue 頁面點擊「建立」按鈕且建立成功
- **THEN** 導向到 `/projects/{projectId}/issues` 列表頁

### Requirement: 繼續建立後滾動到頂部
點擊「繼續建立」成功後，系統 SHALL 自動將頁面滾動到頂部。

#### Scenario: 繼續建立 Issue
- **WHEN** 使用者點擊「繼續建立」按鈕且建立成功
- **THEN** 表單清空並自動滾動到頁面頂部

### Requirement: Issue 列表 inline 狀態變更
Issue 列表的狀態欄位 SHALL 顯示為可點擊的下拉選單，使用者可直接在列表中變更 Issue 狀態。

#### Scenario: 點擊狀態欄位
- **WHEN** 使用者在 Issue 列表中點擊某個 Issue 的狀態欄位
- **THEN** 顯示該 Issue 可選擇的狀態下拉選單，不觸發整行的導航

#### Scenario: 選擇新狀態
- **WHEN** 使用者從下拉選單中選擇一個不同的狀態
- **THEN** 呼叫 API 更新該 Issue 的狀態，並即時更新列表中顯示的狀態

#### Scenario: 狀態更新失敗
- **WHEN** API 呼叫失敗
- **THEN** 狀態欄位恢復為原本的值
