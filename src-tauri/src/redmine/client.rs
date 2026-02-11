use reqwest::Client;
use serde::de::DeserializeOwned;
use serde::Serialize;

use super::models::*;

pub struct RedmineClient {
    base_url: String,
    api_key: String,
    http: Client,
}

impl RedmineClient {
    pub fn new(base_url: &str, api_key: &str) -> Self {
        let base_url = base_url.trim_end_matches('/').to_string();
        Self {
            base_url,
            api_key: api_key.to_string(),
            http: Client::new(),
        }
    }

    pub async fn get<T: DeserializeOwned>(&self, path: &str) -> Result<T, String> {
        let url = format!("{}{}", self.base_url, path);
        let response = self
            .http
            .get(&url)
            .header("X-Redmine-API-Key", &self.api_key)
            .header("Content-Type", "application/json")
            .send()
            .await
            .map_err(|e| format!("連線失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("API 錯誤 ({}): {}", status, body));
        }

        response
            .json::<T>()
            .await
            .map_err(|e| format!("解析回應失敗：{}", e))
    }

    pub async fn get_with_params<T: DeserializeOwned>(
        &self,
        path: &str,
        params: &[(&str, &str)],
    ) -> Result<T, String> {
        let url = format!("{}{}", self.base_url, path);
        let response = self
            .http
            .get(&url)
            .header("X-Redmine-API-Key", &self.api_key)
            .header("Content-Type", "application/json")
            .query(params)
            .send()
            .await
            .map_err(|e| format!("連線失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("API 錯誤 ({}): {}", status, body));
        }

        response
            .json::<T>()
            .await
            .map_err(|e| format!("解析回應失敗：{}", e))
    }

    pub async fn post<B: Serialize, T: DeserializeOwned>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T, String> {
        let url = format!("{}{}", self.base_url, path);
        let response = self
            .http
            .post(&url)
            .header("X-Redmine-API-Key", &self.api_key)
            .header("Content-Type", "application/json")
            .json(body)
            .send()
            .await
            .map_err(|e| format!("連線失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("API 錯誤 ({}): {}", status, body));
        }

        response
            .json::<T>()
            .await
            .map_err(|e| format!("解析回應失敗：{}", e))
    }

    pub async fn put<B: Serialize>(&self, path: &str, body: &B) -> Result<(), String> {
        let url = format!("{}{}", self.base_url, path);
        let response = self
            .http
            .put(&url)
            .header("X-Redmine-API-Key", &self.api_key)
            .header("Content-Type", "application/json")
            .json(body)
            .send()
            .await
            .map_err(|e| format!("連線失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("API 錯誤 ({}): {}", status, body));
        }

        Ok(())
    }

    // 2.3: get_current_user
    pub async fn get_current_user(&self) -> Result<User, String> {
        let resp: CurrentUserResponse = self.get("/users/current.json").await?;
        Ok(resp.user)
    }

    // 2.4: list_projects
    pub async fn list_projects(&self) -> Result<Vec<Project>, String> {
        let resp: ProjectsResponse = self
            .get_with_params("/projects.json", &[("limit", "100")])
            .await?;
        Ok(resp.projects)
    }

    // 2.5: issue methods
    pub async fn list_issues(
        &self,
        params: &[(&str, &str)],
    ) -> Result<Vec<Issue>, String> {
        let mut all_params = params.to_vec();
        all_params.push(("limit", "100"));
        let resp: IssuesResponse = self
            .get_with_params("/issues.json", &all_params)
            .await?;
        Ok(resp.issues)
    }

    pub async fn get_issue(&self, id: u64) -> Result<Issue, String> {
        let path = format!("/issues/{}.json?include=watchers", id);
        let resp: IssueResponse = self.get(&path).await?;
        Ok(resp.issue)
    }

    pub async fn create_issue(&self, params: IssueParams) -> Result<Issue, String> {
        let payload = IssuePayload { issue: params };
        let resp: IssueResponse = self.post("/issues.json", &payload).await?;
        Ok(resp.issue)
    }

    pub async fn update_issue(&self, id: u64, params: IssueParams) -> Result<(), String> {
        let payload = IssuePayload { issue: params };
        let path = format!("/issues/{}.json", id);
        self.put(&path, &payload).await
    }

    // 2.6: create_time_entry
    pub async fn create_time_entry(&self, params: TimeEntryParams) -> Result<(), String> {
        let payload = TimeEntryPayload { time_entry: params };
        let url = format!("{}/time_entries.json", self.base_url);
        let response = self
            .http
            .post(&url)
            .header("X-Redmine-API-Key", &self.api_key)
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await
            .map_err(|e| format!("連線失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("API 錯誤 ({}): {}", status, body));
        }

        Ok(())
    }

    // 2.7: enumeration and membership methods
    pub async fn list_trackers(&self) -> Result<Vec<IdName>, String> {
        let resp: TrackersResponse = self.get("/trackers.json").await?;
        Ok(resp.trackers)
    }

    pub async fn list_statuses(&self) -> Result<Vec<IdName>, String> {
        let resp: StatusesResponse = self.get("/issue_statuses.json").await?;
        Ok(resp.issue_statuses)
    }

    pub async fn list_priorities(&self) -> Result<Vec<IdName>, String> {
        let resp: PrioritiesResponse = self
            .get("/enumerations/issue_priorities.json")
            .await?;
        Ok(resp.issue_priorities)
    }

    pub async fn list_activities(&self) -> Result<Vec<IdName>, String> {
        let resp: ActivitiesResponse = self
            .get("/enumerations/time_entry_activities.json")
            .await?;
        Ok(resp.time_entry_activities)
    }

    pub async fn list_memberships(&self, project_id: u64) -> Result<Vec<Membership>, String> {
        let path = format!("/projects/{}/memberships.json?limit=100", project_id);
        let resp: MembershipsResponse = self.get(&path).await?;
        Ok(resp.memberships)
    }
}
