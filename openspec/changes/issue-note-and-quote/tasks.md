## 1. NoteForm 元件（TDD）

- [x] 1.1 建立 `src/components/NoteForm.tsx` 測試檔，撰寫以下測試案例：輸入文字+送出呼叫 API 並清空、空白不可送出、送出中按鈕 disabled、送出失敗顯示錯誤且保留內容
- [x] 1.2 實作 `src/components/NoteForm.tsx` 元件，接收 `issueId: number` 和 `onNoteAdded: () => void` props，呼叫 `updateIssue(issueId, { notes })` 送出留言
- [x] 1.3 在 `IssueDetailPage.tsx` 的歷程區塊下方嵌入 NoteForm 元件，送出成功後重新載入 issue 資料

## 2. 引用功能（TDD）

- [x] 2.1 在 NoteForm 測試檔新增引用相關測試案例：接收引用文字後 append 至 textarea（`> ` 前綴格式）、多次引用累加不覆蓋、引用後 textarea focus
- [x] 2.2 在 NoteForm 元件新增 `pendingQuote?: string` prop，透過 `useEffect` 偵測變化後 append 引用內容至 textarea
- [x] 2.3 在 IssueDetailPage 概述區塊新增「引用」按鈕，點擊後設定 `pendingQuote` state
- [x] 2.4 在 JournalSection 每則含筆記的 journal 新增「引用」按鈕，點擊後透過 `onQuote` callback 設定 `pendingQuote` state
- [x] 2.5 引用後自動捲動至 NoteForm 並 focus textarea

## 3. 樣式調整

- [x] 3.1 為 NoteForm 元件新增 CSS 樣式（textarea、送出按鈕、錯誤訊息）
- [x] 3.2 為引用按鈕新增 CSS 樣式，放置於概述和 journal 區塊的適當位置
