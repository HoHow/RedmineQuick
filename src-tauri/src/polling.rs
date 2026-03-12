use std::collections::HashMap;
use std::time::Duration;

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_notification::NotificationExt;

use crate::config;
use crate::redmine::client::RedmineClient;

const POLL_INTERVAL_SECS: u64 = 120; // 2 分鐘

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewIssueEvent {
    pub issue_id: u64,
    pub subject: String,
    pub project_name: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NewCommentEvent {
    pub issue_id: u64,
    pub subject: String,
    pub project_name: String,
    pub author_name: String,
}

pub fn start_polling(app_handle: AppHandle) {
    tauri::async_runtime::spawn(async move {
        // ID → updated_on
        let mut known_issues: HashMap<u64, String> = HashMap::new();
        let mut is_first_run = true;
        let mut current_user_id: Option<u64> = None;

        loop {
            let config = config::load_config(&app_handle);
            if let Ok(Some(cfg)) = config {
                let client = RedmineClient::new(&cfg.url, &cfg.api_key);

                // Get current user ID on first successful run
                if current_user_id.is_none() {
                    if let Ok(user) = client.get_current_user().await {
                        current_user_id = Some(user.id);
                    }
                }

                let params = [
                    ("assigned_to_id", "me"),
                    ("status_id", "open"),
                    ("sort", "created_on:desc"),
                    ("limit", "25"),
                ];

                match client.list_issues(&params).await {
                    Ok(issues) => {
                        if is_first_run {
                            // Build baseline, no notifications
                            for issue in &issues {
                                let updated = issue.updated_on.clone().unwrap_or_default();
                                known_issues.insert(issue.id, updated);
                            }
                            is_first_run = false;
                        } else {
                            for issue in &issues {
                                let updated = issue.updated_on.clone().unwrap_or_default();

                                if let Some(prev_updated) = known_issues.get(&issue.id) {
                                    // Existing issue — check if updated_on changed
                                    if *prev_updated != updated {
                                        check_new_comment(
                                            &client,
                                            &app_handle,
                                            issue.id,
                                            &issue.subject,
                                            &issue.project.name,
                                            current_user_id,
                                        )
                                        .await;
                                    }
                                } else {
                                    // New issue
                                    let event = NewIssueEvent {
                                        issue_id: issue.id,
                                        subject: issue.subject.clone(),
                                        project_name: issue.project.name.clone(),
                                    };

                                    let _ = app_handle.emit("new-issue", &event);

                                    let body =
                                        format!("#{} {}", issue.id, issue.subject);
                                    send_notification(&app_handle, "新 Issue", &body, issue.id);
                                }
                            }

                            // Rebuild known_issues with current data
                            known_issues.clear();
                            for issue in &issues {
                                let updated = issue.updated_on.clone().unwrap_or_default();
                                known_issues.insert(issue.id, updated);
                            }
                        }
                    }
                    Err(_) => {
                        // Silently ignore errors, wait for next poll
                    }
                }
            }

            tokio::time::sleep(Duration::from_secs(POLL_INTERVAL_SECS)).await;
        }
    });
}

async fn check_new_comment(
    client: &RedmineClient,
    app_handle: &AppHandle,
    issue_id: u64,
    subject: &str,
    project_name: &str,
    current_user_id: Option<u64>,
) {
    let Ok(full_issue) = client.get_issue_journals(issue_id).await else {
        return;
    };

    let Some(journals) = &full_issue.journals else {
        return;
    };

    // Find the latest journal with notes (comment)
    let latest_comment = journals
        .iter()
        .rev()
        .find(|j| j.notes.as_ref().is_some_and(|n| !n.is_empty()));

    let Some(comment) = latest_comment else {
        return;
    };

    // Skip if the comment author is the current user
    if let Some(uid) = current_user_id {
        if comment.user.id == uid {
            return;
        }
    }

    let event = NewCommentEvent {
        issue_id,
        subject: subject.to_string(),
        project_name: project_name.to_string(),
        author_name: comment.user.name.clone(),
    };

    let _ = app_handle.emit("new-comment", &event);

    let body = format!(
        "{} 在 #{} {}",
        comment.user.name, issue_id, subject
    );
    send_notification(app_handle, "新留言", &body, issue_id);
}

fn send_notification(app_handle: &AppHandle, title: &str, body: &str, issue_id: u64) {
    let _ = app_handle
        .notification()
        .builder()
        .title(title)
        .body(body)
        .extra("issueId", issue_id)
        .show();

    if let Some(window) = app_handle.get_webview_window("main") {
        let _ = window.show();
    }
}
