<!-- SPECTRA:START v1.0.2 -->

# Spectra Instructions

This project uses Spectra for Spec-Driven Development(SDD). Specs live in `openspec/specs/`, change proposals in `openspec/changes/`.

## Use `/spectra-*` skills when:

- A discussion needs structure before coding → `/spectra-discuss`
- User wants to plan, propose, or design a change → `/spectra-propose`
- Tasks are ready to implement → `/spectra-apply`
- There's an in-progress change to continue → `/spectra-ingest`
- User asks about specs or how something works → `/spectra-ask`
- Implementation is done → `/spectra-archive`
- Commit only files related to a specific change → `/spectra-commit`

## Workflow

discuss? → propose → apply ⇄ ingest → archive

- `discuss` is optional — skip if requirements are clear
- Requirements change mid-work? Plan mode → `ingest` → resume `apply`

## Parked Changes

Changes can be parked（暫存）— temporarily moved out of `openspec/changes/`. Parked changes won't appear in `spectra list` but can be found with `spectra list --parked`. To restore: `spectra unpark <name>`. The `/spectra-apply` and `/spectra-ingest` skills handle parked changes automatically.

<!-- SPECTRA:END -->

# RedmineQuick — AI 開發規範

## 溝通語言

- 與使用者溝通一律使用**繁體中文**
- 程式碼中的註解使用英文
- Git commit message 使用繁體中文

## 開發流程

- **嚴格按照 OpenSpec tasks 的順序執行**，不跳過、不自行調整優先順序
- **不要修改 task 範圍外的程式碼**，除非是完成當前 task 所必要的
- 每完成一個 task 後，在 tasks.md 中將該 task 標記為完成
- 遇到不確定的地方**先暫停詢問**，不要猜測或自行決定
- 不要自行新增 task 中未描述的功能、最佳化或重構

## Git 規則

### Branch 策略

- 每個 OpenSpec change 使用獨立的 feature branch
- Branch 命名：`feature/<change-name>`（例如 `feature/initial-mvp`）
- 從 `main` 分支建立，完成後合併回 `main`
- 開始實作前先建立 branch，不要直接在 main 上開發

### Commit 規則

- **絕對不要自動 commit**，每次 commit 前必須：
  1. 列出要 commit 的檔案清單
  2. 說明這次 commit 的內容摘要
  3. **等待使用者明確同意後**才執行 commit
- 使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：
  - `feat:` 新功能
  - `fix:` 修復 bug
  - `refactor:` 重構（不改變行為）
  - `chore:` 工具、依賴、設定變更
  - `docs:` 文件變更
- Commit message 使用繁體中文，簡短描述變更內容
- 不要把不相關的變更混在同一個 commit

### Commit 節奏

- 依照 tasks.md 的**功能群組**（## 標題）為單位 commit
- 一個群組完成後，主動提議 commit 並等待確認
- 對應關係：
  - `## 1. 專案基礎建設` → 一次 commit
  - `## 2. Redmine API Client` → 一次 commit
  - `## 3. 設定儲存與連線管理` → 一次 commit
  - 以此類推，每個功能群組一次 commit

## TypeScript 規範

- 使用 TypeScript strict mode
- 所有 function 參數和回傳值必須有明確的型別，不使用 `any`
- 使用 `interface` 定義資料結構，與 Rust 端的 serde structs 保持對應
- React 元件使用 function component + hooks
- 檔案命名：元件用 PascalCase（`SetupPage.tsx`），工具用 camelCase（`api.ts`）

## Rust 規範

- 程式碼需通過 `cargo clippy` 無警告
- 使用 `thiserror` 或字串錯誤處理 Tauri command 的錯誤，確保前端能收到有意義的錯誤訊息
- Serde structs 使用 `#[serde(rename_all = "camelCase")]` 讓前端收到 camelCase 欄位
- 模組結構按照 design.md 中定義的架構

## 程式碼風格

- 不要加不必要的註解（程式碼本身應該足夠清楚）
- 不要過度工程化：只做 task 要求的事
- 不要加 TODO 註解，待辦事項由 OpenSpec tasks 管理
