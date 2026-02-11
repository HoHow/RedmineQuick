import { useParams, useNavigate } from "react-router";
import { createIssue, type IssueParams } from "../lib/api";
import IssueForm from "../components/IssueForm";

function IssueCreatePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  if (!projectId) {
    return <div className="error-message">缺少專案 ID</div>;
  }

  const pid = Number(projectId);

  async function handleSubmit(params: IssueParams) {
    const issue = await createIssue(pid, params);
    navigate(`/issues/${issue.id}`);
  }

  return (
    <div className="issue-create-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h2>新增 Issue</h2>
      </div>
      <IssueForm
        projectId={pid}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel="建立"
      />
    </div>
  );
}

export default IssueCreatePage;
