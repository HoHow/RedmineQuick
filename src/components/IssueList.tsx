import { useState } from "react";
import { useNavigate } from "react-router";
import type { Issue, IdName } from "../lib/api";

interface IssueListProps {
  issues: Issue[];
  showProject?: boolean;
  statuses?: IdName[];
  onStatusChange?: (issueId: number, statusId: number) => Promise<void>;
}

function IssueList({ issues, showProject = false, statuses, onStatusChange }: IssueListProps) {
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function handleStatusChange(issue: Issue, newStatusId: number) {
    if (!onStatusChange || newStatusId === issue.status.id) return;
    setUpdatingId(issue.id);
    try {
      await onStatusChange(issue.id, newStatusId);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <table className="issue-table">
      <thead>
        <tr>
          <th>#</th>
          {showProject && <th>專案</th>}
          <th>主旨</th>
          <th>狀態</th>
          <th>優先權</th>
        </tr>
      </thead>
      <tbody>
        {issues.map((issue) => (
          <tr
            key={issue.id}
            className="issue-row"
            onClick={() => navigate(`/issues/${issue.id}`)}
          >
            <td>{issue.id}</td>
            {showProject && <td>{issue.project.name}</td>}
            <td className="issue-subject">{issue.subject}</td>
            <td>
              {statuses && onStatusChange ? (
                <select
                  className="inline-status-select"
                  value={issue.status.id}
                  disabled={updatingId === issue.id}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handleStatusChange(issue, Number(e.target.value))}
                >
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              ) : (
                issue.status.name
              )}
            </td>
            <td>{issue.priority.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueList;
