use tauri::AppHandle;

use crate::config;
use crate::redmine::client::RedmineClient;
use crate::redmine::models::{IdName, TimeEntryParams};

fn get_client(app: &AppHandle) -> Result<RedmineClient, String> {
    let cfg = config::load_config(app)?
        .ok_or_else(|| "尚未設定 Redmine 連線".to_string())?;
    Ok(RedmineClient::new(&cfg.url, &cfg.api_key))
}

#[tauri::command]
pub async fn create_time_entry(app: AppHandle, params: TimeEntryParams) -> Result<(), String> {
    let client = get_client(&app)?;
    client.create_time_entry(params).await
}

#[tauri::command]
pub async fn list_activities(app: AppHandle) -> Result<Vec<IdName>, String> {
    let client = get_client(&app)?;
    client.list_activities().await
}
