## ADDED Requirements

### Requirement: OS 原生通知
系統 SHALL 在偵測到新指派的 Issue 時，發送作業系統原生通知。

#### Scenario: 顯示新 Issue 通知
- **WHEN** 背景 polling 偵測到新指派的 Issue
- **THEN** 系統 SHALL 發送 OS 原生通知，標題為「新 Issue」，內容包含 Issue 編號和主題

#### Scenario: 點擊通知跳轉到 Issue 詳情
- **WHEN** 使用者點擊 OS 原生通知
- **THEN** 系統 SHALL 顯示主視窗並導航至該 Issue 的詳情頁面

### Requirement: App 內通知列表
系統 SHALL 在 Navbar 提供通知入口，顯示近期收到的通知。

#### Scenario: 有未讀通知時顯示紅點
- **WHEN** 有新的未讀通知
- **THEN** 系統 SHALL 在 Navbar 鈴鐺圖示旁顯示未讀數量紅點

#### Scenario: 展開通知下拉列表
- **WHEN** 使用者點擊鈴鐺圖示
- **THEN** 系統 SHALL 顯示通知下拉列表，包含每筆通知的 Issue 編號、主題和時間

#### Scenario: 點擊通知項目跳轉
- **WHEN** 使用者點擊通知列表中的某筆通知
- **THEN** 系統 SHALL 導航至該 Issue 的詳情頁面，並將該通知標為已讀

#### Scenario: 清除所有通知
- **WHEN** 使用者點擊「清除全部」按鈕
- **THEN** 系統 SHALL 清除所有通知記錄並移除紅點

### Requirement: 通知持久化
系統 SHALL 將通知記錄保存在 localStorage，App 重啟後保留。

#### Scenario: App 重啟後保留通知
- **WHEN** 使用者關閉並重新開啟 App
- **THEN** 系統 SHALL 從 localStorage 載入之前的通知記錄並顯示

#### Scenario: 登出時清除通知
- **WHEN** 使用者登出
- **THEN** 系統 SHALL 清除所有通知記錄
