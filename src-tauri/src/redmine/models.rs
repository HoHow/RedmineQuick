use serde::{Deserialize, Serialize};

// Common nested reference (e.g. tracker, status, priority, author, project)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdName {
    pub id: u64,
    pub name: String,
}

// GET /users/current.json
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CurrentUserResponse {
    pub user: User,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u64,
    pub login: String,
    pub firstname: String,
    pub lastname: String,
    pub mail: Option<String>,
}

// GET /projects.json
#[derive(Debug, Clone, Deserialize)]
pub struct ProjectsResponse {
    pub projects: Vec<Project>,
    pub total_count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub id: u64,
    pub name: String,
    pub identifier: String,
    pub description: Option<String>,
}

// GET /issues.json, GET /issues/<id>.json
#[derive(Debug, Clone, Deserialize)]
pub struct IssuesResponse {
    pub issues: Vec<Issue>,
    pub total_count: u64,
}

#[derive(Debug, Clone, Deserialize)]
pub struct IssueResponse {
    pub issue: Issue,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Issue {
    pub id: u64,
    pub subject: String,
    pub description: Option<String>,
    pub project: IdName,
    pub tracker: IdName,
    pub status: IdName,
    pub priority: IdName,
    pub author: IdName,
    pub assigned_to: Option<IdName>,
    pub parent: Option<IssueParent>,
    pub start_date: Option<String>,
    pub due_date: Option<String>,
    pub estimated_hours: Option<f64>,
    pub done_ratio: u32,
    pub watchers: Option<Vec<IdName>>,
    pub journals: Option<Vec<Journal>>,
    pub attachments: Option<Vec<Attachment>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IssueParent {
    pub id: u64,
}

// Journal (issue history)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JournalDetail {
    pub property: String,
    pub name: String,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Journal {
    pub id: u64,
    pub user: IdName,
    pub notes: Option<String>,
    pub created_on: String,
    pub details: Vec<JournalDetail>,
}

// Attachment
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attachment {
    pub id: u64,
    pub filename: String,
    pub filesize: u64,
    pub content_type: String,
    pub content_url: String,
    pub author: IdName,
    pub created_on: String,
}

// POST /issues.json, PUT /issues/<id>.json
#[derive(Debug, Clone, Serialize)]
pub struct IssuePayload {
    pub issue: IssueParams,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct IssueParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub project_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tracker_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subject: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub assigned_to_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub parent_issue_id: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub due_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub estimated_hours: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub done_ratio: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub watcher_user_ids: Option<Vec<u64>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uploads: Option<Vec<UploadInfo>>,
}

// POST /uploads.json response
#[derive(Debug, Clone, Deserialize)]
pub struct UploadResponse {
    pub upload: UploadToken,
}

#[derive(Debug, Clone, Deserialize)]
pub struct UploadToken {
    pub token: String,
}

// Attachment upload info for issue create/update payload
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UploadInfo {
    pub token: String,
    pub filename: String,
    pub content_type: String,
}

// File metadata for pending upload display
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileMetadata {
    pub name: String,
    pub size: u64,
    pub path: String,
}

// POST /time_entries.json
#[derive(Debug, Clone, Serialize)]
pub struct TimeEntryPayload {
    pub time_entry: TimeEntryParams,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct TimeEntryParams {
    pub issue_id: u64,
    pub hours: f64,
    pub activity_id: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub comments: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub spent_on: Option<String>,
}

// GET /trackers.json
#[derive(Debug, Clone, Deserialize)]
pub struct TrackersResponse {
    pub trackers: Vec<IdName>,
}

// GET /issue_statuses.json
#[derive(Debug, Clone, Deserialize)]
pub struct StatusesResponse {
    pub issue_statuses: Vec<IdName>,
}

// GET /issue_priorities.json (under enumerations)
#[derive(Debug, Clone, Deserialize)]
pub struct PrioritiesResponse {
    pub issue_priorities: Vec<IdName>,
}

// GET /enumerations/time_entry_activities.json
#[derive(Debug, Clone, Deserialize)]
pub struct ActivitiesResponse {
    pub time_entry_activities: Vec<IdName>,
}

// GET /projects/<id>/memberships.json
#[derive(Debug, Clone, Deserialize)]
pub struct MembershipsResponse {
    pub memberships: Vec<Membership>,
    pub total_count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Membership {
    pub id: u64,
    pub user: Option<IdName>,
    pub roles: Vec<IdName>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn upload_response_deserialize() {
        let json = r#"{"upload":{"token":"abc123.def456"}}"#;
        let resp: UploadResponse = serde_json::from_str(json).unwrap();
        assert_eq!(resp.upload.token, "abc123.def456");
    }

    #[test]
    fn upload_info_serialize() {
        let info = UploadInfo {
            token: "abc123".to_string(),
            filename: "test.png".to_string(),
            content_type: "image/png".to_string(),
        };
        let json = serde_json::to_value(&info).unwrap();
        assert_eq!(json["token"], "abc123");
        assert_eq!(json["filename"], "test.png");
        assert_eq!(json["content_type"], "image/png");
    }

    #[test]
    fn issue_params_with_uploads_serialize() {
        let params = IssueParams {
            project_id: Some(1),
            tracker_id: None,
            subject: Some("test".to_string()),
            description: None,
            status_id: None,
            priority_id: None,
            assigned_to_id: None,
            parent_issue_id: None,
            start_date: None,
            due_date: None,
            estimated_hours: None,
            done_ratio: None,
            watcher_user_ids: None,
            notes: None,
            uploads: Some(vec![UploadInfo {
                token: "tok1".to_string(),
                filename: "doc.pdf".to_string(),
                content_type: "application/pdf".to_string(),
            }]),
        };
        let json = serde_json::to_value(&params).unwrap();
        assert_eq!(json["project_id"], 1);
        assert_eq!(json["subject"], "test");
        let uploads = json["uploads"].as_array().unwrap();
        assert_eq!(uploads.len(), 1);
        assert_eq!(uploads[0]["token"], "tok1");
        assert_eq!(uploads[0]["filename"], "doc.pdf");
    }

    #[test]
    fn issue_params_without_uploads_omits_field() {
        let params = IssueParams {
            project_id: Some(1),
            tracker_id: None,
            subject: Some("test".to_string()),
            description: None,
            status_id: None,
            priority_id: None,
            assigned_to_id: None,
            parent_issue_id: None,
            start_date: None,
            due_date: None,
            estimated_hours: None,
            done_ratio: None,
            watcher_user_ids: None,
            notes: None,
            uploads: None,
        };
        let json = serde_json::to_value(&params).unwrap();
        assert!(json.get("uploads").is_none());
    }

    #[test]
    fn file_metadata_serialize() {
        let meta = FileMetadata {
            name: "photo.jpg".to_string(),
            size: 1024,
            path: "/tmp/photo.jpg".to_string(),
        };
        let json = serde_json::to_value(&meta).unwrap();
        assert_eq!(json["name"], "photo.jpg");
        assert_eq!(json["size"], 1024);
        assert_eq!(json["path"], "/tmp/photo.jpg");
    }
}
