## 1. AppContext 自動登入與登出

- [x] 1.1 在 AppProvider useEffect 中，loadConfig 成功後自動呼叫 testConnection，成功設定 user、失敗保持 user = null
- [x] 1.2 新增 logout 函數：setUser(null)，並透過 AppState 介面暴露給元件使用

## 2. 登入頁面改造

- [x] 2.1 將 SetupPage.tsx 重命名為 LoginPage.tsx，更新 App.tsx 的 import 和 route path（/setup → /login）
- [x] 2.2 頁面標題從「Redmine 連線設定」改為「登入 Redmine」
- [x] 2.3 合併「測試連線」與「儲存並進入」為單一「登入」按鈕：點擊後 testConnection + saveConfig + setUser + navigate("/")
- [x] 2.4 登入頁面從 config 預填 URL 和 API Key（含 auto-login 失敗後的情境）

## 3. Route Guard 調整

- [x] 3.1 App.tsx 中將 route guard 從 `!config` 改為 `!user`，未登入時導向 /login

## 4. Navbar 使用者下拉選單

- [x] 4.1 Layout.tsx 移除「設定」按鈕，新增使用者名稱顯示（user.firstname + user.lastname）
- [x] 4.2 實作下拉選單 toggle（useState boolean），包含「設定」和「登出」選項
- [x] 4.3 實作點擊外部關閉下拉選單（useEffect + document click listener）
- [x] 4.4 「登出」選項呼叫 logout() 後 navigate("/login")
- [x] 4.5 「設定」選項 navigate("/login")

## 5. 樣式

- [x] 5.1 新增 .user-dropdown 相關 CSS 樣式（dropdown container、menu、menu items、hover 狀態）
- [x] 5.2 確保 dropdown 在亮色與暗色主題下都正確顯示
