## 1. 後端搜尋 API

- [x] 1.1 在 `RedmineClient` 新增 `search_issues(query, project_id?)` 方法，呼叫 `GET /issues.json?subject=~{query}&limit=10`
- [x] 1.2 新增 `search_issues` Tauri command，接受 `query: String` 和 `project_id: Option<u64>`
- [x] 1.3 在前端 `api.ts` 新增 `searchIssues(query, projectId?)` 函式

## 2. SearchContext 與鍵盤快捷鍵

- [x] 2.1 建立 `SearchContext`，提供 `isOpen`、`open()`、`close()` 狀態管理
- [x] 2.2 在 SearchContext 中監聯全域 Cmd+K / Ctrl+K 鍵盤事件，觸發開關
- [x] 2.3 在 `App.tsx` 掛載 SearchProvider

## 3. SearchDialog 元件

- [x] 3.1 建立 `SearchDialog` 元件：浮動 modal、輸入框、結果區、背景遮罩
- [x] 3.2 實作輸入判斷邏輯：純數字走 `getIssue` 即時預覽（debounce 300ms），非數字等待 Enter 呼叫 `searchIssues`
- [x] 3.3 實作情境感知：使用 `useParams` 偵測 `projectId`，搜尋時帶入
- [x] 3.4 實作鍵盤導航：↑/↓ 移動選取、Enter 確認、ESC 關閉
- [x] 3.5 實作選擇結果後導航至 Issue 詳情頁並關閉搜尋框
- [x] 3.6 撰寫 SearchDialog 測試：開關、數字預覽、文字搜尋、鍵盤導航

## 4. Navbar 整合

- [x] 4.1 在 Navbar 新增搜尋圖示按鈕，點擊觸發 SearchContext.open()

## 5. 樣式

- [x] 5.1 新增 SearchDialog 相關 CSS 樣式（浮動 modal、結果列表、高亮選取、loading 狀態）
