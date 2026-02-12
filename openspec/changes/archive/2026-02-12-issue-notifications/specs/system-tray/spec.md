## ADDED Requirements

### Requirement: System Tray 常駐
系統 SHALL 在系統列（macOS menu bar / Windows system tray）顯示 App 圖示，讓 App 在背景持續運作。

#### Scenario: 關閉視窗時隱藏而非退出
- **WHEN** 使用者點擊視窗的關閉按鈕
- **THEN** 系統 SHALL 隱藏視窗而非終止 App，App 繼續在 System Tray 常駐運作

#### Scenario: 從 Tray 重新開啟視窗
- **WHEN** 使用者點擊 System Tray 圖示
- **THEN** 系統 SHALL 顯示主視窗

#### Scenario: 從 Tray 退出 App
- **WHEN** 使用者右鍵點擊 System Tray 圖示並選擇「退出」
- **THEN** 系統 SHALL 完全終止 App（包含背景 polling）

### Requirement: Tray 選單
系統 SHALL 在右鍵點擊 System Tray 圖示時顯示選單。

#### Scenario: 顯示 Tray 右鍵選單
- **WHEN** 使用者右鍵點擊 System Tray 圖示
- **THEN** 系統 SHALL 顯示選單，包含「打開 RedmineQuick」和「退出」選項
