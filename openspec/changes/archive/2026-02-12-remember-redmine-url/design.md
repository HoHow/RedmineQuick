## Context

目前登入頁面使用 `<datalist>` 硬編碼一個 URL 做為下拉建議，不夠通用。使用者需要每次手動輸入 Redmine URL。此改動移除 datalist，改用 checkbox + localStorage 讓使用者選擇是否記住 URL。

## Goals / Non-Goals

**Goals:**
- 移除硬編碼的 `<datalist>` URL 下拉
- 提供「記住 Redmine URL」checkbox，勾選後持久化 URL 到 localStorage
- 下次開啟 App 自動填入記住的 URL

**Non-Goals:**
- 不支援記住多個 URL（只記一個）
- 不動 API Key 的儲存邏輯（維持 tauri-plugin-store）
- 不動已登入狀態下的 config 儲存邏輯

## Decisions

### localStorage key 設計
- 使用 `rememberedRedmineUrl` 存 URL 值
- 有值 = checkbox 勾選；無值 = checkbox 未勾選
- 不需額外的 boolean key，key 的存在與否即代表勾選狀態

**理由**: 簡單，一個 key 就能表達兩種狀態，不需要額外同步。

### 儲存時機
- 勾選 checkbox 時立即存入當前 URL
- 已勾選狀態下修改 URL 時即時更新
- 取消勾選時刪除 key

**理由**: 即時儲存確保使用者操作直覺，不需要等到登入成功。

### 與現有 config 的關係
- 此功能獨立於 `saveConfig()`（tauri-plugin-store）
- `saveConfig` 在登入成功後才存，用於 App 運作
- `rememberedRedmineUrl` 在登入前就存，用於自動填入

## Risks / Trade-offs

- [localStorage vs tauri-plugin-store] → 選 localStorage 因為這是純前端 UI 偏好，不需要跨進 Rust 端。且通知系統已用 localStorage 做持久化，保持一致。
