use tauri::AppHandle;

use crate::config;
use crate::redmine::client::RedmineClient;
use crate::redmine::models::{IdName, Issue, IssueParams, Membership};

fn get_client(app: &AppHandle) -> Result<RedmineClient, String> {
    let cfg = config::load_config(app)?
        .ok_or_else(|| "尚未設定 Redmine 連線".to_string())?;
    Ok(RedmineClient::new(&cfg.url, &cfg.api_key))
}

#[tauri::command]
pub async fn list_my_issues(app: AppHandle) -> Result<Vec<Issue>, String> {
    let client = get_client(&app)?;
    client
        .list_issues(&[("assigned_to_id", "me"), ("status_id", "open")])
        .await
}

#[tauri::command]
pub async fn list_project_issues(app: AppHandle, project_id: u64) -> Result<Vec<Issue>, String> {
    let client = get_client(&app)?;
    let id_str = project_id.to_string();
    client
        .list_issues(&[("project_id", &id_str)])
        .await
}

#[tauri::command]
pub async fn get_issue(app: AppHandle, issue_id: u64) -> Result<Issue, String> {
    let client = get_client(&app)?;
    client.get_issue(issue_id).await
}

#[tauri::command]
pub async fn create_issue(
    app: AppHandle,
    project_id: u64,
    params: IssueParams,
) -> Result<Issue, String> {
    let client = get_client(&app)?;
    let mut p = params;
    p.project_id = Some(project_id);
    client.create_issue(p).await
}

#[tauri::command]
pub async fn update_issue(
    app: AppHandle,
    issue_id: u64,
    params: IssueParams,
) -> Result<(), String> {
    let client = get_client(&app)?;
    client.update_issue(issue_id, params).await
}

#[tauri::command]
pub async fn list_trackers(app: AppHandle) -> Result<Vec<IdName>, String> {
    let client = get_client(&app)?;
    client.list_trackers().await
}

#[tauri::command]
pub async fn list_statuses(app: AppHandle) -> Result<Vec<IdName>, String> {
    let client = get_client(&app)?;
    client.list_statuses().await
}

#[tauri::command]
pub async fn list_priorities(app: AppHandle) -> Result<Vec<IdName>, String> {
    let client = get_client(&app)?;
    client.list_priorities().await
}

#[tauri::command]
pub async fn list_memberships(
    app: AppHandle,
    project_id: u64,
) -> Result<Vec<Membership>, String> {
    let client = get_client(&app)?;
    client.list_memberships(project_id).await
}
