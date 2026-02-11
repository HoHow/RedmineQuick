## ADDED Requirements

### Requirement: 記錄工時
系統 SHALL 提供工時記錄表單，讓使用者針對特定 issue 記錄花費的時間。表單欄位包含：花費時數、活動類型、備註、日期。

#### Scenario: 從 Issue 詳情進入工時記錄
- **WHEN** 使用者在 Issue 詳情頁面點擊「記錄工時」
- **THEN** 系統 SHALL 顯示工時記錄表單，issue 已自動帶入，活動類型 SHALL 從 Redmine API 取得可用選項，日期預設為今天

#### Scenario: 成功記錄工時
- **WHEN** 使用者填寫花費時數（必填）和活動類型（必填），並送出
- **THEN** 系統 SHALL 透過 Redmine API 建立工時紀錄，成功後返回 Issue 詳情頁面並顯示成功訊息

#### Scenario: 記錄失敗
- **WHEN** 使用者送出工時記錄但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，表單內容 SHALL 保留不清除
