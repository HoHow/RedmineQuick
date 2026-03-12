use base64::Engine;
use reqwest::redirect::Policy;
use reqwest::Client;
use serde::de::DeserializeOwned;
use serde::Serialize;

use super::models::*;

pub struct RedmineClient {
    base_url: String,
    api_key: String,
    http: Client,
}

fn check_response(response: &reqwest::Response) -> Result<(), String> {
    let status = response.status();
    if status.as_u16() == 401 {
        return Err("認證失敗：API Key 無效或已過期".to_string());
    }
    if status.is_redirection() {
        return Err("認證失敗：伺服器重新導向，請確認 API Key 是否正確".to_string());
    }
    if status.is_success() {
        let content_type = response
            .headers()
            .get("content-type")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        if !content_type.contains("json") {
            return Err("認證失敗：伺服器回傳非 JSON 回應，請確認 URL 與 API Key 是否正確".to_string());
        }
    }
    Ok(())
}

impl RedmineClient {
    pub fn new(base_url: &str, api_key: &str) -> Self {
        let base_url = base_url.trim_end_matches('/').to_string();
        let http = Client::builder()
            .redirect(Policy::none())
            .build()
            .expect("failed to build HTTP client");
        Self {
            base_url,
            api_key: api_key.to_string(),
            http,
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

        check_response(&response)?;

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

        check_response(&response)?;

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

        check_response(&response)?;

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

        check_response(&response)?;

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

    pub async fn list_child_issues(&self, parent_id: u64) -> Result<Vec<Issue>, String> {
        let id_str = parent_id.to_string();
        self.list_issues(&[("parent_id", &id_str)]).await
    }

    pub async fn search_issues(
        &self,
        query: &str,
        project_id: Option<u64>,
    ) -> Result<Vec<Issue>, String> {
        let mut params: Vec<(&str, String)> = vec![
            ("subject", format!("~{}", query)),
            ("limit", "10".to_string()),
        ];
        if let Some(pid) = project_id {
            params.push(("project_id", pid.to_string()));
        }
        let param_refs: Vec<(&str, &str)> = params.iter().map(|(k, v)| (*k, v.as_str())).collect();
        let resp: IssuesResponse = self.get_with_params("/issues.json", &param_refs).await?;
        Ok(resp.issues)
    }

    pub async fn get_issue(&self, id: u64) -> Result<Issue, String> {
        let path = format!("/issues/{}.json?include=watchers,journals,attachments", id);
        let resp: IssueResponse = self.get(&path).await?;
        Ok(resp.issue)
    }

    pub async fn get_issue_journals(&self, id: u64) -> Result<Issue, String> {
        let path = format!("/issues/{}.json?include=journals", id);
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

        check_response(&response)?;

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

    pub async fn upload_file(&self, file_bytes: Vec<u8>, filename: &str) -> Result<String, String> {
        let url = format!("{}/uploads.json?filename={}", self.base_url, filename);
        let response = self
            .http
            .post(&url)
            .header("X-Redmine-API-Key", &self.api_key)
            .header("Content-Type", "application/octet-stream")
            .body(file_bytes)
            .send()
            .await
            .map_err(|e| format!("上傳檔案失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            let body = response.text().await.unwrap_or_default();
            return Err(format!("上傳檔案失敗 ({}): {}", status, body));
        }

        let upload_resp: UploadResponse = response
            .json()
            .await
            .map_err(|e| format!("解析上傳回應失敗：{}", e))?;

        Ok(upload_resp.upload.token)
    }

    pub async fn download_attachment_base64(&self, url: &str) -> Result<String, String> {
        let response = self
            .http
            .get(url)
            .header("X-Redmine-API-Key", &self.api_key)
            .send()
            .await
            .map_err(|e| format!("下載附件失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            return Err(format!("下載附件失敗 ({})", status));
        }

        let bytes = response
            .bytes()
            .await
            .map_err(|e| format!("讀取附件內容失敗：{}", e))?;

        Ok(base64::engine::general_purpose::STANDARD.encode(&bytes))
    }

    pub async fn download_attachment_bytes(&self, url: &str) -> Result<Vec<u8>, String> {
        let response = self
            .http
            .get(url)
            .header("X-Redmine-API-Key", &self.api_key)
            .send()
            .await
            .map_err(|e| format!("下載附件失敗：{}", e))?;

        if !response.status().is_success() {
            let status = response.status().as_u16();
            return Err(format!("下載附件失敗 ({})", status));
        }

        response
            .bytes()
            .await
            .map(|b| b.to_vec())
            .map_err(|e| format!("讀取附件內容失敗：{}", e))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn upload_file_success() {
        let mut server = mockito::Server::new_async().await;
        let mock = server
            .mock("POST", "/uploads.json?filename=test.txt")
            .match_header("Content-Type", "application/octet-stream")
            .match_header("X-Redmine-API-Key", "test-key")
            .match_body("hello world")
            .with_status(201)
            .with_header("Content-Type", "application/json")
            .with_body(r#"{"upload":{"token":"abc123.456"}}"#)
            .create_async()
            .await;

        let client = RedmineClient::new(&server.url(), "test-key");
        let token = client
            .upload_file(b"hello world".to_vec(), "test.txt")
            .await
            .unwrap();

        assert_eq!(token, "abc123.456");
        mock.assert_async().await;
    }

    #[tokio::test]
    async fn upload_file_server_error() {
        let mut server = mockito::Server::new_async().await;
        server
            .mock("POST", "/uploads.json?filename=big.bin")
            .with_status(413)
            .with_body("File too large")
            .create_async()
            .await;

        let client = RedmineClient::new(&server.url(), "test-key");
        let result = client
            .upload_file(vec![0u8; 100], "big.bin")
            .await;

        assert!(result.is_err());
        assert!(result.unwrap_err().contains("413"));
    }
}
