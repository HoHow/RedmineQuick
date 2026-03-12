import { useState, useEffect, useRef } from "react";
import { updateIssue } from "../lib/api";

function formatQuote(text: string): string {
  const lines = text.split("\n");
  return lines.map((line) => `> ${line}`).join("\n") + "\n\n";
}

interface NoteFormProps {
  issueId: number;
  onNoteAdded: () => void;
  pendingQuote?: string;
  onQuoteConsumed?: () => void;
}

function NoteForm({ issueId, onNoteAdded, pendingQuote, onQuoteConsumed }: NoteFormProps) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSubmit = notes.trim().length > 0 && !submitting;

  useEffect(() => {
    if (pendingQuote) {
      const quoted = formatQuote(pendingQuote);
      setNotes((prev) => prev + quoted);
      textareaRef.current?.focus();
      onQuoteConsumed?.();
    }
  }, [pendingQuote]);

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await updateIssue(issueId, { notes });
      setNotes("");
      onNoteAdded();
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="note-form">
      <h3>新增留言</h3>
      <textarea
        ref={textareaRef}
        placeholder="輸入留言..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={submitting}
        rows={4}
      />
      {error && <div className="error-message">{error}</div>}
      <div className="note-form-actions">
        <button onClick={handleSubmit} disabled={!canSubmit}>
          送出
        </button>
      </div>
    </div>
  );
}

export default NoteForm;
