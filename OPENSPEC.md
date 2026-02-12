# OpenSpec 操作指南

## 概念

OpenSpec 是一個 spec-driven 的開發流程工具。每次要做新功能或修正，建立一個 **change**，依序產生 4 個 **artifact**（文件），最後實作並歸檔。

### 目錄結構

```
openspec/
├── specs/                          # 主規格（系統目前的行為）
│   ├── issue-management/
│   │   └── spec.md
│   ├── project-list/
│   │   └── spec.md
│   └── ...
├── changes/                        # 進行中的 change
│   └── add-dark-mode/              # 一個 change
│       ├── .openspec.yaml
│       ├── proposal.md             # Artifact 1: 提案
│       ├── specs/                  # Artifact 2: Delta Spec（差異規格）
│       │   └── issue-management/
│       │       └── spec.md
│       ├── design.md               # Artifact 3: 技術設計
│       └── tasks.md                # Artifact 4: 任務清單
└── changes/archive/                # 已歸檔的 change
    └── 2026-02-11-add-dark-mode/
```

### Artifact 流程（spec-driven schema）

```
proposal → specs → design → tasks → 實作 → 歸檔
```

| 順序 | Artifact | 內容 |
|------|----------|------|
| 1 | **proposal.md** | 為什麼要做、改什麼、影響哪些檔案 |
| 2 | **specs/** | Delta Spec — 這次 change 對規格的新增/修改 |
| 3 | **design.md** | 技術決策、架構設計、風險評估 |
| 4 | **tasks.md** | 實作任務清單（checkbox） |

---

## 指令速查

在 Claude Code 中使用斜線指令操作：

| 指令 | 用途 | 說明 |
|------|------|------|
| `/opsx:ff <名稱>` | 快速建立 | 一次產生所有 artifact，最快開始實作 |
| `/opsx:new <名稱>` | 逐步建立 | 只建立 change 骨架，不產生 artifact |
| `/opsx:continue` | 繼續建立 | 逐一建立下一個 artifact |
| `/opsx:apply` | 實作 | 依照 tasks.md 逐一實作程式碼 |
| `/opsx:archive` | 歸檔 | 同步 delta spec 到主 spec，移至 archive |
| `/opsx:explore` | 探索 | 思考模式，不寫程式碼，只討論和調查 |
| `/opsx:sync` | 同步 spec | 不歸檔，只把 delta spec 同步到主 spec |
| `/opsx:verify` | 驗證 | 檢查實作是否符合 change 的 artifact |

---

## 指令完整範例

---

### 1. `/opsx:explore` — 探索模式

**用途**：還不確定要做什麼，先討論和調查。不會寫任何程式碼。

**使用時機**：
- 有想法但還不確定怎麼做
- 想比較不同方案
- 需要先看現有程式碼再決定

**操作**：

```
你：/opsx:explore
Claude：進入探索模式。你想探索什麼？
你：我想在 issue 詳情頁顯示歷程變更記錄，像 Redmine 網頁那樣
Claude：（調查程式碼、分析 API、畫架構圖、討論方案...）
```

**Claude 會做的事**：
- 查看相關程式碼
- 分析 Redmine API 回傳格式
- 提出不同做法並比較
- 用 ASCII 圖示意架構
- 不寫程式碼、不建立檔案

**結束探索**：
- 想好後說「開 change 來做」，Claude 會建議用 `/opsx:ff` 或 `/opsx:new`
- 或直接離開，不需要特別結束

---

### 2. `/opsx:ff <名稱>` — 快速建立（推薦）

**用途**：一次產生所有 artifact，最快速進入實作。

**使用時機**：
- 你已經知道要做什麼
- 想快速開始

**操作**：

```
你：/opsx:ff journal-details
```

**Claude 會依序產生 4 個檔案**：

**① proposal.md** — 提案（為什麼要做、改什麼）
```markdown
## Why

Issue 詳情頁目前只顯示有筆記的 journal，沒有顯示欄位變更記錄
（如狀態變更、完成百分比調整等）。使用者無法在 app 內追蹤
issue 的完整歷程，需要切回 Redmine 網頁才能看到。

## What Changes

- Rust Journal struct 新增 details 欄位
- TypeScript 新增 JournalDetail 型別
- Issue 詳情頁歷程區塊改版：顯示欄位變更、tab 篩選
- 載入 issue 時建立 ID→名稱 lookup

## Capabilities

### New Capabilities
（無）

### Modified Capabilities
- issue-management: 新增 issue 歷程顯示需求

## Impact
- src-tauri/src/redmine/models.rs — Journal struct 新增 details
- src/lib/api.ts — Journal 介面、新增 JournalDetail 型別
- src/pages/IssueDetailPage.tsx — 歷程區塊改版
- src/App.css — 變更記錄樣式
```

**② specs/issue-management/spec.md** — Delta Spec（差異規格）
```markdown
## ADDED Requirements

### Requirement: Issue 歷程顯示
系統 SHALL 在 Issue 詳情頁面顯示完整歷程，包含欄位變更記錄和筆記，
並提供 tab 篩選功能。

#### Scenario: 顯示所有歷程
- **WHEN** 使用者進入 Issue 詳情頁面
- **THEN** 系統 SHALL 在歷程區塊顯示該 issue 的所有 journal

#### Scenario: 顯示欄位變更記錄
- **WHEN** journal 包含 details（欄位變更）
- **THEN** 系統 SHALL 以列表顯示每筆變更，格式為「欄位名 從 舊值 變更為 新值」

#### Scenario: 篩選筆記
- **WHEN** 使用者點擊「筆記」tab
- **THEN** 系統 SHALL 只顯示包含 notes 的 journal

... 更多 scenario
```

**③ design.md** — 技術設計（怎麼做、有什麼取捨）
```markdown
## Context
Issue 詳情頁目前的歷程區塊只顯示有 notes 的 journal，
Rust Journal struct 沒有 details 欄位。

## Goals / Non-Goals
Goals: 顯示欄位變更記錄、ID→名稱對照、tab 篩選
Non-Goals: 不做 journal 編輯/刪除、不做相對時間

## Decisions

### 1. Rust Journal struct 加 details
新增 JournalDetail struct...

### 2. 名稱對照策略
前端 fetch statuses、priorities、trackers、memberships 建立 lookup map...

### 3. Tab 篩選
使用 useState 控制 journal 過濾...

## Risks / Trade-offs
- 額外 API 呼叫：每次進入 issue 詳情會多 3-4 個 API 呼叫
- memberships 需要 projectId：必須等 getIssue 完成後才能 fetch
```

**④ tasks.md** — 任務清單（實作步驟）
```markdown
## 1. Rust 端 Journal 擴充

- [ ] 1.1 新增 JournalDetail struct（property, name, old_value, new_value）
- [ ] 1.2 Journal struct 新增 details: Vec<JournalDetail> 欄位

## 2. TypeScript 型別對應

- [ ] 2.1 新增 JournalDetail 介面，Journal 介面加入 details

## 3. 名稱對照 lookup

- [ ] 3.1 IssueDetailPage 載入時 fetch statuses、priorities、trackers
- [ ] 3.2 getIssue 完成後再 fetch memberships，建立完整 lookup map
- [ ] 3.3 建立 FIELD_LABELS 靜態 map
- [ ] 3.4 建立 resolveValue 輔助函式

## 4. 歷程 UI

- [ ] 4.1 移除現有的 notesJournals 過濾，改為顯示所有 journal
- [ ] 4.2 每筆 journal 顯示 details 列表
- [ ] 4.3 處理無舊值和無新值的顯示邏輯
- [ ] 4.4 每筆 journal 顯示編號 #N
- [ ] 4.5 新增 全部 / 筆記 / 變更 tab 篩選

## 5. 樣式

- [ ] 5.1 新增變更記錄樣式：舊值紅底、新值綠底
- [ ] 5.2 調整 journal-item 樣式支援 details + notes 混合顯示
```

**產生完畢後 Claude 會說**：
> 所有 artifact 已建立！執行 `/opsx:apply` 開始實作。

---

### 3. `/opsx:new <名稱>` — 逐步建立

**用途**：只建立 change 骨架，之後用 `/opsx:continue` 逐一建立 artifact。

**使用時機**：
- 想逐步確認每個 artifact 的內容
- 需要在每個階段跟 Claude 討論

**操作**：

```
你：/opsx:new add-watchers
```

**Claude 會做的事**：
- 建立 `openspec/changes/add-watchers/` 目錄
- 建立 `.openspec.yaml` 設定檔
- 顯示 artifact 流程和第一個 artifact 的模板
- **不產生任何 artifact 內容**

**輸出**：
```
## Change Created: add-watchers

Schema: spec-driven
Location: openspec/changes/add-watchers/
Progress: 0/4 artifacts

Artifact sequence: proposal → specs → design → tasks

Ready to create the first artifact? Run /opsx:continue
```

---

### 4. `/opsx:continue` — 繼續建立下一個 artifact

**用途**：建立當前 change 的下一個 artifact。

**使用時機**：
- 用 `/opsx:new` 建立 change 後，逐一建立 artifact
- 中斷後繼續未完成的 artifact

**操作**：

```
你：/opsx:new add-watchers        # Step 1: 建立骨架

你：/opsx:continue                # Step 2: 建立 proposal.md
Claude：（產生 proposal.md）
Claude：Progress: 1/4 complete. Run /opsx:continue to create specs.

你：/opsx:continue                # Step 3: 建立 specs/
Claude：（產生 delta spec）
Claude：Progress: 2/4 complete. Run /opsx:continue to create design.

你：/opsx:continue                # Step 4: 建立 design.md
Claude：（產生 design.md）
Claude：Progress: 3/4 complete. Run /opsx:continue to create tasks.

你：/opsx:continue                # Step 5: 建立 tasks.md
Claude：（產生 tasks.md）
Claude：All artifacts created! Run /opsx:apply to start implementing.
```

**如果有多個 change**，Claude 會詢問你要繼續哪一個。

---

### 5. `/opsx:apply` — 實作

**用途**：依照 tasks.md 的任務清單，逐一實作程式碼。

**使用時機**：
- 所有 artifact（至少 tasks.md）已建立完成
- 準備開始寫程式碼

**操作**：

```
你：/opsx:apply
```

**Claude 會做的事**：
1. 讀取 proposal、specs、design、tasks 了解完整上下文
2. 找到第一個未完成的任務 `- [ ]`
3. 實作程式碼
4. 標記為完成 `- [x]`
5. 繼續下一個任務，直到全部完成

**過程中的輸出**：
```
## Implementing: journal-details (schema: spec-driven)

Working on task 1.1: 新增 JournalDetail struct
[...修改 src-tauri/src/redmine/models.rs...]
✓ Task complete

Working on task 1.2: Journal struct 新增 details 欄位
[...修改 src-tauri/src/redmine/models.rs...]
✓ Task complete

Working on task 2.1: 新增 JournalDetail 介面
[...修改 src/lib/api.ts...]
✓ Task complete

...（繼續直到所有任務完成）
```

**完成後**：
```
## Implementation Complete

Progress: 14/14 tasks complete ✓

All tasks complete! You can archive this change with /opsx:archive.
```

**如果遇到問題**，Claude 會暫停並詢問：
```
## Implementation Paused

Working on task 3.2 but encountered an issue:
memberships API 需要 projectId，但在此時還未載入...

Options:
1. 分兩階段載入
2. 先 fetch issue 取得 projectId
3. Other approach

What would you like to do?
```

---

### 6. `/opsx:archive` — 歸檔

**用途**：實作完成後，同步 delta spec 到主 spec，並將 change 移至 archive。

**使用時機**：
- 所有任務已完成
- 程式碼已測試、已 commit

**操作**：

```
你：/opsx:archive
```

**Claude 會做的事**：

**① 檢查完成狀態**
```
Checking artifacts... 4/4 complete ✓
Checking tasks... 14/14 complete ✓
```

**② 檢查 delta spec 並詢問是否同步**

如果有 delta spec，Claude 會顯示：
```
Delta spec found: specs/issue-management/spec.md

Changes to sync:
- ADDED: "Issue 歷程顯示" requirement (10 scenarios)

Options:
1. Sync now (Recommended)  ← 建議選這個
2. Archive without syncing
```

選擇「Sync now」後，Claude 會把 delta spec 的內容合併到主 spec
（`openspec/specs/issue-management/spec.md`）。

**③ 移至 archive**
```
Moving to: openspec/changes/archive/2026-02-11-journal-details/
```

**④ 顯示結果**
```
## Archive Complete

Change: journal-details
Schema: spec-driven
Archived to: openspec/changes/archive/2026-02-11-journal-details/
Specs: ✓ Synced to main specs

All artifacts complete. All tasks complete.
```

**如果有未完成的任務**，Claude 會警告但不阻擋：
```
⚠ Warning: 3 incomplete tasks found
Continue archiving anyway? (y/n)
```

---

### 7. `/opsx:sync` — 同步 spec（不歸檔）

**用途**：只把 delta spec 同步到主 spec，不歸檔 change。

**使用時機**：
- 想先同步 spec 但還不想歸檔
- 需要更新主 spec 但 change 還在進行中

**操作**：

```
你：/opsx:sync
Claude：Which change to sync? (選擇 change)
Claude：Syncing delta spec to main spec...
Claude：✓ Synced issue-management spec
```

---

### 8. `/opsx:verify` — 驗證實作

**用途**：檢查程式碼是否符合 change 的 artifact 描述。

**使用時機**：
- 實作完成後、歸檔前，想確認沒有遺漏
- 不確定實作是否完整符合 spec

**操作**：

```
你：/opsx:verify
Claude：Verifying implementation against change artifacts...
Claude：
  ✓ proposal.md - all changes implemented
  ✓ specs - all scenarios covered
  ✓ design.md - all decisions followed
  ✓ tasks.md - 14/14 complete

  Implementation matches change artifacts.
```

---

## Delta Spec 語法

Delta spec 用來描述這次 change 對規格的變動，放在 `changes/<name>/specs/<capability>/spec.md`。

### 新增需求

用 `## ADDED Requirements` 標記全新的 requirement：

```markdown
## ADDED Requirements

### Requirement: Issue 歷程顯示
系統 SHALL 在 Issue 詳情頁面顯示完整歷程。

#### Scenario: 顯示所有歷程
- **WHEN** 使用者進入 Issue 詳情頁面
- **THEN** 系統 SHALL 顯示所有 journal

#### Scenario: 篩選筆記
- **WHEN** 使用者點擊「筆記」tab
- **THEN** 系統 SHALL 只顯示包含 notes 的 journal
```

### 修改需求

用 `## MODIFIED Requirements` 標記對現有 requirement 的修改。
需要寫出修改後的**完整 requirement**（包含所有 scenario）：

```markdown
## MODIFIED Requirements

### Requirement: 建立新 Issue
系統 SHALL 提供建立 issue 的表單...

#### Scenario: 返回專案 Issue 列表
- **WHEN** 使用者在建立 Issue 頁面點擊「返回」按鈕或取消
- **THEN** 系統 SHALL 導向該專案的 Issue 列表頁面，而非瀏覽器上一頁
```

### 同步（Sync）效果

歸檔時選「Sync now」，delta spec 合併到主 spec（`openspec/specs/<capability>/spec.md`）：
- `ADDED` → 整段新增到主 spec 尾部
- `MODIFIED` → 覆蓋主 spec 中同名的 requirement

---

## 常見流程總結

### 快速流程（最常用）

```
/opsx:ff <名稱>       ← 一次產生所有 artifact
/opsx:apply            ← 實作程式碼
幫我 commit            ← commit 程式碼
/opsx:archive          ← 歸檔，同步 spec
幫我 commit            ← commit openspec 變更
```

### 逐步流程（需要討論時）

```
/opsx:explore          ← 先討論、調查（可選）
/opsx:new <名稱>       ← 建立骨架
/opsx:continue         ← 建立 proposal（確認後繼續）
/opsx:continue         ← 建立 specs（確認後繼續）
/opsx:continue         ← 建立 design（確認後繼續）
/opsx:continue         ← 建立 tasks（確認後繼續）
/opsx:apply            ← 實作程式碼
/opsx:archive          ← 歸檔
```

### Change 名稱規則

- 使用 **kebab-case**（小寫 + 連字號）
- 描述要做什麼，不要太長
- 範例：`fix-back-navigation`、`journal-details`、`issue-attachments`、`add-dark-mode`
