import { useNavigate } from "react-router";
import type { Issue } from "../lib/api";

interface IssueListProps {
  issues: Issue[];
  showProject?: boolean;
}

function IssueList({ issues, showProject = false }: IssueListProps) {
  const navigate = useNavigate();

  return (
    <table className="issue-table">
      <thead>
        <tr>
          <th>#</th>
          {showProject && <th>專案</th>}
          <th>追蹤標籤</th>
          <th>主旨</th>
          <th>狀態</th>
          <th>優先權</th>
          <th>被分派者</th>
          <th>完成度</th>
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
            <td>{issue.tracker.name}</td>
            <td className="issue-subject">{issue.subject}</td>
            <td>{issue.status.name}</td>
            <td>{issue.priority.name}</td>
            <td>{issue.assignedTo?.name ?? "-"}</td>
            <td>{issue.doneRatio}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueList;
