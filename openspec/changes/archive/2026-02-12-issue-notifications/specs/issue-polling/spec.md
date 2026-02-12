## ADDED Requirements

### Requirement: 背景定時檢查新指派 Issue
系統 SHALL 在背景以固定間隔（預設 2 分鐘）定時向 Redmine API 查詢指派給目前使用者的 Issue，並偵測是否有新增的 Issue。

#### Scenario: 定時 polling 偵測到新 Issue
- **WHEN** 背景 polling 取得指派給自己的 Issue 列表，且列表中包含上次檢查時不存在的 Issue
- **THEN** 系統 SHALL 將新 Issue 資訊發送到前端（透過 Tauri event emit），並觸發 OS 通知

#### Scenario: 定時 polling 無新 Issue
- **WHEN** 背景 polling 取得指派給自己的 Issue 列表，且列表與上次相同
- **THEN** 系統 SHALL 不觸發任何通知

#### Scenario: 首次啟動建立 baseline
- **WHEN** App 啟動後首次 polling（尚無歷史記錄）
- **THEN** 系統 SHALL 記錄目前所有 Issue 作為 baseline，不觸發任何通知

#### Scenario: 未登入時不 polling
- **WHEN** 使用者尚未登入（無儲存的 credentials）
- **THEN** 系統 SHALL 不啟動背景 polling

#### Scenario: polling 失敗
- **WHEN** 背景 polling 無法連線至 Redmine 伺服器
- **THEN** 系統 SHALL 靜默忽略錯誤，等待下一次 polling 週期
