## Why

登入頁面的 Redmine URL 欄位目前使用硬編碼的 `<datalist>` 下拉建議，不夠通用。使用者希望能記住曾輸入的 URL，下次開啟 App 自動填入，無需每次重新輸入。

## What Changes

- 移除 `<datalist>` 硬編碼的 URL 下拉建議
- 新增「記住 Redmine URL」checkbox
- 勾選時，將 URL 存至 localStorage，下次開啟 App 自動填入（不需登入成功）
- 未勾選時，不保留 URL

## Capabilities

### New Capabilities
- `remember-url`: 登入頁面記住 Redmine URL 的 checkbox 功能與持久化邏輯

### Modified Capabilities

（無）

## Impact

- `src/pages/LoginPage.tsx`：移除 datalist、新增 checkbox 與 localStorage 邏輯
- `src/App.css`：checkbox 樣式（如需要）
