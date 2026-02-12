## ADDED Requirements

### Requirement: Issue 列表 inline 優先權變更
Issue 列表的優先權欄位 SHALL 顯示為可點擊的下拉選單，使用者可直接在列表中變更 Issue 優先權。

#### Scenario: 點擊優先權欄位
- **WHEN** 使用者在 Issue 列表中點擊某個 Issue 的優先權欄位
- **THEN** 顯示該 Issue 可選擇的優先權下拉選單，不觸發整行的導航

#### Scenario: 選擇新優先權
- **WHEN** 使用者從下拉選單中選擇一個不同的優先權
- **THEN** 呼叫 API 更新該 Issue 的優先權，並即時更新列表中顯示的優先權

#### Scenario: 優先權更新失敗
- **WHEN** API 呼叫失敗
- **THEN** 優先權欄位恢復為原本的值

### Requirement: 狀態變更後重新載入列表
狀態變更成功後，系統 SHALL 重新 fetch Issue 列表以確保篩選結果正確。

#### Scenario: 狀態變更後 refetch
- **WHEN** 使用者在列表中變更 Issue 狀態且 API 成功
- **THEN** 重新載入當前篩選條件下的 Issue 列表

### Requirement: 篩選按鈕文字更新
ProjectIssuesPage 的篩選按鈕文字 SHALL 更新為更直覺的用語。

#### Scenario: 篩選按鈕顯示
- **WHEN** 使用者在專案 Issue 列表頁
- **THEN** 篩選按鈕顯示為「進行中」、「已結束」、「全部」
