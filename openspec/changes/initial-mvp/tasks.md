## 1. 專案基礎建設與依賴安裝

- [x] 1.1 Rust 端加入依賴：reqwest (features: json, rustls-tls)、tokio、tauri-plugin-store
- [x] 1.2 前端加入依賴：react-router
- [x] 1.3 建立 Rust 模組結構：commands/、redmine/、config.rs
- [x] 1.4 建立前端目錄結構：contexts/、pages/、components/、lib/
- [x] 1.5 設定 React Router 於 App.tsx，建立基本路由框架
- [x] 1.6 建立 Layout.tsx 共用版面元件（導覽列、設定入口）

## 2. Redmine API Client（Rust 端）

- [x] 2.1 建立 redmine/models.rs — 定義所有 API response/request serde structs（User、Project、Issue、TimeEntry、Tracker、Status、Priority、Membership）
- [x] 2.2 建立 redmine/client.rs — RedmineClient struct，封裝 base_url、api_key、reqwest::Client，提供通用 GET/POST/PUT 方法
- [x] 2.3 實作 client 方法：get_current_user()
- [x] 2.4 實作 client 方法：list_projects()
- [x] 2.5 實作 client 方法：list_issues(filters)、get_issue(id)、create_issue(params)、update_issue(id, params)
- [x] 2.6 實作 client 方法：create_time_entry(params)
- [x] 2.7 實作 client 方法：list_trackers()、list_statuses()、list_priorities()、list_activities()、list_memberships(project_id)

## 3. 設定儲存與連線管理

- [x] 3.1 建立 config.rs — 使用 tauri-plugin-store 讀寫 Redmine URL 和 API Key
- [x] 3.2 建立 commands/connection.rs — Tauri commands：test_connection(url, api_key) 回傳使用者資訊、save_config、load_config
- [x] 3.3 於 lib.rs 註冊 connection commands 並初始化 tauri-plugin-store

## 4. 連線設定頁面（Frontend）

- [x] 4.1 建立 lib/api.ts — 封裝 invoke() 呼叫，定義 TypeScript 型別對應 Rust 端回傳結構
- [x] 4.2 建立 contexts/AppContext.tsx — 管理全域狀態：連線設定、目前使用者、是否已設定
- [x] 4.3 建立 SetupPage.tsx — URL 和 API Key 輸入表單、測試連線按鈕、成功/失敗訊息顯示
- [x] 4.4 實作啟動時檢查設定邏輯：有設定 → Dashboard，無設定 → SetupPage

## 5. Dashboard 主畫面

- [x] 5.1 建立 Tauri commands：commands/projects.rs — list_projects command
- [x] 5.2 建立 Tauri commands：commands/issues.rs — list_my_issues command（assigned_to_id=me, status=open）
- [x] 5.3 於 lib.rs 註冊 projects 和 issues commands
- [x] 5.4 建立 DashboardPage.tsx — 左右或上下並列顯示「我的專案」列表和「我的待處理 Issue」列表
- [x] 5.5 建立 IssueList.tsx 共用元件 — 顯示 issue 列表（主旨、專案、追蹤標籤、狀態、優先權、完成百分比），可點擊進入詳情

## 6. 專案 Issue 列表

- [x] 6.1 新增 Tauri command：list_project_issues(project_id)
- [x] 6.2 建立 ProjectIssuesPage.tsx — 顯示專案名稱、issue 列表（複用 IssueList 元件）、「新增 Issue」按鈕

## 7. Issue 詳情與編輯

- [ ] 7.1 新增 Tauri command：get_issue(id)、update_issue(id, params)
- [ ] 7.2 新增 Tauri commands：list_trackers、list_statuses、list_priorities、list_memberships(project_id)
- [ ] 7.3 建立 IssueDetailPage.tsx — 檢視模式顯示所有欄位、「編輯」按鈕、快速更新狀態下拉選單、快速更新完成百分比
- [ ] 7.4 建立 IssueForm.tsx 共用表單元件 — 支援所有欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者
- [ ] 7.5 實作 IssueDetailPage 編輯模式 — 切換為 IssueForm、送出更新、錯誤處理

## 8. 建立新 Issue

- [ ] 8.1 新增 Tauri command：create_issue(params)
- [ ] 8.2 建立 IssueCreatePage.tsx — 複用 IssueForm 元件、送出建立、成功後導向詳情頁、錯誤處理

## 9. 工時記錄

- [ ] 9.1 新增 Tauri commands：create_time_entry(params)、list_activities
- [ ] 9.2 建立 TimeEntryPage.tsx — 工時記錄表單（時數、活動類型、備註、日期），issue 自動帶入，送出後返回 Issue 詳情

## 10. 整合與收尾

- [ ] 10.1 移除 boilerplate 首頁內容和 greet command
- [ ] 10.2 確保所有頁面間的路由導航正確（返回按鈕、麵包屑等）
- [ ] 10.3 統一錯誤處理：API 呼叫失敗時顯示使用者友善的錯誤訊息
- [ ] 10.4 統一 loading 狀態：API 呼叫進行中時顯示載入指示器
