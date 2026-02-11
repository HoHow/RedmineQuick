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
