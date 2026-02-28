import { useState, useEffect, useRef } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import {
  listTrackers,
  listStatuses,
  listPriorities,
  listMemberships,
  getFileMetadata,
  type IdName,
  type Membership,
  type IssueParams,
  type FileMetadata,
} from "../lib/api";
import { useApp } from "../contexts/AppContext";

export interface PendingFile {
  path: string;
  name: string;
  size: number;
}

interface IssueFormProps {
  projectId: number;
  initialValues?: IssueParams;
  onSubmit: (params: IssueParams, files: PendingFile[]) => Promise<void>;
  onSubmitContinue?: (params: IssueParams, files: PendingFile[]) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function IssueForm({ projectId, initialValues, onSubmit, onSubmitContinue, onCancel, submitLabel }: IssueFormProps) {
  const { user } = useApp();
  const [trackers, setTrackers] = useState<IdName[]>([]);
  const [statuses, setStatuses] = useState<IdName[]>([]);
  const [priorities, setPriorities] = useState<IdName[]>([]);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trackerId, setTrackerId] = useState<number | undefined>(initialValues?.tracker_id);
  const [subject, setSubject] = useState(initialValues?.subject ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [statusId, setStatusId] = useState<number | undefined>(initialValues?.status_id);
  const [priorityId, setPriorityId] = useState<number | undefined>(initialValues?.priority_id);
  const [assignedToId, setAssignedToId] = useState<number | undefined>(initialValues?.assigned_to_id);
  const [parentIssueId, setParentIssueId] = useState<number | undefined>(initialValues?.parent_issue_id);
  const [startDate, setStartDate] = useState(
    initialValues?.start_date ?? (initialValues ? "" : new Date().toISOString().split("T")[0])
  );
  const [dueDate, setDueDate] = useState(initialValues?.due_date ?? "");
  const [estimatedHours, setEstimatedHours] = useState<string>(
    initialValues?.estimated_hours?.toString() ?? ""
  );
  const [doneRatio, setDoneRatio] = useState<number>(initialValues?.done_ratio ?? 0);
  const [watcherUserIds, setWatcherUserIds] = useState<number[]>(initialValues?.watcher_user_ids ?? []);
  const [notes, setNotes] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const continueRef = useRef(false);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [t, s, p, m] = await Promise.all([
          listTrackers(),
          listStatuses(),
          listPriorities(),
          listMemberships(projectId),
        ]);
        setTrackers(t);
        setStatuses(s);
        setPriorities(p);
        setMembers(m);

        if (!trackerId && t.length > 0) {
          const taskTracker = t.find((tr) => tr.name === "工作");
          setTrackerId(taskTracker ? taskTracker.id : t[0].id);
        }
        if (!statusId && s.length > 0) setStatusId(s[0].id);
        if (!priorityId && p.length > 0) {
          const normalPriority = p.find((pr) => pr.name === "正常");
          setPriorityId(normalPriority ? normalPriority.id : p[0].id);
        }
        if (assignedToId === undefined && user) {
          const me = m.find((member) => member.user?.id === user.id);
          if (me) setAssignedToId(me.user!.id);
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, [projectId]);

  useEffect(() => {
    const webview = getCurrentWebview();
    const unlistenPromise = webview.onDragDropEvent(async (event) => {
      if (event.payload.type === "enter" || event.payload.type === "over") {
        setIsDragOver(true);
      } else if (event.payload.type === "leave") {
        setIsDragOver(false);
      } else if (event.payload.type === "drop") {
        setIsDragOver(false);
        await addFilesByPath(event.payload.paths);
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  async function addFilesByPath(paths: string[]) {
    const newFiles: PendingFile[] = [];
    for (const p of paths) {
      const existing = pendingFiles.find((f) => f.path === p);
      if (existing) continue;
      try {
        const meta: FileMetadata = await getFileMetadata(p);
        newFiles.push({ path: meta.path, name: meta.name, size: meta.size });
      } catch {
        // skip files that can't be read
      }
    }
    if (newFiles.length > 0) {
      setPendingFiles((prev) => [...prev, ...newFiles]);
    }
  }

  async function handlePickFiles() {
    const selected = await open({ multiple: true, title: "選擇附件" });
    if (!selected) return;
    const paths = Array.isArray(selected) ? selected : [selected];
    await addFilesByPath(paths);
  }

  function handleRemoveFile(path: string) {
    setPendingFiles((prev) => prev.filter((f) => f.path !== path));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const params: IssueParams = {
      tracker_id: trackerId,
      subject,
      description: description || undefined,
      status_id: statusId,
      priority_id: priorityId,
      assigned_to_id: assignedToId,
      parent_issue_id: parentIssueId,
      start_date: startDate || undefined,
      due_date: dueDate || undefined,
      estimated_hours: estimatedHours ? Number(estimatedHours) : undefined,
      done_ratio: doneRatio,
      watcher_user_ids: watcherUserIds.length > 0 ? watcherUserIds : undefined,
      notes: notes || undefined,
    };

    try {
      if (continueRef.current && onSubmitContinue) {
        await onSubmitContinue(params, pendingFiles);
        setSubject("");
        setDescription("");
        setDueDate("");
        setEstimatedHours("");
        setDoneRatio(0);
        setNotes("");
        setPendingFiles([]);
        window.scrollTo(0, 0);
      } else {
        await onSubmit(params, pendingFiles);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
      continueRef.current = false;
    }
  }

  const userMembers = members.filter((m) => m.user !== null);

  function handleWatcherToggle(userId: number) {
    setWatcherUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  if (loading) {
    return <div className="loading">載入選項中...</div>;
  }

  return (
    <form className="issue-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label>追蹤標籤</label>
          <select value={trackerId} onChange={(e) => setTrackerId(Number(e.target.value))}>
            {trackers.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>狀態</label>
          <select value={statusId} onChange={(e) => setStatusId(Number(e.target.value))}>
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>優先權</label>
          <select value={priorityId} onChange={(e) => setPriorityId(Number(e.target.value))}>
            {priorities.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>主旨 *</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>概述</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>被分派者</label>
          <select
            value={assignedToId ?? ""}
            onChange={(e) => setAssignedToId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">（未指派）</option>
            {userMembers.map((m) => (
              <option key={m.user!.id} value={m.user!.id}>{m.user!.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>父議題 ID</label>
          <input
            type="number"
            value={parentIssueId ?? ""}
            onChange={(e) => setParentIssueId(e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>開始日期</label>
          <input
            type={startDate ? "date" : "text"}
            value={startDate}
            onFocus={(e) => { e.currentTarget.type = "date"; }}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="未設定"
          />
        </div>
        <div className="form-group">
          <label>完成日期</label>
          <input
            type={dueDate ? "date" : "text"}
            value={dueDate}
            onFocus={(e) => { e.currentTarget.type = "date"; }}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="未設定"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>預估工時</label>
          <input
            type="number"
            step="0.5"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>完成百分比: {doneRatio}%</label>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={doneRatio}
            onChange={(e) => setDoneRatio(Number(e.target.value))}
          />
        </div>
      </div>

      {initialValues && (
        <div className="form-group">
          <label>筆記</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="輸入更新筆記（選填）"
          />
        </div>
      )}

      <div className="form-group">
        <label>附件</label>
        <div
          className={`attachment-drop-zone${isDragOver ? " drag-over" : ""}`}
          onClick={handlePickFiles}
        >
          {pendingFiles.length === 0 ? (
            <span className="attachment-drop-hint">點擊選擇檔案，或拖曳檔案至此處</span>
          ) : (
            <span className="attachment-drop-hint">點擊新增更多檔案，或拖曳檔案至此處</span>
          )}
        </div>
        {pendingFiles.length > 0 && (
          <div className="pending-file-list">
            {pendingFiles.map((f) => (
              <div key={f.path} className="pending-file-item">
                <span className="pending-file-name">{f.name}</span>
                <span className="pending-file-size">{formatFileSize(f.size)}</span>
                <button type="button" onClick={() => handleRemoveFile(f.path)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {userMembers.length > 0 && (
        <div className="form-group">
          <label>監看者</label>
          <div className="watcher-list">
            {userMembers.map((m) => (
              <label key={m.user!.id} className="watcher-item">
                <input
                  type="checkbox"
                  checked={watcherUserIds.includes(m.user!.id)}
                  onChange={() => handleWatcherToggle(m.user!.id)}
                />
                {m.user!.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={submitting || !subject}>
          {submitting && !continueRef.current ? "送出中..." : submitLabel}
        </button>
        {onSubmitContinue && (
          <button
            type="submit"
            disabled={submitting || !subject}
            onClick={() => { continueRef.current = true; }}
          >
            {submitting && continueRef.current ? "送出中..." : "繼續建立"}
          </button>
        )}
        <button type="button" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}

export default IssueForm;
