## MODIFIED Requirements

### Requirement: 建立新 Issue
系統 SHALL 提供建立 issue 的表單，支援以下欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者。表單 SHALL 提供合理的預設值以減少手動操作。

#### Scenario: 開啟建立表單
- **WHEN** 使用者在專案 Issue 列表頁面點擊「新增 Issue」
- **THEN** 系統 SHALL 顯示建立 issue 表單，各欄位預設值如下：
  - 追蹤標籤：預設為「工作」，若不存在則為列表第一項
  - 優先權：預設為「正常」，若不存在則為列表第一項
  - 被分派者：預設為目前登入使用者（需為該專案成員），若非成員則不預設
  - 狀態：預設為列表第一項
  - 開始日期：預設為當天日期，使用者可自行修改或清除
  - 完成日期：預設為空（未設定）
  - 其他欄位：預設為空

#### Scenario: 成功建立 issue
- **WHEN** 使用者填寫必要欄位（至少主旨和追蹤標籤）並點擊「建立」
- **THEN** 系統 SHALL 透過 Redmine API 建立 issue，成功後導向新建 issue 的詳情頁面

#### Scenario: 繼續建立 issue
- **WHEN** 使用者填寫必要欄位並點擊「繼續建立」
- **THEN** 系統 SHALL 透過 Redmine API 建立 issue，成功後顯示「Issue #ID 已建立」提示（約 3 秒後消失），並清空主旨、概述、完成日期、預估工時、完成百分比欄位，保留追蹤標籤、狀態、優先權、被分派者、開始日期，供使用者繼續建立下一筆

#### Scenario: 返回專案 Issue 列表
- **WHEN** 使用者在建立 Issue 頁面點擊「返回」按鈕或取消
- **THEN** 系統 SHALL 導向該專案的 Issue 列表頁面（`/projects/:projectId/issues`），而非瀏覽器上一頁

#### Scenario: 建立失敗
- **WHEN** 使用者送出建立表單但 API 回傳錯誤
- **THEN** 系統 SHALL 顯示 API 回傳的錯誤訊息，表單內容 SHALL 保留不清除

#### Scenario: 日期欄位互動
- **WHEN** 開始日期或完成日期欄位尚未設定
- **THEN** 系統 SHALL 顯示「未設定」提示文字，點擊後才顯示日期選擇器

#### Scenario: 建立 Issue 不顯示筆記欄位
- **WHEN** 使用者在建立 Issue 表單中
- **THEN** 系統 SHALL 不顯示筆記輸入欄位（Redmine 建立 API 不支援 notes）
