import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { Issue, IdName } from "../lib/api";

type SortKey = "id" | "priority" | "status" | "updated_on";
type SortDir = "asc" | "desc";

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "剛剛";
  if (minutes < 60) return `${minutes}分鐘前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小時前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  return `${months}個月前`;
}

function compareFn(a: Issue, b: Issue, key: SortKey, dir: SortDir): number {
  let cmp = 0;
  switch (key) {
    case "id":
      cmp = a.id - b.id;
      break;
    case "priority":
      cmp = a.priority.id - b.priority.id;
      break;
    case "status":
      cmp = a.status.name.localeCompare(b.status.name);
      break;
    case "updated_on":
      cmp = (a.updated_on ?? "").localeCompare(b.updated_on ?? "");
      break;
  }
  return dir === "asc" ? cmp : -cmp;
}

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
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedIssues = useMemo(
    () => [...issues].sort((a, b) => compareFn(a, b, sortKey, sortDir)),
    [issues, sortKey, sortDir],
  );

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function sortIndicator(key: SortKey): string {
    if (key !== sortKey) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

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
          <th className="sortable-header" onClick={() => handleSort("id")}>#{sortIndicator("id")}</th>
          {showProject && <th>專案</th>}
          <th>主旨</th>
          {showAuthor && <th>建立者</th>}
          {showAssignee && <th>被分派者</th>}
          <th className="sortable-header" onClick={() => handleSort("status")}>狀態{sortIndicator("status")}</th>
          <th className="sortable-header" onClick={() => handleSort("priority")}>優先權{sortIndicator("priority")}</th>
          <th className="sortable-header" onClick={() => handleSort("updated_on")}>更新{sortIndicator("updated_on")}</th>
        </tr>
      </thead>
      <tbody>
        {sortedIssues.map((issue) => (
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
            <td className="issue-updated">{formatRelativeTime(issue.updated_on)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueList;
