## ADDED Requirements

### Requirement: macOS Dock 圖示重新開啟視窗
在 macOS 上，當使用者關閉主視窗（點擊紅色 X 按鈕）後，app 進程 SHALL 繼續在背景執行。使用者點擊 Dock 圖示時，系統 SHALL 重新顯示主視窗並聚焦。

#### Scenario: 關閉視窗後點擊 Dock 圖示
- **WHEN** 使用者在 macOS 上關閉主視窗後，點擊 Dock 上的 app 圖示
- **THEN** 系統 SHALL 重新顯示主視窗並將焦點設定在該視窗上

#### Scenario: 視窗已顯示時點擊 Dock 圖示
- **WHEN** 主視窗已處於顯示狀態，使用者點擊 Dock 上的 app 圖示
- **THEN** 系統 SHALL 將焦點設定在主視窗上（不建立新視窗）
