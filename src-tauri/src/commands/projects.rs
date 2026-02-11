use tauri::AppHandle;

use crate::config;
use crate::redmine::client::RedmineClient;
use crate::redmine::models::Project;

#[tauri::command]
pub async fn list_projects(app: AppHandle) -> Result<Vec<Project>, String> {
    let cfg = config::load_config(&app)?
        .ok_or_else(|| "尚未設定 Redmine 連線".to_string())?;
    let client = RedmineClient::new(&cfg.url, &cfg.api_key);
    client.list_projects().await
}
