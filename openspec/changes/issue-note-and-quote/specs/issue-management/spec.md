## ADDED Requirements

### Requirement: Issue 詳情頁新增留言
系統 SHALL 在 Issue 詳情頁面的歷程區塊下方提供留言輸入區，讓使用者直接新增筆記（notes）至該 issue。

#### Scenario: 顯示留言輸入區
- **WHEN** 使用者進入 Issue 詳情頁面
- **THEN** 系統 SHALL 在歷程區塊下方顯示一個 textarea 和「送出」按鈕

#### Scenario: 成功送出留言
- **WHEN** 使用者在 textarea 輸入文字並點擊「送出」
- **THEN** 系統 SHALL 透過 Redmine API `PUT /issues/:id.json` 帶 `notes` 參數送出留言，成功後清空 textarea 並重新載入 issue 資料以顯示最新歷程

#### Scenario: 空白留言不可送出
- **WHEN** textarea 為空白（空字串或僅含空白字元）
- **THEN** 系統 SHALL 停用「送出」按鈕，使用者無法送出

#### Scenario: 送出中狀態
- **WHEN** 留言正在送出中
- **THEN** 系統 SHALL 停用「送出」按鈕與 textarea，防止重複送出

#### Scenario: 送出失敗
- **WHEN** 留言送出但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示錯誤訊息，textarea 內容 SHALL 保留不清除

### Requirement: 引用 Issue 描述
系統 SHALL 在 Issue 詳情頁面的概述區塊提供「引用」按鈕，讓使用者將描述內容插入留言輸入區。

#### Scenario: 點擊引用描述
- **WHEN** 使用者點擊概述區塊的「引用」按鈕
- **THEN** 系統 SHALL 將描述內容以 `> ` 前綴格式逐行插入留言 textarea，並在引用區塊後方加一個空行，然後自動捲動至留言輸入區並 focus textarea

#### Scenario: 無描述時不顯示引用按鈕
- **WHEN** Issue 的描述為空
- **THEN** 系統 SHALL 不顯示概述區塊，因此也無引用按鈕

### Requirement: 引用歷程留言
系統 SHALL 在每則包含筆記的歷程 journal 旁提供「引用」按鈕，讓使用者將該筆記內容插入留言輸入區。

#### Scenario: 點擊引用歷程留言
- **WHEN** 使用者點擊某則歷程留言的「引用」按鈕
- **THEN** 系統 SHALL 將該筆記內容以 `> ` 前綴格式逐行插入留言 textarea，並在引用區塊後方加一個空行，然後自動捲動至留言輸入區並 focus textarea

#### Scenario: 無筆記的歷程不顯示引用按鈕
- **WHEN** 歷程 journal 不包含筆記（notes 為空）
- **THEN** 系統 SHALL 不顯示該 journal 的引用按鈕

#### Scenario: 多次引用累加
- **WHEN** 使用者已在 textarea 中有內容，再次點擊引用按鈕
- **THEN** 系統 SHALL 將新的引用內容 append 至 textarea 現有內容之後（以空行分隔），不覆蓋已輸入的文字
