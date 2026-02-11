## ADDED Requirements

### Requirement: CSS 變數架構
系統 SHALL 使用 CSS 自訂屬性（CSS Variables）定義所有色彩，不使用寫死的色碼值。

#### Scenario: 亮色主題變數
- **WHEN** 系統以亮色主題顯示
- **THEN** 系統 SHALL 套用亮色主題的 CSS 變數值（如 `--color-bg: #f8fafc`、`--color-text: #1e293b`、`--color-primary: #3b82f6`）

#### Scenario: 暗色主題變數
- **WHEN** 系統以暗色主題顯示
- **THEN** 系統 SHALL 透過 `[data-theme="dark"]` 選擇器覆寫 CSS 變數值（如 `--color-bg: #0f172a`、`--color-text: #f1f5f9`、`--color-primary: #60a5fa`）

### Requirement: 主題切換按鈕
系統 SHALL 在 Navbar 提供主題切換按鈕，允許使用者在亮色與暗色主題間切換。

#### Scenario: 點擊切換主題
- **WHEN** 使用者點擊 Navbar 上的主題切換按鈕
- **THEN** 系統 SHALL 立即切換至另一個主題，並更新 `<html>` 元素的 `data-theme` 屬性

#### Scenario: 按鈕圖示反映當前主題
- **WHEN** 系統處於亮色主題
- **THEN** 切換按鈕 SHALL 顯示月亮圖示（表示可切換至暗色）
- **WHEN** 系統處於暗色主題
- **THEN** 切換按鈕 SHALL 顯示太陽圖示（表示可切換至亮色）

### Requirement: 主題偏好持久化
系統 SHALL 記住使用者的主題選擇，下次開啟時自動套用。

#### Scenario: 儲存偏好
- **WHEN** 使用者切換主題
- **THEN** 系統 SHALL 將選擇儲存至 `localStorage`（key: `theme`，value: `"light"` 或 `"dark"`）

#### Scenario: 載入偏好
- **WHEN** 使用者開啟應用程式且 `localStorage` 中有已儲存的主題偏好
- **THEN** 系統 SHALL 套用已儲存的主題

#### Scenario: 首次使用預設跟隨系統
- **WHEN** 使用者首次開啟應用程式（`localStorage` 無主題偏好）
- **THEN** 系統 SHALL 偵測系統偏好（`prefers-color-scheme`），套用對應主題
