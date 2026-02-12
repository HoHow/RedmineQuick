use std::collections::HashSet;
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

pub fn start_polling(app_handle: AppHandle) {
    tokio::spawn(async move {
        let mut known_ids: HashSet<u64> = HashSet::new();
        let mut is_first_run = true;

        loop {
            // 讀取 config
            let config = config::load_config(&app_handle);
            if let Ok(Some(cfg)) = config {
                let client = RedmineClient::new(&cfg.url, &cfg.api_key);
                let params = [
                    ("assigned_to_id", "me"),
                    ("status_id", "open"),
                    ("sort", "created_on:desc"),
                    ("limit", "25"),
                ];

                match client.list_issues(&params).await {
                    Ok(issues) => {
                        let current_ids: HashSet<u64> =
                            issues.iter().map(|i| i.id).collect();

                        if is_first_run {
                            // 首次建立 baseline，不通知
                            known_ids = current_ids;
                            is_first_run = false;
                        } else {
                            // 找出新 Issue
                            for issue in &issues {
                                if !known_ids.contains(&issue.id) {
                                    let event = NewIssueEvent {
                                        issue_id: issue.id,
                                        subject: issue.subject.clone(),
                                        project_name: issue.project.name.clone(),
                                    };

                                    // emit 事件到前端
                                    let _ = app_handle.emit("new-issue", &event);

                                    // 發送 OS 原生通知
                                    let body = format!(
                                        "#{} {}",
                                        issue.id, issue.subject
                                    );
                                    let _ = app_handle
                                        .notification()
                                        .builder()
                                        .title("新 Issue")
                                        .body(&body)
                                        .extra("issueId", issue.id)
                                        .show();

                                    // 顯示視窗（如果隱藏中）
                                    if let Some(window) = app_handle.get_webview_window("main") {
                                        let _ = window.show();
                                    }
                                }
                            }
                            known_ids = current_ids;
                        }
                    }
                    Err(_) => {
                        // 靜默忽略錯誤，等待下一次 polling
                    }
                }
            }

            tokio::time::sleep(Duration::from_secs(POLL_INTERVAL_SECS)).await;
        }
    });
}
