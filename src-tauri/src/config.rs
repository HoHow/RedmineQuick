use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

const STORE_FILENAME: &str = "config.json";
const CONFIG_KEY: &str = "redmine_config";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RedmineConfig {
    pub url: String,
    pub api_key: String,
}

pub fn load_config(app: &AppHandle) -> Result<Option<RedmineConfig>, String> {
    let store = app
        .store(STORE_FILENAME)
        .map_err(|e| format!("無法開啟設定檔：{}", e))?;

    let value = store.get(CONFIG_KEY);
    match value {
        Some(v) => {
            let config: RedmineConfig =
                serde_json::from_value(v).map_err(|e| format!("設定檔格式錯誤：{}", e))?;
            Ok(Some(config))
        }
        None => Ok(None),
    }
}

pub fn save_config(app: &AppHandle, config: &RedmineConfig) -> Result<(), String> {
    let store = app
        .store(STORE_FILENAME)
        .map_err(|e| format!("無法開啟設定檔：{}", e))?;

    let value =
        serde_json::to_value(config).map_err(|e| format!("序列化設定失敗：{}", e))?;
    store.set(CONFIG_KEY, value);
    store
        .save()
        .map_err(|e| format!("儲存設定失敗：{}", e))?;

    Ok(())
}
