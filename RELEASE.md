# 發佈流程

## 版本號規則 (Semantic Versioning)

格式：`MAJOR.MINOR.PATCH`（例如 `0.2.1`）

| 版本位 | 何時推進 | 範例 |
|--------|---------|------|
| PATCH | 修 bug、小修正 | `0.1.0` → `0.1.1` |
| MINOR | 新增功能 | `0.1.0` → `0.2.0` |
| MAJOR | 破壞性變更 | `0.2.0` → `1.0.0` |

> 在 `1.0.0` 之前屬於開發期，規則較寬鬆。

## 需要更新版號的檔案

1. `package.json` — `"version": "0.1.0"`
2. `src-tauri/tauri.conf.json` — `"version": "0.1.0"`
3. `src-tauri/Cargo.toml` — `version = "0.1.0"`

三個檔案的版號需保持一致。

## 發佈步驟

```bash
# 1. 更新上述三個檔案的版號

# 2. Commit
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "chore: bump version to 0.2.0"

# 3. 打 tag
git tag v0.2.0

# 4. Push 到 GitHub（含 tag）
git push origin main --tags
```

Push tag 後 GitHub Actions 會自動 build：

| 平台 | 產出 |
|------|------|
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Windows | `.msi` / `.exe` |

Build 完成後會建立 **Draft Release**，到 GitHub Releases 頁面確認內容後發佈。

## 本機 Build（僅限當前平台）

```bash
npm run tauri build
```

產出位置：`src-tauri/target/release/bundle/`
