import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import SearchDialog from "./SearchDialog";

const mockClose = vi.fn();
let mockIsOpen = false;

vi.mock("../contexts/SearchContext", () => ({
  useSearch: () => ({ isOpen: mockIsOpen, open: vi.fn(), close: mockClose }),
}));

const mockGetIssue = vi.fn();
const mockSearchIssues = vi.fn();

vi.mock("../lib/api", () => ({
  getIssue: (...args: unknown[]) => mockGetIssue(...args),
  searchIssues: (...args: unknown[]) => mockSearchIssues(...args),
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

function renderDialog() {
  return render(
    <MemoryRouter>
      <SearchDialog />
    </MemoryRouter>
  );
}

const fakeIssue = {
  id: 42,
  subject: "Fix login bug",
  project: { id: 1, name: "ProjectA" },
  status: { id: 1, name: "Open" },
  priority: { id: 2, name: "Normal" },
  tracker: { id: 1, name: "Bug" },
  author: { id: 1, name: "Alice" },
  assigned_to: null,
  parent: null,
  description: null,
  start_date: null,
  due_date: null,
  estimated_hours: null,
  done_ratio: 0,
  updated_on: null,
  journals: [],
  attachments: [],
  watchers: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockIsOpen = false;
});

describe("SearchDialog", () => {
  it("does not render when closed", () => {
    mockIsOpen = false;
    renderDialog();
    expect(screen.queryByPlaceholderText("搜尋 Issue...")).not.toBeInTheDocument();
  });

  it("renders input when open", () => {
    mockIsOpen = true;
    renderDialog();
    expect(screen.getByPlaceholderText("搜尋 Issue...")).toBeInTheDocument();
  });

  it("closes on ESC key", () => {
    mockIsOpen = true;
    renderDialog();
    fireEvent.keyDown(screen.getByPlaceholderText("搜尋 Issue..."), { key: "Escape" });
    expect(mockClose).toHaveBeenCalled();
  });

  it("closes on overlay click", () => {
    mockIsOpen = true;
    renderDialog();
    fireEvent.click(document.querySelector(".search-overlay")!);
    expect(mockClose).toHaveBeenCalled();
  });

  it("fetches issue by ID on numeric input", async () => {
    mockIsOpen = true;
    mockGetIssue.mockResolvedValue(fakeIssue);
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText("搜尋 Issue..."), { target: { value: "42" } });

    await waitFor(() => {
      expect(mockGetIssue).toHaveBeenCalledWith(42);
    });

    await waitFor(() => {
      expect(screen.getByText("#42")).toBeInTheDocument();
      expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    });
  });

  it("shows error when issue not found by ID", async () => {
    mockIsOpen = true;
    mockGetIssue.mockRejectedValue(new Error("Not found"));
    renderDialog();

    fireEvent.change(screen.getByPlaceholderText("搜尋 Issue..."), { target: { value: "999" } });

    await waitFor(() => {
      expect(screen.getByText("找不到 Issue #999")).toBeInTheDocument();
    });
  });

  it("searches by keyword on Enter", async () => {
    mockIsOpen = true;
    mockSearchIssues.mockResolvedValue([fakeIssue]);
    renderDialog();

    const input = screen.getByPlaceholderText("搜尋 Issue...");
    fireEvent.change(input, { target: { value: "login" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(mockSearchIssues).toHaveBeenCalledWith("login", undefined);
    });

    await waitFor(() => {
      expect(screen.getByText("#42")).toBeInTheDocument();
    });
  });

  it("navigates and closes on result selection", async () => {
    mockIsOpen = true;
    mockSearchIssues.mockResolvedValue([fakeIssue]);
    renderDialog();

    const input = screen.getByPlaceholderText("搜尋 Issue...");
    fireEvent.change(input, { target: { value: "login" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("#42")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Fix login bug"));
    expect(mockNavigate).toHaveBeenCalledWith("/issues/42");
    expect(mockClose).toHaveBeenCalled();
  });

  it("supports keyboard navigation with arrow keys", async () => {
    mockIsOpen = true;
    const fakeIssue2 = { ...fakeIssue, id: 43, subject: "Another issue" };
    mockSearchIssues.mockResolvedValue([fakeIssue, fakeIssue2]);
    renderDialog();

    const input = screen.getByPlaceholderText("搜尋 Issue...");
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("#42")).toBeInTheDocument();
    });

    // First item selected by default
    expect(document.querySelector(".search-result-item.selected")).toHaveTextContent("#42");

    // Arrow down → select second
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(document.querySelectorAll(".search-result-item")[1]).toHaveClass("selected");

    // Enter → navigate to second
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockNavigate).toHaveBeenCalledWith("/issues/43");
  });
});
