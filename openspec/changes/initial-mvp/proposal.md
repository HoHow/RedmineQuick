## Why

使用 Redmine 網頁介面操作繁瑣、載入慢，每次要查看 issue、更新進度或記錄工時都需要打開瀏覽器來回切換。需要一個輕量的桌面工具，讓開發者可以快速連線 Redmine、瀏覽專案與 issue，並直接在本機完成建立、更新和工時記錄操作。

## What Changes

- 新增 Redmine API 連線功能，支援 API Key 認證
- 新增設定頁面，讓使用者輸入 Redmine URL 和 API Key
- 新增專案列表頁面，顯示使用者所屬的專案
- 新增「我的待處理 Issue」頁面，跨專案顯示所有指派給我的未完成 issue
- 新增 Issue 列表頁面，可依專案篩選
- 新增 Issue 詳情檢視
- 新增建立/編輯 Issue 功能，支援欄位：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者
- 新增設定 Issue 進度（完成百分比）與狀態更新功能
- 新增工時記錄功能，可針對 issue 記錄花費時間、活動類型與備註

## Capabilities

### New Capabilities
- `redmine-connection`: Redmine API 連線管理，包含 URL/API Key 設定、連線測試、認證持久化
- `project-list`: 瀏覽使用者所屬的 Redmine 專案列表
- `issue-management`: Issue 的 CRUD 操作 — 查看列表、查看詳情、建立新 issue、編輯 issue、更新進度與狀態。欄位包含：追蹤標籤、主旨、概述、狀態、優先權、被分派者、父議題、開始日期、完成日期、預估工時、監看者
- `time-logging`: 工時記錄 — 針對 issue 記錄花費時間、選擇活動類型、填寫備註

### Modified Capabilities
（無現有 capability，全部為新建）

## Impact

- **Frontend**: 需要新增路由系統、多個頁面元件、表單元件，取代現有的 boilerplate 首頁
- **Backend (Rust)**: 新增 Tauri commands 負責 Redmine REST API 呼叫（HTTP client）、設定檔讀寫
- **Dependencies**: Rust 側需要 HTTP client（reqwest）、設定檔儲存；React 側可能需要路由（react-router）和狀態管理
- **Storage**: 本機設定檔儲存 Redmine URL 和 API Key
