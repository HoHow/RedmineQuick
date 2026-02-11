## ADDED Requirements

### Requirement: Issue 歷程顯示
系統 SHALL 在 Issue 詳情頁面顯示完整歷程，包含欄位變更記錄和筆記，並提供 tab 篩選功能。

#### Scenario: 顯示所有歷程
- **WHEN** 使用者進入 Issue 詳情頁面
- **THEN** 系統 SHALL 在歷程區塊顯示該 issue 的所有 journal，每筆包含：作者、時間、編號（#N），以及該筆的欄位變更記錄和/或筆記

#### Scenario: 顯示欄位變更記錄
- **WHEN** journal 包含 details（欄位變更）
- **THEN** 系統 SHALL 以列表顯示每筆變更，格式為「欄位名 從 舊值 變更為 新值」，舊值以紅底標示、新值以綠底標示

#### Scenario: 欄位新設定（無舊值）
- **WHEN** journal detail 的 old_value 為空
- **THEN** 系統 SHALL 顯示「欄位名 設定為 新值」，新值以綠底標示

#### Scenario: 欄位清除（無新值）
- **WHEN** journal detail 的 new_value 為空
- **THEN** 系統 SHALL 顯示「欄位名 已清除（原值：舊值）」，舊值以紅底標示

#### Scenario: ID 欄位名稱對照
- **WHEN** journal detail 的欄位為 status_id、priority_id、tracker_id 或 assigned_to_id
- **THEN** 系統 SHALL 將 ID 值對照為可讀名稱顯示（如 status_id "1" 顯示為「新建立」）

#### Scenario: 欄位名稱中文化
- **WHEN** 系統顯示欄位變更記錄
- **THEN** 系統 SHALL 將欄位名轉換為中文（如 status_id → 狀態、priority_id → 優先權、done_ratio → 完成百分比、due_date → 完成日期、assigned_to_id → 分派給、tracker_id → 追蹤標籤、subject → 主旨、description → 概述、start_date → 開始日期、estimated_hours → 預估工時）

#### Scenario: 預設顯示全部 tab
- **WHEN** 使用者進入 Issue 詳情頁面的歷程區塊
- **THEN** 系統 SHALL 預設選取「全部」tab，顯示所有 journal

#### Scenario: 篩選筆記
- **WHEN** 使用者點擊「筆記」tab
- **THEN** 系統 SHALL 只顯示包含 notes 的 journal

#### Scenario: 篩選變更
- **WHEN** 使用者點擊「變更」tab
- **THEN** 系統 SHALL 只顯示包含 details 的 journal

#### Scenario: 無歷程記錄
- **WHEN** issue 沒有任何 journal
- **THEN** 系統 SHALL 顯示空狀態提示訊息
