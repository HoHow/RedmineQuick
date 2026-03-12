## Context

Issue 詳情頁目前可檢視歷程紀錄（journals），但無法新增留言。使用者需跳回瀏覽器才能回覆。

後端 `IssueParams` 已有 `notes` 欄位，`update_issue` command 也已支援帶 `notes` 的 PUT 請求。前端 `api.ts` 的 `IssueParams` 同樣已有 `notes?: string`。因此後端不需任何修改，僅需前端新增 UI 元件。

## Goals / Non-Goals

**Goals:**
- 在 Issue 詳情頁底部新增留言輸入區（NoteForm）
- 支援引用 Issue 描述與每則歷程留言
- 引用格式使用 `> ` 前綴（Redmine Textile 風格）
- 使用 TDD 開發

**Non-Goals:**
- 不做 Textile/Markdown 預覽功能
- 不做留言編輯或刪除（Redmine API 不支援）
- 不做即時協作或推播更新

## Decisions

### 1. 重用現有 `updateIssue` API 而非新增 command

現有的 `updateIssue(issueId, { notes })` 已可新增筆記。不需要新增 Tauri command。

替代方案：新增專用的 `addIssueNote` command → 拒絕，因為 Redmine API 本身就是透過 PUT issue 帶 notes 實現，新增 command 只是多一層不必要的包裝。

### 2. NoteForm 作為獨立元件

將留言表單抽為 `src/components/NoteForm.tsx`，接收 `issueId` 和 `onNoteAdded` callback。

理由：
- 可獨立測試
- IssueDetailPage 已經很長（450+ 行），不應再增加複雜度
- `onNoteAdded` callback 讓父元件決定如何刷新資料

### 3. 引用功能透過 callback 傳遞

JournalSection 和描述區塊透過 `onQuote(text: string)` callback 將引用文字傳給 NoteForm。NoteForm 透過 `useImperativeHandle` 暴露 `appendQuote(text: string)` 方法，或更簡單地使用 state lifting：父元件持有 `pendingQuote` state，NoteForm 監聽變化後 append。

選擇 state lifting 方式：
- 比 ref + imperative handle 更符合 React 慣例
- 測試更容易（直接設定 props）
- 實作更簡單

流程：
1. 使用者點擊引用按鈕 → `onQuote(text)` 被呼叫
2. IssueDetailPage 設定 `pendingQuote` state
3. NoteForm 透過 `useEffect` 偵測 `pendingQuote` 變化，append 到 textarea
4. Append 完成後清除 `pendingQuote`
5. 自動捲動至 NoteForm 並 focus textarea

### 4. 引用格式

```
> 被引用的第一行
> 被引用的第二行

```

- 每行前加 `> ` 前綴
- 引用區塊後方加一個空行，方便使用者接著輸入
- 多次引用累加在 textarea 現有內容之後

## Risks / Trade-offs

- **長描述引用** → 引用整段可能很長，但這是 Redmine 的標準行為，不額外截斷
- **Textarea 不支援富文本** → 純文字輸入，使用者需自行寫 Textile 格式。這是 Non-Goal，未來可擴展
