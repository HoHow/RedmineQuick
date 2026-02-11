## 1. API 認證錯誤處理修正

- [x] 1.1 修改 RedmineClient::new() 使用 `Client::builder().redirect(Policy::none())` 停用自動 redirect
- [x] 1.2 新增 `check_response()` 輔助函式，偵測 401/302/非 JSON 回應並回傳明確錯誤訊息
- [x] 1.3 在所有 HTTP 方法（get、get_with_params、post、put、create_time_entry）加入 `check_response()` 呼叫

## 2. serde 序列化欄位修正

- [x] 2.1 移除 models.rs 所有 struct 的 `#[serde(rename_all = "camelCase")]`（IdName、User、Project、Issue、IssueParent、Membership）
- [x] 2.2 將 User.mail 改為 `Option<String>` 以容許部分 Redmine 不回傳 email

## 3. 前端型別與引用更新

- [x] 3.1 更新 api.ts Issue 型別欄位為 snake_case（assigned_to、start_date、due_date、estimated_hours、done_ratio）
- [x] 3.2 更新 api.ts IssueParams 型別欄位為 snake_case（tracker_id、status_id、priority_id 等）
- [x] 3.3 更新 api.ts TimeEntryParams 型別欄位為 snake_case（issue_id、activity_id、spent_on）
- [x] 3.4 更新 IssueList.tsx 元件中的欄位引用
- [x] 3.5 更新 IssueForm.tsx 元件中的 initialValues 和 params 欄位引用
- [x] 3.6 更新 IssueDetailPage.tsx 中的所有 issue 欄位引用
- [x] 3.7 更新 TimeEntryPage.tsx 中的 createTimeEntry 參數

## 4. 連線設定 URL 下拉選項

- [x] 4.1 在 SetupPage.tsx 的 URL 輸入欄位加入 `<datalist>`，預設選項包含 `https://your-redmine.example.com/`

## 5. 建立 Issue 表單預設值

- [x] 5.1 追蹤標籤預設為「工作」（名稱匹配，fallback 到第一項）
- [x] 5.2 優先權預設為「正常」（名稱匹配，fallback 到第一項）
- [x] 5.3 被分派者預設為目前登入使用者（從 AppContext 取得 user，匹配專案成員）
- [x] 5.4 日期欄位預設為空，未設定時顯示「未設定」placeholder，點擊後才顯示日期選擇器
