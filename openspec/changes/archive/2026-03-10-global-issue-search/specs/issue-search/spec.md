## ADDED Requirements

### Requirement: 搜尋對話框觸發
系統 SHALL 提供搜尋對話框，可透過鍵盤快捷鍵或 Navbar 圖示觸發。

#### Scenario: Cmd+K 開啟搜尋框
- **WHEN** 使用者在任何頁面按下 Cmd+K（macOS）或 Ctrl+K（Windows）
- **THEN** 系統 SHALL 顯示浮動搜尋對話框，輸入框自動取得焦點

#### Scenario: 點擊 Navbar 搜尋圖示開啟
- **WHEN** 使用者點擊 Navbar 上的搜尋圖示
- **THEN** 系統 SHALL 顯示浮動搜尋對話框，輸入框自動取得焦點

#### Scenario: ESC 關閉搜尋框
- **WHEN** 搜尋對話框已開啟，使用者按下 ESC
- **THEN** 系統 SHALL 關閉搜尋對話框並清空輸入內容

#### Scenario: 點擊背景關閉搜尋框
- **WHEN** 搜尋對話框已開啟，使用者點擊對話框外部區域
- **THEN** 系統 SHALL 關閉搜尋對話框並清空輸入內容

#### Scenario: 重複按 Cmd+K 關閉
- **WHEN** 搜尋對話框已開啟，使用者再次按下 Cmd+K
- **THEN** 系統 SHALL 關閉搜尋對話框

### Requirement: Issue 編號快速跳轉
系統 SHALL 在使用者輸入純數字時，即時預覽對應的 Issue。

#### Scenario: 輸入數字即時預覽
- **WHEN** 使用者在搜尋框輸入純數字（如 `1234`）
- **THEN** 系統 SHALL 在 debounce 300ms 後呼叫 API 取得該 Issue，並在結果區顯示 Issue 編號、主旨、專案名稱

#### Scenario: Issue 不存在
- **WHEN** 使用者輸入的數字不對應任何 Issue
- **THEN** 系統 SHALL 顯示「找不到 Issue #N」訊息

#### Scenario: 選擇預覽的 Issue
- **WHEN** 使用者按下 Enter 或點擊預覽的 Issue
- **THEN** 系統 SHALL 導航至該 Issue 詳情頁面並關閉搜尋對話框

### Requirement: 關鍵字搜尋 Issue
系統 SHALL 在使用者輸入非數字文字並按下 Enter 時，搜尋 Issue 主旨。

#### Scenario: 輸入文字按 Enter 搜尋
- **WHEN** 使用者在搜尋框輸入非數字文字並按下 Enter
- **THEN** 系統 SHALL 呼叫 API 搜尋 Issue 主旨包含該關鍵字的 Issue，回傳最多 10 筆結果，每筆顯示 Issue 編號、主旨、專案名稱、狀態

#### Scenario: 搜尋無結果
- **WHEN** 搜尋關鍵字無匹配的 Issue
- **THEN** 系統 SHALL 顯示「沒有找到相關 Issue」訊息

#### Scenario: 選擇搜尋結果
- **WHEN** 使用者點擊或按 Enter 選擇某筆搜尋結果
- **THEN** 系統 SHALL 導航至該 Issue 詳情頁面並關閉搜尋對話框

### Requirement: 情境感知搜尋範圍
系統 SHALL 根據使用者目前所在頁面自動決定搜尋範圍。

#### Scenario: 在專案頁面搜尋
- **WHEN** 使用者在專案相關頁面（URL 包含 `/projects/:projectId/`）觸發搜尋並輸入關鍵字
- **THEN** 系統 SHALL 限制搜尋範圍為該專案的 Issue

#### Scenario: 在非專案頁面搜尋
- **WHEN** 使用者在 Dashboard 或其他非專案頁面觸發搜尋並輸入關鍵字
- **THEN** 系統 SHALL 搜尋所有專案的 Issue

#### Scenario: 編號跳轉不受情境限制
- **WHEN** 使用者輸入純數字進行 Issue 編號跳轉
- **THEN** 系統 SHALL 不限制專案範圍，直接以 ID 查找

### Requirement: 鍵盤導航搜尋結果
系統 SHALL 支援使用鍵盤在搜尋結果中導航。

#### Scenario: 上下鍵選擇結果
- **WHEN** 搜尋結果已顯示，使用者按下 ↑ 或 ↓ 鍵
- **THEN** 系統 SHALL 在結果列表中移動選取高亮，循環選取

#### Scenario: Enter 確認選取
- **WHEN** 有結果被高亮選取，使用者按下 Enter
- **THEN** 系統 SHALL 導航至該 Issue 詳情頁面並關閉搜尋對話框

### Requirement: 搜尋載入狀態
系統 SHALL 在搜尋進行中顯示載入指示。

#### Scenario: 搜尋中顯示 loading
- **WHEN** 系統正在呼叫 API 搜尋
- **THEN** 系統 SHALL 在結果區顯示載入指示

#### Scenario: 搜尋完成替換 loading
- **WHEN** API 回傳搜尋結果
- **THEN** 系統 SHALL 以搜尋結果替換載入指示
