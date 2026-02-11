## Context

Initial MVP 已完成，但實際測試時發現多個阻斷性問題：Redmine API 認證失敗時錯誤訊息不明確、JSON 序列化欄位名稱不匹配導致所有 API 回應解析失敗、建立 Issue 表單的預設值不符合使用者習慣。這些問題需要在 MVP 基礎上修正。

## Goals / Non-Goals

**Goals:**
- 修正 API 認證錯誤處理，讓使用者看到明確的認證失敗訊息
- 修正前後端 JSON 欄位名稱不匹配問題，確保所有 API 呼叫正常運作
- 優化建立 Issue 表單預設值，減少手動操作
- 新增常用 Redmine URL 下拉選項

**Non-Goals:**
- 不新增功能頁面或 API 端點
- 不重構既有架構

## Decisions

### 1. 停用 reqwest 自動 redirect，改用手動檢查

**選擇**：`Client::builder().redirect(Policy::none())` + `check_response()` 輔助函式

**理由**：Redmine 對無效 API Key 回傳 302 redirect 到登入頁面，reqwest 預設跟隨 redirect 後拿到 HTML 回應，導致 JSON 解析失敗而非顯示認證錯誤。停用自動 redirect 後可以直接偵測 302/401 狀態碼並回傳明確的錯誤訊息。

**替代方案**：使用自訂 redirect policy 只攔截特定 URL — 過於複雜，且 Redmine API 不應有合法 redirect。

### 2. 移除 serde `rename_all = "camelCase"`，統一使用 snake_case

**選擇**：移除 Rust models 的 `camelCase`，讓欄位名直接對應 Redmine API 的 snake_case，前端 TypeScript 型別同步改為 snake_case。

**理由**：Redmine REST API 回傳 snake_case 欄位（`assigned_to`、`start_date` 等），加上 `camelCase` 導致 serde 找不到對應欄位。統一使用 snake_case 是最直接的修正方式。

**替代方案**：在每個欄位加 `#[serde(rename = "...")]` — 維護成本高，容易遺漏。

### 3. 表單預設值使用名稱匹配

**選擇**：從 API 回傳的選項列表中用 `name` 匹配（如「工作」、「正常」），找不到則 fallback 到第一個選項。

**理由**：Redmine 不同實例的 ID 可能不同，但名稱通常一致。用名稱匹配最具可攜性。

### 4. URL 輸入使用 HTML datalist

**選擇**：使用 `<input list="...">` + `<datalist>` 提供下拉建議同時保留自由輸入。

**理由**：比 select + 自訂輸入 的實作更簡單，原生瀏覽器支援，不需額外元件。

## Risks / Trade-offs

- **停用 redirect 可能影響特定 Redmine 配置**：某些 Redmine 可能在正常流程中使用 redirect（如 HTTP → HTTPS）→ 使用者需直接輸入正確的 HTTPS URL。
- **前端 snake_case 欄位名不符合 JS 慣例** → 為了與 Rust/Redmine 一致而犧牲，降低轉換層複雜度。
- **名稱匹配預設值依賴中文名稱** → 如果 Redmine 使用其他語言，預設值會 fallback 到第一個選項，不會出錯但體驗稍差。
