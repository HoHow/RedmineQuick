## ADDED Requirements

### Requirement: 移除 URL 下拉建議
登入頁面 SHALL 移除 `<datalist>` 硬編碼的 URL 下拉建議，URL 欄位改為純文字輸入。

#### Scenario: URL 欄位無下拉選項
- **WHEN** 使用者在登入頁面點擊 URL 輸入框
- **THEN** 不顯示任何下拉建議選項

### Requirement: 記住 Redmine URL checkbox
登入頁面 SHALL 在 URL 欄位下方顯示「記住 Redmine URL」checkbox。

#### Scenario: checkbox 預設狀態（無儲存記錄）
- **WHEN** 使用者首次開啟 App 進入登入頁面
- **THEN** checkbox 預設為未勾選，URL 欄位為空

#### Scenario: checkbox 預設狀態（有儲存記錄）
- **WHEN** 使用者之前勾選過「記住 Redmine URL」且有儲存的 URL
- **THEN** checkbox 預設為已勾選，URL 欄位自動填入儲存的 URL

### Requirement: 勾選時儲存 URL
勾選「記住 Redmine URL」時，系統 SHALL 將目前 URL 欄位的值存至 localStorage，不需要登入成功即可儲存。

#### Scenario: 勾選後輸入 URL
- **WHEN** 使用者勾選 checkbox 並在 URL 欄位輸入值
- **THEN** URL 值即時儲存至 localStorage

#### Scenario: 已勾選狀態下修改 URL
- **WHEN** 使用者在已勾選狀態下修改 URL 欄位的值
- **THEN** 新的 URL 值即時更新至 localStorage

### Requirement: 取消勾選時清除儲存
取消勾選「記住 Redmine URL」時，系統 SHALL 清除 localStorage 中儲存的 URL。

#### Scenario: 取消勾選
- **WHEN** 使用者取消勾選 checkbox
- **THEN** localStorage 中的儲存 URL 被清除

### Requirement: 下次開啟自動填入
App 重新開啟時，系統 SHALL 根據 localStorage 中的記錄自動填入 URL 並勾選 checkbox。

#### Scenario: 有儲存記錄時開啟 App
- **WHEN** 使用者開啟 App 且 localStorage 有儲存的 URL
- **THEN** URL 欄位自動填入儲存的值，checkbox 為已勾選

#### Scenario: 無儲存記錄時開啟 App
- **WHEN** 使用者開啟 App 且 localStorage 無儲存的 URL
- **THEN** URL 欄位為空，checkbox 為未勾選
