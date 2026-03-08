import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import IssueList from "./IssueList";
import type { Issue } from "../lib/api";

const baseIssue: Issue = {
  id: 1,
  subject: "Test issue",
  description: null,
  project: { id: 1, name: "Project A" },
  tracker: { id: 1, name: "Bug" },
  status: { id: 1, name: "New" },
  priority: { id: 2, name: "Normal" },
  author: { id: 10, name: "Alice" },
  assigned_to: { id: 20, name: "Bob" },
  parent: null,
  start_date: null,
  due_date: null,
  estimated_hours: null,
  done_ratio: 0,
  journals: [],
  attachments: [],
  watchers: null,
};

function renderIssueList(props: Partial<Parameters<typeof IssueList>[0]> = {}) {
  return render(
    <MemoryRouter>
      <IssueList issues={[baseIssue]} {...props} />
    </MemoryRouter>
  );
}

describe("IssueList showAuthor", () => {
  it("does not render author column when showAuthor is false or omitted", () => {
    renderIssueList();
    expect(screen.queryByText("建立者")).not.toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("renders author column header and value when showAuthor is true", () => {
    renderIssueList({ showAuthor: true });
    expect(screen.getByText("建立者")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders author column between subject and assignee columns", () => {
    renderIssueList({ showAuthor: true, showAssignee: true });
    const headers = screen.getAllByRole("columnheader").map((th) => th.textContent);
    const subjectIdx = headers.indexOf("主旨");
    const authorIdx = headers.indexOf("建立者");
    const assigneeIdx = headers.indexOf("被分派者");
    expect(authorIdx).toBe(subjectIdx + 1);
    expect(assigneeIdx).toBe(authorIdx + 1);
  });
});
