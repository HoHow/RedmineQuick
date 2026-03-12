import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteForm from "./NoteForm";

const mockUpdateIssue = vi.fn();

vi.mock("../lib/api", () => ({
  updateIssue: (...args: unknown[]) => mockUpdateIssue(...args),
}));

describe("NoteForm", () => {
  const onNoteAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders textarea and submit button", () => {
    render(<NoteForm issueId={1} onNoteAdded={onNoteAdded} />);
    expect(screen.getByPlaceholderText("輸入留言...")).toBeInTheDocument();
    expect(screen.getByText("送出")).toBeInTheDocument();
  });

  it("disables submit button when textarea is empty", () => {
    render(<NoteForm issueId={1} onNoteAdded={onNoteAdded} />);
    expect(screen.getByText("送出")).toBeDisabled();
  });

  it("disables submit button when textarea contains only whitespace", () => {
    render(<NoteForm issueId={1} onNoteAdded={onNoteAdded} />);
    fireEvent.change(screen.getByPlaceholderText("輸入留言..."), {
      target: { value: "   \n  " },
    });
    expect(screen.getByText("送出")).toBeDisabled();
  });

  it("enables submit button when textarea has content", () => {
    render(<NoteForm issueId={1} onNoteAdded={onNoteAdded} />);
    fireEvent.change(screen.getByPlaceholderText("輸入留言..."), {
      target: { value: "test note" },
    });
    expect(screen.getByText("送出")).toBeEnabled();
  });

  it("calls updateIssue with notes and clears textarea on success", async () => {
    mockUpdateIssue.mockResolvedValueOnce(undefined);
    render(<NoteForm issueId={42} onNoteAdded={onNoteAdded} />);

    fireEvent.change(screen.getByPlaceholderText("輸入留言..."), {
      target: { value: "my note" },
    });
    fireEvent.click(screen.getByText("送出"));

    await waitFor(() => {
      expect(mockUpdateIssue).toHaveBeenCalledWith(42, { notes: "my note" });
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue("");
    });

    expect(onNoteAdded).toHaveBeenCalled();
  });

  it("disables textarea and button while submitting", async () => {
    let resolvePromise: () => void;
    mockUpdateIssue.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolvePromise = resolve;
      }),
    );

    render(<NoteForm issueId={1} onNoteAdded={onNoteAdded} />);

    fireEvent.change(screen.getByPlaceholderText("輸入留言..."), {
      target: { value: "note" },
    });
    fireEvent.click(screen.getByText("送出"));

    expect(screen.getByPlaceholderText("輸入留言...")).toBeDisabled();
    expect(screen.getByText("送出")).toBeDisabled();

    resolvePromise!();
    await waitFor(() => {
      expect(screen.getByPlaceholderText("輸入留言...")).toBeEnabled();
    });
  });

  it("shows error message and keeps content on failure", async () => {
    mockUpdateIssue.mockRejectedValueOnce("API error");
    render(<NoteForm issueId={1} onNoteAdded={onNoteAdded} />);

    fireEvent.change(screen.getByPlaceholderText("輸入留言..."), {
      target: { value: "my note" },
    });
    fireEvent.click(screen.getByText("送出"));

    await waitFor(() => {
      expect(screen.getByText("API error")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue("my note");
    expect(onNoteAdded).not.toHaveBeenCalled();
  });

  describe("quote", () => {
    it("appends quoted text to textarea when pendingQuote changes", () => {
      const { rerender } = render(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} />,
      );

      rerender(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} pendingQuote="hello world" />,
      );

      expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue(
        "> hello world\n\n",
      );
    });

    it("formats multi-line text with > prefix on each line", () => {
      const { rerender } = render(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} />,
      );

      rerender(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} pendingQuote={"line1\nline2\nline3"} />,
      );

      expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue(
        "> line1\n> line2\n> line3\n\n",
      );
    });

    it("appends to existing content without overwriting", () => {
      const { rerender } = render(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} />,
      );

      fireEvent.change(screen.getByPlaceholderText("輸入留言..."), {
        target: { value: "existing text" },
      });

      rerender(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} pendingQuote="quoted" />,
      );

      expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue(
        "existing text> quoted\n\n",
      );
    });

    it("accumulates multiple quotes", () => {
      const { rerender } = render(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} />,
      );

      rerender(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} pendingQuote="first" />,
      );

      expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue(
        "> first\n\n",
      );

      rerender(
        <NoteForm issueId={1} onNoteAdded={onNoteAdded} pendingQuote="second" />,
      );

      expect(screen.getByPlaceholderText("輸入留言...")).toHaveValue(
        "> first\n\n> second\n\n",
      );
    });
  });
});
