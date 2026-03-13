use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

use crate::config;
use crate::redmine::client::RedmineClient;
use crate::redmine::models::{FileMetadata, IdName, Issue, IssueParams, Membership, RelatedIssue, UploadInfo};

fn get_client(app: &AppHandle) -> Result<RedmineClient, String> {
    let cfg = config::load_config(app)?
        .ok_or_else(|| "尚未設定 Redmine 連線".to_string())?;
    Ok(RedmineClient::new(&cfg.url, &cfg.api_key))
}

#[tauri::command]
pub async fn list_my_issues(app: AppHandle, status: String) -> Result<Vec<Issue>, String> {
    let client = get_client(&app)?;
    client
        .list_issues(&[("assigned_to_id", "me"), ("status_id", &status)])
        .await
}

#[tauri::command]
pub async fn list_project_issues(app: AppHandle, project_id: u64, status: String) -> Result<Vec<Issue>, String> {
    let client = get_client(&app)?;
    let id_str = project_id.to_string();
    client
        .list_issues(&[("project_id", &id_str), ("status_id", &status)])
        .await
}

#[tauri::command]
pub async fn search_issues(app: AppHandle, query: String, project_id: Option<u64>) -> Result<Vec<Issue>, String> {
    let client = get_client(&app)?;
    client.search_issues(&query, project_id).await
}

#[tauri::command]
pub async fn list_child_issues(app: AppHandle, issue_id: u64) -> Result<Vec<Issue>, String> {
    let client = get_client(&app)?;
    client.list_child_issues(issue_id).await
}

#[tauri::command]
pub async fn list_related_issues(app: AppHandle, issue_id: u64) -> Result<Vec<RelatedIssue>, String> {
    let client = get_client(&app)?;
    client.list_related_issues(issue_id).await
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

#[tauri::command]
pub async fn upload_attachment(app: AppHandle, file_path: String) -> Result<UploadInfo, String> {
    let client = get_client(&app)?;
    let path = std::path::Path::new(&file_path);

    if !path.exists() {
        return Err(format!("檔案不存在：{}", file_path));
    }

    let filename = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("file")
        .to_string();

    let content_type = mime_guess::from_path(path)
        .first_or_octet_stream()
        .to_string();

    let file_bytes = tokio::fs::read(path)
        .await
        .map_err(|e| format!("讀取檔案失敗：{}", e))?;

    let token = client.upload_file(file_bytes, &filename).await?;

    Ok(UploadInfo {
        token,
        filename,
        content_type,
    })
}

#[tauri::command]
pub async fn get_file_metadata(file_path: String) -> Result<FileMetadata, String> {
    let path = std::path::Path::new(&file_path);

    if !path.exists() {
        return Err(format!("檔案不存在：{}", file_path));
    }

    let metadata = tokio::fs::metadata(path)
        .await
        .map_err(|e| format!("讀取檔案資訊失敗：{}", e))?;

    let name = path
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or("file")
        .to_string();

    Ok(FileMetadata {
        name,
        size: metadata.len(),
        path: file_path,
    })
}

#[tauri::command]
pub async fn download_attachment(app: AppHandle, url: String) -> Result<String, String> {
    let client = get_client(&app)?;
    client.download_attachment_base64(&url).await
}

#[tauri::command]
pub async fn save_attachment(app: AppHandle, url: String, filename: String) -> Result<(), String> {
    use std::path::PathBuf;
    use tokio::sync::oneshot;

    let client = get_client(&app)?;
    let bytes = client.download_attachment_bytes(&url).await?;

    let (tx, rx) = oneshot::channel::<Option<PathBuf>>();

    app.dialog()
        .file()
        .set_file_name(&filename)
        .save_file(move |path| {
            let _ = tx.send(path.map(|p| p.as_path().unwrap().to_path_buf()));
        });

    let save_path = rx.await.map_err(|_| "對話框取消".to_string())?;

    if let Some(path) = save_path {
        std::fs::write(&path, &bytes).map_err(|e| format!("儲存檔案失敗：{}", e))?;
        Ok(())
    } else {
        Ok(()) // user cancelled
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn get_file_metadata_success() {
        let dir = tempfile::tempdir().unwrap();
        let file_path = dir.path().join("test_doc.pdf");
        std::fs::write(&file_path, "hello world 12345").unwrap();

        let result = get_file_metadata(file_path.to_str().unwrap().to_string())
            .await
            .unwrap();

        assert_eq!(result.name, "test_doc.pdf");
        assert_eq!(result.size, 17);
        assert_eq!(result.path, file_path.to_str().unwrap());
    }

    #[tokio::test]
    async fn get_file_metadata_not_found() {
        let result = get_file_metadata("/nonexistent/file.txt".to_string()).await;
        assert!(result.is_err());
        assert!(result.unwrap_err().contains("檔案不存在"));
    }
}
