## ADDED Requirements

### Requirement: 設定頁面入口
系統 SHALL 在 navbar 右側提供齒輪圖示，作為設定頁面的入口。

#### Scenario: 點擊齒輪進入設定頁
- **WHEN** 使用者點擊 navbar 的齒輪圖示
- **THEN** 系統 SHALL 導向設定頁面（`/settings`）

#### Scenario: 有可用更新時顯示紅點
- **WHEN** 系統偵測到有新版本可用
- **THEN** 系統 SHALL 在齒輪圖示旁顯示紅點提示

#### Scenario: 無更新時不顯示紅點
- **WHEN** 目前已是最新版本或尚未檢查
- **THEN** 系統 SHALL 不顯示紅點

### Requirement: 設定頁面版本資訊
系統 SHALL 在設定頁面顯示目前 App 版本號並提供檢查更新功能。

#### Scenario: 顯示目前版本
- **WHEN** 使用者進入設定頁面
- **THEN** 系統 SHALL 顯示目前 App 的版本號

#### Scenario: 檢查更新按鈕
- **WHEN** 使用者在設定頁面點擊「檢查更新」
- **THEN** 系統 SHALL 執行更新檢查，行為與原自動檢查相同

#### Scenario: 返回上一頁
- **WHEN** 使用者點擊設定頁面的「返回」按鈕
- **THEN** 系統 SHALL 導向首頁（Dashboard）

### Requirement: 更新紀錄顯示
系統 SHALL 在設定頁面顯示歷次版本的更新紀錄，資料來源為 GitHub Releases API。

#### Scenario: 顯示更新紀錄
- **WHEN** 使用者進入設定頁面
- **THEN** 系統 SHALL 從公開 repo 的 GitHub Releases API 拉取所有 release，依版本號由新到舊顯示，每筆包含版本號、發佈日期、更新內容

#### Scenario: 載入中
- **WHEN** 更新紀錄資料尚在載入
- **THEN** 系統 SHALL 顯示載入中提示

#### Scenario: 載入失敗
- **WHEN** 無法連線至 GitHub API
- **THEN** 系統 SHALL 顯示「無法載入更新紀錄」提示訊息

#### Scenario: 無任何 release
- **WHEN** 公開 repo 尚無任何 release
- **THEN** 系統 SHALL 顯示「目前沒有更新紀錄」提示訊息
