## 1. 移除 datalist

- [x] 1.1 移除 LoginPage.tsx 中的 `<datalist>` 與 `list="url-options"` 屬性

## 2. 記住 URL 功能

- [x] 2.1 新增 localStorage 讀寫邏輯（key: `rememberedRedmineUrl`）
- [x] 2.2 新增「記住 Redmine URL」checkbox，初始化時根據 localStorage 設定勾選狀態與 URL 值
- [x] 2.3 勾選時儲存當前 URL、取消勾選時清除 localStorage
- [x] 2.4 已勾選狀態下修改 URL 時即時更新 localStorage

## 3. 樣式

- [x] 3.1 checkbox 與 label 的排版樣式
