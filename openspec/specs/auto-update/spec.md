## ADDED Requirements

### Requirement: 啟動時自動檢查更新
系統 SHALL 在 App 啟動後自動檢查是否有新版本可用。

#### Scenario: 有可用更新
- **WHEN** App 啟動且偵測到 GitHub Releases 上有比目前版本更新的版本
- **THEN** 系統 SHALL 顯示更新提示對話框，包含新版本號，並提供「立即更新」和「稍後再說」按鈕

#### Scenario: 無可用更新
- **WHEN** App 啟動且目前已是最新版本
- **THEN** 系統 SHALL 不顯示任何提示，不影響正常使用流程

#### Scenario: 檢查失敗（無網路或 endpoint 不可達）
- **WHEN** App 啟動但無法連線至更新伺服器
- **THEN** 系統 SHALL 靜默忽略，不顯示錯誤訊息，不影響正常使用流程

### Requirement: 手動檢查更新
系統 SHALL 在設定區域提供「檢查更新」按鈕，讓使用者主動檢查是否有新版本。

#### Scenario: 手動檢查 — 有更新
- **WHEN** 使用者點擊「檢查更新」按鈕且有新版本可用
- **THEN** 系統 SHALL 顯示更新提示對話框，包含新版本號，並提供「立即更新」和「稍後再說」按鈕

#### Scenario: 手動檢查 — 已是最新
- **WHEN** 使用者點擊「檢查更新」按鈕且目前已是最新版本
- **THEN** 系統 SHALL 顯示「目前已是最新版本」提示訊息

#### Scenario: 手動檢查 — 失敗
- **WHEN** 使用者點擊「檢查更新」按鈕但無法連線至更新伺服器
- **THEN** 系統 SHALL 顯示「無法檢查更新，請確認網路連線」錯誤訊息

### Requirement: 執行更新
系統 SHALL 允許使用者確認後下載並安裝更新，過程中顯示下載進度。

#### Scenario: 使用者確認更新
- **WHEN** 使用者在更新提示對話框點擊「立即更新」
- **THEN** 系統 SHALL 開始下載更新檔，顯示下載進度條

#### Scenario: 下載完成
- **WHEN** 更新檔下載完成
- **THEN** 系統 SHALL 自動安裝更新並重新啟動 App

#### Scenario: 使用者選擇稍後再說
- **WHEN** 使用者在更新提示對話框點擊「稍後再說」
- **THEN** 系統 SHALL 關閉對話框，不進行更新，使用者可繼續正常使用

#### Scenario: 下載失敗
- **WHEN** 更新檔下載過程中發生錯誤
- **THEN** 系統 SHALL 顯示「更新下載失敗，請稍後再試」錯誤訊息，並關閉進度條

### Requirement: 顯示目前版本
系統 SHALL 在設定區域顯示 App 的目前版本號。

#### Scenario: 顯示版本號
- **WHEN** 使用者查看設定區域
- **THEN** 系統 SHALL 顯示目前 App 的版本號（如「v0.1.0」）
