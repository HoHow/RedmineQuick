## Context

RedmineQuick 是一個全新的 Tauri 2 桌面應用程式，目前只有初始 scaffold（React 19 + TypeScript + Rust）。需要從零建立完整的前後端架構來實現 Redmine 快速存取工具。

Redmine 提供 REST API（JSON 格式），支援 API Key 認證（透過 `X-Redmine-API-Key` header 或 `key` query parameter）。主要會用到的 API endpoints：
- `GET /projects.json` — 專案列表
- `GET /issues.json?assigned_to_id=me&status_id=open` — 我的待處理 issue
- `GET /issues.json?project_id=<id>` — 專案內 issue
- `GET /issues/<id>.json` — Issue 詳情
- `POST /issues.json` — 建立 issue
- `PUT /issues/<id>.json` — 更新 issue
- `POST /time_entries.json` — 記錄工時
- `GET /enumerations/time_entry_activities.json` — 活動類型列表
- `GET /trackers.json` — 追蹤標籤列表
- `GET /issue_statuses.json` — 狀態列表
- `GET /issue_priorities.json` — 優先權列表
- `GET /projects/<id>/memberships.json` — 專案成員（用於被分派者、監看者）
- `GET /users/current.json` — 目前使用者資訊（用於驗證連線）

## Goals / Non-Goals

**Goals:**
- 建立可靠的 Redmine API 通訊層（Rust 端），處理認證與錯誤
- 建立前端路由與頁面架構，支援專案瀏覽、issue 管理、工時記錄
- 設定資料（URL、API Key）安全儲存在本機
- UI 操作流暢，減少不必要的等待

**Non-Goals:**
- System tray 常駐（未來再做）
- 檔案上傳/附件功能
- 預算與檢查列表欄位（非 Redmine 原生，需 plugin）
- 離線模式或資料快取
- 多 Redmine instance 切換
- 自訂欄位支援

## Decisions

### 1. 架構分層：Rust 負責所有 API 呼叫，React 只負責 UI

**選擇**: 所有 Redmine API 呼叫由 Rust 端的 Tauri commands 執行，前端透過 `invoke()` 呼叫。

**理由**:
- 避免 CORS 問題（Redmine 預設不允許跨域）
- API Key 不暴露在前端
- Rust 的 reqwest 提供更好的 HTTP 錯誤處理

**替代方案**: 前端直接呼叫 Redmine API → 有 CORS 和安全性問題，排除。

### 2. HTTP Client：reqwest

**選擇**: 使用 `reqwest` crate 作為 HTTP client。

**理由**: Rust 生態系最成熟的 async HTTP client，Tauri 專案常用，支援 JSON 序列化。

**替代方案**: `ureq`（sync，更簡單）→ 但 Tauri commands 本身是 async 友善的，用 reqwest 更自然。

### 3. 設定儲存：Tauri plugin-store

**選擇**: 使用 `tauri-plugin-store` 儲存設定（Redmine URL、API Key）。

**理由**: Tauri 官方 plugin，自動處理跨平台路徑，JSON 格式易於讀寫。存放在應用程式的 app data 目錄。

**替代方案**: 自行讀寫 JSON 檔 → 需處理路徑與權限，不如用現成 plugin。

### 4. 前端路由：React Router

**選擇**: 使用 `react-router` 管理頁面切換。

**理由**: React 生態系標準路由方案，支援巢狀路由，適合多頁面桌面應用。

**替代方案**: 自製簡易路由（useState 切換）→ 隨頁面增加會難以維護。

### 5. 前端狀態管理：React Context + useState

**選擇**: 不引入額外狀態管理套件，用 React Context 管理全域狀態（連線設定、目前使用者），頁面層級用 useState。

**理由**: MVP 資料流簡單（從 API 取得 → 顯示），不需要 Redux 或 Zustand 的複雜度。

**替代方案**: Zustand → 簡潔但 MVP 階段引入外部依賴不值得。

### 6. Rust 端模組結構

```
src-tauri/src/
├── lib.rs              # Tauri setup, register commands
├── main.rs             # Entry point
├── commands/
│   ├── mod.rs
│   ├── connection.rs   # test_connection, get_current_user
│   ├── projects.rs     # list_projects
│   ├── issues.rs       # list_issues, get_issue, create_issue, update_issue
│   └── time_entries.rs # create_time_entry
├── redmine/
│   ├── mod.rs
│   ├── client.rs       # RedmineClient struct, HTTP 封裝
│   └── models.rs       # API response/request 的 serde structs
└── config.rs           # 設定讀寫邏輯
```

**理由**: 將 Tauri commands、Redmine API client、資料模型分離，保持各層職責清晰。

### 7. 前端頁面結構

```
src/
├── App.tsx                 # Router 設定, AppContext provider
├── main.tsx
├── contexts/
│   └── AppContext.tsx       # 全域狀態（連線設定、使用者資訊）
├── pages/
│   ├── SetupPage.tsx        # 首次設定 / 設定頁面
│   ├── DashboardPage.tsx    # 主畫面：專案列表 + 我的待處理 issue
│   ├── ProjectIssuesPage.tsx # 專案內的 issue 列表
│   ├── IssueDetailPage.tsx  # Issue 詳情檢視/編輯
│   ├── IssueCreatePage.tsx  # 建立新 issue
│   └── TimeEntryPage.tsx    # 記錄工時
├── components/
│   ├── IssueList.tsx        # 共用 issue 列表元件
│   ├── IssueForm.tsx        # 共用 issue 表單（建立/編輯共用）
│   └── Layout.tsx           # 共用版面（導覽列等）
└── lib/
    └── api.ts               # invoke() 封裝，統一呼叫 Tauri commands
```

### 8. 頁面流程

```
┌──────────────┐
│  App 啟動     │
└──────┬───────┘
       │ 檢查是否有設定
       │
  ┌────▼─────┐     無設定     ┌──────────────┐
  │ 有設定？  │──────────────▶│  SetupPage   │
  └────┬─────┘               │  輸入 URL +   │
       │ 有                   │  API Key     │
       │                     └──────┬───────┘
       │                            │ 連線成功
       ▼                            │
┌──────────────────────────────────▼──┐
│          DashboardPage              │
│  ┌──────────────┬──────────────┐   │
│  │  我的專案     │ 我的待處理    │   │
│  │  列表        │ Issue 列表   │   │
│  └──────┬───────┴──────┬───────┘   │
└─────────┼──────────────┼───────────┘
          │              │
          ▼              │
┌──────────────────┐     │
│ ProjectIssuesPage│     │
│ 專案內 issue 列表 │     │
└────────┬─────────┘     │
         │               │
         └───────┬───────┘
                 ▼
     ┌───────────────────────┐
     │   IssueDetailPage     │
     │   檢視/編輯 issue      │──▶ TimeEntryPage
     └───────────────────────┘
```

## Risks / Trade-offs

- **API Key 明文儲存** → tauri-plugin-store 存在 app data 目錄，非加密儲存。對桌面個人工具而言可接受，但不適合共用電腦。未來可考慮整合 OS keychain。

- **Redmine 版本差異** → 不同 Redmine 版本的 API 行為可能略有不同（例如欄位格式）。MVP 先針對 Redmine 4.x/5.x 開發，遇到相容問題再處理。

- **無分頁處理** → Redmine API 預設回傳 25 筆，MVP 先用 `limit=100` 取得足夠資料。如果使用者有大量 issue，後續需要實作分頁或無限捲動。

- **無離線支援** → 所有操作都需要網路連線。對快速存取工具來說是合理取捨。

- **監看者 API 權限** → 新增/移除監看者需要 Redmine 管理員或專案管理員權限，一般使用者可能只能看不能改。UI 需要處理權限不足的情況。
