## 1. 更新狀態共享

- [x] 1.1 UpdateChecker 偵測到更新時設定 `window.__updateAvailable = true` 並 dispatch `update-available` 事件
- [x] 1.2 UpdateChecker 使用者點擊「稍後再說」後，不再於 Layout 顯示紅點（本次 session）

## 2. Layout 齒輪圖示

- [x] 2.1 navbar 新增齒輪 SVG 圖示按鈕，點擊導向 `/settings`
- [x] 2.2 監聽 `update-available` 事件，有更新時齒輪旁顯示紅點
- [x] 2.3 移除 dropdown 中的 `v{appVersion}` 顯示
- [x] 2.4 移除 Layout 中不再需要的 `appVersion` state 和 `getVersion` import

## 3. SettingsPage

- [x] 3.1 新增 `src/pages/SettingsPage.tsx`，包含返回按鈕和頁面標題
- [x] 3.2 顯示目前版本號（使用 `getVersion()` API）
- [x] 3.3 檢查更新按鈕，觸發 `window.__checkForUpdate` 並顯示結果訊息
- [x] 3.4 更新紀錄區塊：從 GitHub Releases API fetch，顯示版本號、日期、更新內容
- [x] 3.5 處理更新紀錄的載入中、載入失敗、無資料狀態

## 4. 路由與清理

- [x] 4.1 `App.tsx` 新增 `/settings` 路由指向 SettingsPage
- [x] 4.2 DashboardPage 移除底部版本號、檢查更新、相關 state 和 import

## 5. 樣式

- [x] 5.1 齒輪圖示和紅點樣式
- [x] 5.2 SettingsPage 頁面樣式（版本區塊、更新紀錄列表）
