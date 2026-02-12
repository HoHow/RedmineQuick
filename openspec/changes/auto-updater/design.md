## Context

目前 App 沒有自動更新機制，每次發版需要手動傳安裝檔給使用者。Tauri 2 提供 `tauri-plugin-updater`，支援從 GitHub Releases 檢查並下載更新。使用者希望程式碼保持私有，因此採用「私有 repo（程式碼）+ 公開 repo（安裝檔）」的雙 repo 架構。

現有 GitHub Actions workflow 已能 build macOS 和 Windows 安裝檔並建立 Draft Release。

## Goals / Non-Goals

**Goals:**
- App 啟動時自動檢查更新，有新版時提示使用者
- 提供手動「檢查更新」按鈕
- 使用者可選擇更新或跳過（非強制）
- 更新過程顯示下載進度
- build 時自動簽署安裝檔
- 安裝檔發佈到公開 repo 的 GitHub Releases

**Non-Goals:**
- 不做強制更新
- 不做差量更新（delta update），每次下載完整安裝檔
- 不做 Linux 平台支援（目前只有 macOS 和 Windows）
- 不做更新頻道（stable / beta）

## Decisions

### 1. 使用 tauri-plugin-updater

Tauri 2 官方 updater plugin，支援：
- 從 JSON endpoint 檢查最新版本
- 下載 + 驗證簽名 + 安裝
- 提供下載進度回調

安裝：
- Rust: `tauri-plugin-updater = "2"`
- 前端: `@tauri-apps/plugin-updater`

### 2. 更新簽署金鑰

Tauri updater 強制要求簽署。使用 `tauri signer generate` 產生金鑰對：

- **私鑰**：存為 GitHub Secrets `TAURI_SIGNING_PRIVATE_KEY` 和 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- **公鑰**：寫入 `tauri.conf.json` 的 `plugins.updater.pubkey`

### 3. 雙 repo 架構

```
私有 repo (RedmineQuick)          公開 repo (RedmineQuick-releases)
├── 程式碼                         ├── README.md（說明用）
├── GitHub Actions ──build──sign──push──▶ GitHub Releases
│                                  │   ├── v0.2.0
│                                  │   │   ├── redminequick_0.2.0_aarch64.dmg
│                                  │   │   ├── redminequick_0.2.0_x64-setup.msi
│                                  │   │   └── latest.json
```

GitHub Actions workflow 修改：
- 新增環境變數 `TAURI_SIGNING_PRIVATE_KEY` 和 `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`
- `tauri-action` 會自動簽署並產生 `latest.json`
- build 完成後，用 `gh release create` 或 GitHub API 將 assets 推送到公開 repo
- 需要一個 Personal Access Token (PAT) 存為 `RELEASE_REPO_TOKEN`，授權推送到公開 repo

### 4. Updater endpoint

`tauri.conf.json` 的 updater endpoint 設定：

```json
{
  "plugins": {
    "updater": {
      "endpoints": [
        "https://github.com/<owner>/RedmineQuick-releases/releases/latest/download/latest.json"
      ],
      "pubkey": "<public-key>"
    }
  }
}
```

Tauri updater 會 GET 這個 URL，取得 `latest.json`，比對版本號決定是否有更新。

### 5. 前端更新元件

新增 `UpdateChecker` 元件，掛載在 App 頂層：

```
App
├── UpdateChecker（啟動時檢查，管理更新狀態）
├── Router
│   ├── DashboardPage
│   ├── ...
```

狀態管理使用 `useState`：
- `updateAvailable`: 是否有更新
- `updateVersion`: 新版本號
- `downloading`: 是否正在下載
- `progress`: 下載進度百分比
- `error`: 錯誤訊息

更新對話框使用 modal overlay（類似現有 lightbox 的做法）。

### 6. 手動檢查更新的位置

目前 App 沒有獨立的設定頁。兩個選項：

**方案 A**：在 DashboardPage 底部加一行「v0.1.0 · 檢查更新」
**方案 B**：新增獨立 SettingsPage

選擇方案 A — 目前設定項很少（只有版本和檢查更新），不需要獨立頁面。未來設定項增多時再拆出 SettingsPage。

位置：DashboardPage 頁面底部，顯示版本號和檢查更新連結。

### 7. 版本號取得方式

使用 Tauri 的 `getVersion()` API 從 `tauri.conf.json` 讀取版本號，不硬編碼。

```typescript
import { getVersion } from '@tauri-apps/api/app';
const version = await getVersion(); // "0.1.0"
```

## Risks / Trade-offs

- **PAT 權限**：推送到公開 repo 需要 Personal Access Token。需要 `repo` scope → 建議建立專用的 fine-grained token，只授權公開 repo
- **GitHub API rate limit**：每次啟動都會 GET latest.json → GitHub 靜態檔案有 CDN，不受 API rate limit 影響
- **首次設定複雜度**：需要產生金鑰、建立公開 repo、設定 Secrets、建立 PAT → 一次性設定，之後發版流程不變
- **公開 repo 需要手動建立**：使用者需要先在 GitHub 上建立 `RedmineQuick-releases` 公開 repo
