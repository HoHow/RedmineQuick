import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getIssue, updateIssue, listStatuses, type Issue, type IdName, type IssueParams } from "../lib/api";
import IssueForm from "../components/IssueForm";

function IssueDetailPage() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [statuses, setStatuses] = useState<IdName[]>([]);

  async function fetchIssue() {
    if (!issueId) return;
    try {
      const [data, statusList] = await Promise.all([
        getIssue(Number(issueId)),
        listStatuses(),
      ]);
      setIssue(data);
      setStatuses(statusList);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssue();
  }, [issueId]);

  async function handleQuickStatusChange(statusId: number) {
    if (!issueId) return;
    try {
      await updateIssue(Number(issueId), { statusId } as IssueParams);
      await fetchIssue();
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleQuickDoneRatioChange(doneRatio: number) {
    if (!issueId) return;
    try {
      await updateIssue(Number(issueId), { doneRatio } as IssueParams);
      await fetchIssue();
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleEditSubmit(params: IssueParams) {
    if (!issueId) return;
    await updateIssue(Number(issueId), params);
    setEditing(false);
    setLoading(true);
    await fetchIssue();
  }

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!issue) {
    return <div className="error-message">Issue 不存在</div>;
  }

  if (editing) {
    return (
      <div className="issue-detail-page">
        <h2>編輯 Issue #{issue.id}</h2>
        <IssueForm
          projectId={issue.project.id}
          initialValues={{
            trackerId: issue.tracker.id,
            subject: issue.subject,
            description: issue.description ?? undefined,
            statusId: issue.status.id,
            priorityId: issue.priority.id,
            assignedToId: issue.assignedTo?.id,
            parentIssueId: issue.parent?.id,
            startDate: issue.startDate ?? undefined,
            dueDate: issue.dueDate ?? undefined,
            estimatedHours: issue.estimatedHours ?? undefined,
            doneRatio: issue.doneRatio,
            watcherUserIds: issue.watchers?.map((w) => w.id),
          }}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditing(false)}
          submitLabel="更新"
        />
      </div>
    );
  }

  return (
    <div className="issue-detail-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h2>
          {issue.tracker.name} #{issue.id}: {issue.subject}
        </h2>
        <div className="header-actions">
          <button onClick={() => navigate(`/issues/${issue.id}/time-entry`)}>
            記錄工時
          </button>
          <button className="primary-button" onClick={() => setEditing(true)}>
            編輯
          </button>
        </div>
      </div>

      <div className="issue-detail">
        <div className="detail-section">
          <div className="detail-row">
            <span className="detail-label">狀態</span>
            <select
              value={issue.status.id}
              onChange={(e) => handleQuickStatusChange(Number(e.target.value))}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="detail-row">
            <span className="detail-label">完成度</span>
            <div className="done-ratio-control">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={issue.doneRatio}
                onChange={(e) => handleQuickDoneRatioChange(Number(e.target.value))}
              />
              <span>{issue.doneRatio}%</span>
            </div>
          </div>

          <div className="detail-row">
            <span className="detail-label">專案</span>
            <span>{issue.project.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">追蹤標籤</span>
            <span>{issue.tracker.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">優先權</span>
            <span>{issue.priority.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">被分派者</span>
            <span>{issue.assignedTo?.name ?? "（未指派）"}</span>
          </div>

          {issue.parent && (
            <div className="detail-row">
              <span className="detail-label">父議題</span>
              <span
                className="link"
                onClick={() => navigate(`/issues/${issue.parent!.id}`)}
              >
                #{issue.parent.id}
              </span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">開始日期</span>
            <span>{issue.startDate ?? "-"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">完成日期</span>
            <span>{issue.dueDate ?? "-"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">預估工時</span>
            <span>{issue.estimatedHours != null ? `${issue.estimatedHours} 小時` : "-"}</span>
          </div>

          {issue.watchers && issue.watchers.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">監看者</span>
              <span>{issue.watchers.map((w) => w.name).join(", ")}</span>
            </div>
          )}
        </div>

        {issue.description && (
          <div className="detail-section">
            <h3>概述</h3>
            <div className="description">{issue.description}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IssueDetailPage;
