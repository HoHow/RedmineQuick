## MODIFIED Requirements

### Requirement: 顯示專案內 Issue 列表
系統 SHALL 在專案 Issue 列表頁面提供狀態篩選，讓使用者依狀態檢視 issue。每筆 issue SHALL 顯示：編號、主旨、建立者、被分派者、狀態、優先權。

#### Scenario: 預設顯示未關閉 issue
- **WHEN** 使用者進入某專案的 Issue 列表頁面
- **THEN** 系統 SHALL 預設選取「未關閉」篩選，顯示該專案下狀態為未關閉的 issue

#### Scenario: 篩選已關閉 issue
- **WHEN** 使用者點擊「已關閉」篩選按鈕
- **THEN** 系統 SHALL 顯示該專案下狀態為已關閉的 issue

#### Scenario: 篩選全部 issue
- **WHEN** 使用者點擊「全部」篩選按鈕
- **THEN** 系統 SHALL 顯示該專案下所有狀態的 issue

#### Scenario: 顯示建立者欄位
- **WHEN** Issue 列表啟用建立者欄位
- **THEN** 系統 SHALL 在「主旨」與「被分派者」之間顯示「建立者」欄位，內容為 issue 建立者的名稱
