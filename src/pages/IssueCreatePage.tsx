import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { createIssue, uploadAttachment, type IssueParams, type UploadInfo } from "../lib/api";
import IssueForm, { type PendingFile } from "../components/IssueForm";

function IssueCreatePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  if (!projectId) {
    return <div className="error-message">缺少專案 ID</div>;
  }

  const pid = Number(projectId);

  async function uploadFiles(files: PendingFile[]): Promise<UploadInfo[]> {
    const uploads: UploadInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadStatus(`上傳中 (${i + 1}/${files.length})...`);
      const info = await uploadAttachment(files[i].path);
      uploads.push(info);
    }
    setUploadStatus(null);
    return uploads;
  }

  async function handleSubmit(params: IssueParams, files: PendingFile[]) {
    if (files.length > 0) {
      params.uploads = await uploadFiles(files);
    }
    await createIssue(pid, params);
    navigate(`/projects/${projectId}/issues`);
  }

  async function handleSubmitContinue(params: IssueParams, files: PendingFile[]) {
    if (files.length > 0) {
      params.uploads = await uploadFiles(files);
    }
    const issue = await createIssue(pid, params);
    setSuccessMsg(`Issue #${issue.id} 已建立`);
    setTimeout(() => setSuccessMsg(null), 3000);
  }

  return (
    <div className="issue-create-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(`/projects/${projectId}/issues`)}>
          ← 返回
        </button>
        <h2>新增 Issue</h2>
      </div>
      {successMsg && <div className="success-message">{successMsg}</div>}
      {uploadStatus && <div className="loading">{uploadStatus}</div>}
      <IssueForm
        projectId={pid}
        onSubmit={handleSubmit}
        onSubmitContinue={handleSubmitContinue}
        onCancel={() => navigate(`/projects/${projectId}/issues`)}
        submitLabel="建立"
      />
    </div>
  );
}

export default IssueCreatePage;
