## MODIFIED Requirements

### Requirement: 顯示我的待處理 Issue
系統 SHALL 在主畫面（Dashboard）提供 tab 切換，讓使用者檢視「待處理」和「已完成」的 issue。

#### Scenario: 預設顯示待處理 tab
- **WHEN** 使用者進入主畫面
- **THEN** 系統 SHALL 預設選取「待處理」tab，顯示指派給目前使用者且狀態為未關閉的 issue 列表

#### Scenario: 切換至已完成 tab
- **WHEN** 使用者點擊「已完成」tab
- **THEN** 系統 SHALL 顯示指派給目前使用者且狀態為已關閉的 issue 列表

#### Scenario: 無待處理 issue
- **WHEN** 使用者無任何指派的未關閉 issue
- **THEN** 系統 SHALL 顯示空狀態提示訊息

#### Scenario: 無已完成 issue
- **WHEN** 使用者無任何指派的已關閉 issue
- **THEN** 系統 SHALL 顯示空狀態提示訊息

### Requirement: 顯示專案內 Issue 列表
系統 SHALL 在專案 Issue 列表頁面提供狀態篩選，讓使用者依狀態檢視 issue。

#### Scenario: 預設顯示未關閉 issue
- **WHEN** 使用者進入某專案的 Issue 列表頁面
- **THEN** 系統 SHALL 預設選取「未關閉」篩選，顯示該專案下狀態為未關閉的 issue

#### Scenario: 篩選已關閉 issue
- **WHEN** 使用者點擊「已關閉」篩選按鈕
- **THEN** 系統 SHALL 顯示該專案下狀態為已關閉的 issue

#### Scenario: 篩選全部 issue
- **WHEN** 使用者點擊「全部」篩選按鈕
- **THEN** 系統 SHALL 顯示該專案下所有狀態的 issue
