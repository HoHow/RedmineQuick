## ADDED Requirements

### Requirement: 上傳檔案至 Redmine
系統 SHALL 提供將本地檔案上傳至 Redmine 的能力，透過 `POST /uploads.json` 取得 upload token。

#### Scenario: 成功上傳檔案
- **WHEN** 系統以本地檔案路徑呼叫 `upload_attachment` command
- **THEN** 系統 SHALL 讀取該檔案內容，以 `Content-Type: application/octet-stream` 發送至 Redmine `/uploads.json`，並回傳包含 `token`、`filename`、`content_type` 的結果

#### Scenario: 檔案不存在
- **WHEN** 提供的檔案路徑不存在
- **THEN** 系統 SHALL 回傳錯誤訊息，說明檔案不存在

#### Scenario: 上傳失敗
- **WHEN** Redmine API 回傳錯誤（例如檔案太大）
- **THEN** 系統 SHALL 回傳 Redmine 的錯誤訊息

### Requirement: 取得本地檔案 metadata
系統 SHALL 提供取得本地檔案 metadata 的能力，以便前端顯示待上傳檔案資訊。

#### Scenario: 成功取得 metadata
- **WHEN** 系統以本地檔案路徑呼叫 `get_file_metadata` command
- **THEN** 系統 SHALL 回傳該檔案的名稱（filename）、大小（bytes）和完整路徑

#### Scenario: 檔案不存在
- **WHEN** 提供的檔案路徑不存在
- **THEN** 系統 SHALL 回傳錯誤訊息

### Requirement: 在 Issue 表單中選擇附件
系統 SHALL 在 Issue 建立和編輯表單中提供附件選擇區域，支援系統檔案對話框和 Drag & Drop 兩種方式。

#### Scenario: 透過系統檔案對話框選擇檔案
- **WHEN** 使用者在 Issue 表單中點擊「選擇檔案」按鈕
- **THEN** 系統 SHALL 開啟系統原生檔案選擇對話框，允許使用者選擇一個或多個檔案

#### Scenario: 透過 Drag & Drop 選擇檔案
- **WHEN** 使用者將檔案拖曳至 Issue 表單的附件區域
- **THEN** 系統 SHALL 接收拖曳的檔案並加入待上傳列表

#### Scenario: Drag & Drop 視覺回饋
- **WHEN** 使用者拖曳檔案進入附件區域上方
- **THEN** 系統 SHALL 以視覺樣式變化（例如邊框高亮）提示使用者可以放置檔案

#### Scenario: 多次選擇累加
- **WHEN** 使用者已選擇檔案後再次選擇新檔案（無論透過對話框或拖曳）
- **THEN** 系統 SHALL 將新檔案追加至待上傳列表，不取代已選擇的檔案

### Requirement: 顯示待上傳檔案列表
系統 SHALL 在 Issue 表單中顯示使用者已選擇的待上傳檔案列表。

#### Scenario: 顯示檔案資訊
- **WHEN** 使用者已選擇一個或多個檔案
- **THEN** 系統 SHALL 顯示每個檔案的名稱和大小

#### Scenario: 移除單一檔案
- **WHEN** 使用者點擊某個待上傳檔案的移除按鈕
- **THEN** 系統 SHALL 從待上傳列表中移除該檔案

#### Scenario: 無待上傳檔案
- **WHEN** 待上傳列表為空
- **THEN** 系統 SHALL 在附件區域顯示提示文字（例如「點擊或拖曳檔案至此處」）

### Requirement: Submit 時上傳附件
系統 SHALL 在使用者 Submit Issue 表單時，先上傳所有待上傳檔案，再建立或更新 Issue。

#### Scenario: 成功上傳並建立 Issue
- **WHEN** 使用者在建立 Issue 表單中選擇了附件並點擊「建立」
- **THEN** 系統 SHALL 依序上傳每個檔案取得 token，再以包含 uploads 的 IssueParams 建立 Issue

#### Scenario: 成功上傳並更新 Issue
- **WHEN** 使用者在編輯 Issue 表單中選擇了附件並點擊「更新」
- **THEN** 系統 SHALL 依序上傳每個檔案取得 token，再以包含 uploads 的 IssueParams 更新 Issue

#### Scenario: 無附件時正常 Submit
- **WHEN** 使用者未選擇任何附件並 Submit
- **THEN** 系統 SHALL 以不包含 uploads 的 IssueParams 建立或更新 Issue（與現有行為一致）

#### Scenario: 上傳中顯示狀態
- **WHEN** 系統正在上傳檔案
- **THEN** 系統 SHALL 顯示上傳進度狀態（例如「上傳中 (2/5)...」）

#### Scenario: 上傳失敗
- **WHEN** 某個檔案上傳失敗
- **THEN** 系統 SHALL 停止後續上傳，顯示錯誤訊息，保留表單內容和待上傳列表不清除

#### Scenario: 繼續建立時清除附件列表
- **WHEN** 使用者在建立 Issue 表單中選擇了附件並點擊「繼續建立」且成功
- **THEN** 系統 SHALL 清除待上傳檔案列表（與其他欄位一同重置）
