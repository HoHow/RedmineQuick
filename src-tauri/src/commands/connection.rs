use tauri::AppHandle;

use crate::config::{self, RedmineConfig};
use crate::redmine::client::RedmineClient;
use crate::redmine::models::User;

#[tauri::command]
pub async fn test_connection(url: String, api_key: String) -> Result<User, String> {
    let client = RedmineClient::new(&url, &api_key);
    client.get_current_user().await
}

#[tauri::command]
pub async fn save_config(app: AppHandle, url: String, api_key: String) -> Result<(), String> {
    let cfg = RedmineConfig { url, api_key };
    config::save_config(&app, &cfg)
}

#[tauri::command]
pub async fn load_config(app: AppHandle) -> Result<Option<RedmineConfig>, String> {
    config::load_config(&app)
}
