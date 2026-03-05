import { useState } from "react";
import { useNavigate } from "react-router";
import type { Issue, IdName } from "../lib/api";

interface IssueListProps {
  issues: Issue[];
  showProject?: boolean;
  showAuthor?: boolean;
  showAssignee?: boolean;
  statuses?: IdName[];
  onStatusChange?: (issueId: number, statusId: number) => Promise<void>;
  priorities?: IdName[];
  onPriorityChange?: (issueId: number, priorityId: number) => Promise<void>;
}

function IssueList({ issues, showProject = false, showAuthor = false, showAssignee = false, statuses, onStatusChange, priorities, onPriorityChange }: IssueListProps) {
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

  async function handlePriorityChange(issue: Issue, newPriorityId: number) {
    if (!onPriorityChange || newPriorityId === issue.priority.id) return;
    setUpdatingId(issue.id);
    try {
      await onPriorityChange(issue.id, newPriorityId);
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
          {showAuthor && <th>建立者</th>}
          {showAssignee && <th>被分派者</th>}
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
            {showAuthor && <td>{issue.author.name}</td>}
            {showAssignee && <td>{issue.assigned_to?.name ?? "未指派"}</td>}
            <td>
              {statuses && onStatusChange ? (
                <select
                  className="inline-select"
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
            <td>
              {priorities && onPriorityChange ? (
                <select
                  className="inline-select"
                  value={issue.priority.id}
                  disabled={updatingId === issue.id}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => handlePriorityChange(issue, Number(e.target.value))}
                >
                  {priorities.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              ) : (
                issue.priority.name
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueList;
