import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IssueForm, { type PendingFile } from "./IssueForm";

vi.mock("@tauri-apps/plugin-dialog", () => ({
  open: vi.fn(),
}));

vi.mock("@tauri-apps/api/webview", () => ({
  getCurrentWebview: () => ({
    onDragDropEvent: vi.fn().mockResolvedValue(() => {}),
  }),
}));

const mockListTrackers = vi.fn();
const mockListStatuses = vi.fn();
const mockListPriorities = vi.fn();
const mockListMemberships = vi.fn();
const mockGetFileMetadata = vi.fn();

vi.mock("../lib/api", () => ({
  listTrackers: (...args: unknown[]) => mockListTrackers(...args),
  listStatuses: (...args: unknown[]) => mockListStatuses(...args),
  listPriorities: (...args: unknown[]) => mockListPriorities(...args),
  listMemberships: (...args: unknown[]) => mockListMemberships(...args),
  getFileMetadata: (...args: unknown[]) => mockGetFileMetadata(...args),
}));

vi.mock("../contexts/AppContext", () => ({
  useApp: () => ({ user: { id: 1, login: "test", firstname: "Test", lastname: "User", mail: null } }),
}));

const defaultOptions = {
  trackers: [{ id: 1, name: "Bug" }],
  statuses: [{ id: 1, name: "新建" }],
  priorities: [{ id: 2, name: "正常" }],
  memberships: [{ id: 1, user: { id: 1, name: "Test User" }, roles: [] }],
};

function setupMocks() {
  mockListTrackers.mockResolvedValue(defaultOptions.trackers);
  mockListStatuses.mockResolvedValue(defaultOptions.statuses);
  mockListPriorities.mockResolvedValue(defaultOptions.priorities);
  mockListMemberships.mockResolvedValue(defaultOptions.memberships);
}

describe("IssueForm attachment UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  it("shows drop zone with hint text when no files selected", async () => {
    render(
      <IssueForm
        projectId={1}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="建立"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("點擊選擇檔案，或拖曳檔案至此處")).toBeInTheDocument();
    });
  });

  it("shows attachment label", async () => {
    render(
      <IssueForm
        projectId={1}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="建立"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("附件")).toBeInTheDocument();
    });
  });

  it("calls onSubmit with empty files array when no attachments", async () => {
    const handleSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <IssueForm
        projectId={1}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
        submitLabel="建立"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("建立")).toBeInTheDocument();
    });

    const subjectInput = document.querySelector('input[type="text"][required]') as HTMLInputElement;
    fireEvent.change(subjectInput, { target: { value: "Test Issue" } });

    fireEvent.click(screen.getByText("建立"));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      const [_params, files] = handleSubmit.mock.calls[0] as [unknown, PendingFile[]];
      expect(files).toEqual([]);
    });
  });

  it("displays pending files and allows removal", async () => {
    mockGetFileMetadata.mockResolvedValueOnce({
      name: "test.pdf",
      size: 2048,
      path: "/tmp/test.pdf",
    });

    const { open: mockOpen } = await import("@tauri-apps/plugin-dialog");
    (mockOpen as ReturnType<typeof vi.fn>).mockResolvedValueOnce(["/tmp/test.pdf"]);

    render(
      <IssueForm
        projectId={1}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        submitLabel="建立"
      />
    );

    await waitFor(() => {
      expect(screen.getByText("點擊選擇檔案，或拖曳檔案至此處")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("點擊選擇檔案，或拖曳檔案至此處"));

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
      expect(screen.getByText("2.0 KB")).toBeInTheDocument();
    });

    // hint changes when files are present
    expect(screen.getByText("點擊新增更多檔案，或拖曳檔案至此處")).toBeInTheDocument();

    // remove the file
    fireEvent.click(screen.getByText("✕"));

    await waitFor(() => {
      expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
      expect(screen.getByText("點擊選擇檔案，或拖曳檔案至此處")).toBeInTheDocument();
    });
  });
});
