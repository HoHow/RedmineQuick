import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { getIssue, updateIssue, uploadAttachment, listStatuses, listPriorities, listTrackers, listMemberships, downloadAttachment, saveAttachment, type Issue, type IdName, type IssueParams, type Membership, type Attachment, type UploadInfo } from "../lib/api";
import IssueForm, { type PendingFile } from "../components/IssueForm";
import NoteForm from "../components/NoteForm";

const FIELD_LABELS: Record<string, string> = {
  status_id: "狀態",
  priority_id: "優先權",
  tracker_id: "追蹤標籤",
  assigned_to_id: "分派給",
  done_ratio: "完成百分比",
  due_date: "完成日期",
  start_date: "開始日期",
  subject: "主旨",
  description: "概述",
  estimated_hours: "預估工時",
};

type LookupMap = Record<string, Record<string, string>>;

function buildLookup(
  statuses: IdName[],
  priorities: IdName[],
  trackers: IdName[],
  memberships: Membership[],
): LookupMap {
  const toMap = (list: IdName[]) =>
    Object.fromEntries(list.map((item) => [String(item.id), item.name]));
  const memberMap = Object.fromEntries(
    memberships.filter((m) => m.user).map((m) => [String(m.user!.id), m.user!.name]),
  );
  return {
    status_id: toMap(statuses),
    priority_id: toMap(priorities),
    tracker_id: toMap(trackers),
    assigned_to_id: memberMap,
  };
}

function resolveValue(fieldName: string, value: string | null, lookup: LookupMap): string {
  if (value == null) return "";
  if (lookup[fieldName] && lookup[fieldName][value]) {
    return lookup[fieldName][value];
  }
  return value;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <img className="lightbox-image" src={src} onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

function AttachmentSection({ issue }: { issue: Issue }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [imageDataMap, setImageDataMap] = useState<Record<number, string>>({});

  const attachments = issue.attachments;
  if (!attachments || attachments.length === 0) return null;

  const images = attachments.filter((a) => a.content_type.startsWith("image/"));
  const files = attachments.filter((a) => !a.content_type.startsWith("image/"));

  function handleImageClick(attachment: Attachment) {
    if (imageDataMap[attachment.id]) {
      setLightboxSrc(imageDataMap[attachment.id]);
    } else {
      downloadAttachment(attachment.content_url).then((base64) => {
        const dataUrl = `data:${attachment.content_type};base64,${base64}`;
        setImageDataMap((prev) => ({ ...prev, [attachment.id]: dataUrl }));
        setLightboxSrc(dataUrl);
      });
    }
  }

  function handleRegisterImage(id: number, dataUrl: string) {
    setImageDataMap((prev) => ({ ...prev, [id]: dataUrl }));
  }

  return (
    <div className="detail-section">
      <h3>附件（{attachments.length}）</h3>
      {images.length > 0 && (
        <div className="attachment-images">
          {images.map((a) => (
            <div key={a.id} className="attachment-image-item" onClick={() => handleImageClick(a)}>
              <ImageThumbnailCached attachment={a} onLoad={(dataUrl) => handleRegisterImage(a.id, dataUrl)} />
              <div className="attachment-image-name">{a.filename}</div>
            </div>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="attachment-files">
          {files.map((a) => (
            <div key={a.id} className="attachment-file-item">
              <span className="attachment-file-name">{a.filename}</span>
              <span className="attachment-file-size">{formatFileSize(a.filesize)}</span>
              <button onClick={() => saveAttachment(a.content_url, a.filename)}>下載</button>
            </div>
          ))}
        </div>
      )}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}

function ImageThumbnailCached({ attachment, onLoad }: { attachment: Attachment; onLoad: (dataUrl: string) => void }) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    downloadAttachment(attachment.content_url)
      .then((base64) => {
        const dataUrl = `data:${attachment.content_type};base64,${base64}`;
        setSrc(dataUrl);
        onLoad(dataUrl);
      })
      .catch(() => setSrc(null))
      .finally(() => setLoading(false));
  }, [attachment.content_url]);

  if (loading) return <div className="attachment-thumb-placeholder">載入中...</div>;
  if (!src) return <div className="attachment-thumb-placeholder">載入失敗</div>;
  return <img className="attachment-thumb" src={src} alt={attachment.filename} />;
}

function JournalSection({ issue, lookup, onQuote }: { issue: Issue; lookup: LookupMap; onQuote: (text: string) => void }) {
  const [tab, setTab] = useState<"all" | "notes" | "changes">("all");

  const allJournals = issue.journals ?? [];
  const filtered = allJournals.filter((j) => {
    if (tab === "notes") return j.notes;
    if (tab === "changes") return j.details.length > 0;
    return true;
  });

  if (allJournals.length === 0) {
    return (
      <div className="detail-section">
        <h3>歷程</h3>
        <p className="empty-state">目前沒有歷程記錄</p>
      </div>
    );
  }

  return (
    <div className="detail-section">
      <h3>歷程</h3>
      <div className="tab-group">
        <button className={`tab-button ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>全部</button>
        <button className={`tab-button ${tab === "notes" ? "active" : ""}`} onClick={() => setTab("notes")}>筆記</button>
        <button className={`tab-button ${tab === "changes" ? "active" : ""}`} onClick={() => setTab("changes")}>變更</button>
      </div>
      <div className="journal-list">
        {filtered.map((j) => (
          <div key={j.id} className="journal-item">
            <div className="journal-header">
              <span className="journal-author">{j.user.name}</span>
              <span className="journal-date">
                {new Date(j.created_on).toLocaleString("zh-TW")}
                <span className="journal-number">#{allJournals.indexOf(j) + 1}</span>
              </span>
            </div>
            {j.details.length > 0 && (
              <ul className="journal-details">
                {j.details.filter((d) => d.property === "attr").map((d, i) => {
                  const label = FIELD_LABELS[d.name] ?? d.name;
                  const oldVal = resolveValue(d.name, d.old_value, lookup);
                  const newVal = resolveValue(d.name, d.new_value, lookup);
                  return (
                    <li key={i}>
                      {!d.old_value && d.new_value ? (
                        <span>{label} 設定為 <span className="detail-new-value">{newVal}</span></span>
                      ) : d.old_value && !d.new_value ? (
                        <span>{label} 已清除（原值：<span className="detail-old-value">{oldVal}</span>）</span>
                      ) : (
                        <span>{label} 從 <span className="detail-old-value">{oldVal}</span> 變更為 <span className="detail-new-value">{newVal}</span></span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {j.notes && (
              <div className="journal-notes">
                {j.notes}
                <button className="quote-button" onClick={() => onQuote(j.notes!)}>引用</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function IssueDetailPage() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [statuses, setStatuses] = useState<IdName[]>([]);
  const [lookup, setLookup] = useState<LookupMap>({});
  const [dueDateEditing, setDueDateEditing] = useState(false);
  const [updatedField, setUpdatedField] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [pendingQuote, setPendingQuote] = useState<string | undefined>(undefined);
  const noteFormRef = useRef<HTMLDivElement>(null);

  async function fetchIssue() {
    if (!issueId) return;
    try {
      const [data, statusList, priorityList, trackerList] = await Promise.all([
        getIssue(Number(issueId)),
        listStatuses(),
        listPriorities(),
        listTrackers(),
      ]);
      setIssue(data);
      setStatuses(statusList);
      // memberships needs projectId from issue
      const memberList = await listMemberships(data.project.id);
      setLookup(buildLookup(statusList, priorityList, trackerList, memberList));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssue();
  }, [issueId]);

  async function handleQuickStatusChange(statusId: number) {
    if (!issueId) return;
    try {
      await updateIssue(Number(issueId), { status_id: statusId } as IssueParams);
      await fetchIssue();
      setUpdatedField("status");
      setTimeout(() => setUpdatedField(null), 2000);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleQuickDueDateChange(dueDate: string) {
    if (!issueId) return;
    try {
      await updateIssue(Number(issueId), { due_date: dueDate || undefined } as IssueParams);
      await fetchIssue();
      setDueDateEditing(false);
      setUpdatedField("due_date");
      setTimeout(() => setUpdatedField(null), 2000);
    } catch (e) {
      setError(String(e));
    }
  }

  function handleQuote(text: string) {
    setPendingQuote(text);
    noteFormRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleEditSubmit(params: IssueParams, files: PendingFile[]) {
    if (!issueId) return;
    if (files.length > 0) {
      const uploads: UploadInfo[] = [];
      for (let i = 0; i < files.length; i++) {
        setUploadStatus(`上傳中 (${i + 1}/${files.length})...`);
        const info = await uploadAttachment(files[i].path);
        uploads.push(info);
      }
      setUploadStatus(null);
      params.uploads = uploads;
    }
    await updateIssue(Number(issueId), params);
    setEditing(false);
    setLoading(true);
    await fetchIssue();
  }

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!issue) {
    return <div className="error-message">Issue 不存在</div>;
  }

  if (editing) {
    return (
      <div className="issue-detail-page">
        <h2>編輯 Issue #{issue.id}</h2>
        {uploadStatus && <div className="loading">{uploadStatus}</div>}
        <IssueForm
          projectId={issue.project.id}
          initialValues={{
            tracker_id: issue.tracker.id,
            subject: issue.subject,
            description: issue.description ?? undefined,
            status_id: issue.status.id,
            priority_id: issue.priority.id,
            assigned_to_id: issue.assigned_to?.id,
            parent_issue_id: issue.parent?.id,
            start_date: issue.start_date ?? undefined,
            due_date: issue.due_date ?? undefined,
            estimated_hours: issue.estimated_hours ?? undefined,
            done_ratio: issue.done_ratio,
            watcher_user_ids: issue.watchers?.map((w) => w.id),
          }}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditing(false)}
          submitLabel="更新"
        />
      </div>
    );
  }

  return (
    <div className="issue-detail-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h2>
          {issue.tracker.name} #{issue.id}: {issue.subject}
        </h2>
        <div className="header-actions">
          <button onClick={() => navigate(`/issues/${issue.id}/time-entry`)}>
            記錄工時
          </button>
          <button className="primary-button" onClick={() => setEditing(true)}>
            編輯
          </button>
        </div>
      </div>

      <div className="issue-detail">
        <div className="detail-section">
          <div className="detail-grid">
          <div className="detail-row">
            <span className="detail-label">狀態</span>
            <select
              value={issue.status.id}
              onChange={(e) => handleQuickStatusChange(Number(e.target.value))}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {updatedField === "status" && <span className="update-hint">✓ 已更新</span>}
          </div>

          <div className="detail-row">
            <span className="detail-label">完成度</span>
            <span>{issue.done_ratio}%</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">專案</span>
            <span>{issue.project.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">追蹤標籤</span>
            <span>{issue.tracker.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">優先權</span>
            <span>{issue.priority.name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">被分派者</span>
            <span>{issue.assigned_to?.name ?? "（未指派）"}</span>
          </div>

          {issue.parent && (
            <div className="detail-row">
              <span className="detail-label">父議題</span>
              <span
                className="link"
                onClick={() => navigate(`/issues/${issue.parent!.id}`)}
              >
                #{issue.parent.id}
              </span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">開始日期</span>
            <span>{issue.start_date ?? "-"}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">完成日期</span>
            {issue.due_date || dueDateEditing ? (
              <input
                type="date"
                value={issue.due_date ?? ""}
                onChange={(e) => handleQuickDueDateChange(e.target.value)}
                onBlur={() => { if (!issue.due_date) setDueDateEditing(false); }}
                autoFocus={dueDateEditing && !issue.due_date}
              />
            ) : (
              <span className="link" onClick={() => setDueDateEditing(true)}>
                未設定
              </span>
            )}
            {updatedField === "due_date" && <span className="update-hint">✓ 已更新</span>}
          </div>

          <div className="detail-row">
            <span className="detail-label">預估工時</span>
            <span>{issue.estimated_hours != null ? `${issue.estimated_hours} 小時` : "-"}</span>
          </div>

          {issue.watchers && issue.watchers.length > 0 && (
            <div className="detail-row">
              <span className="detail-label">監看者</span>
              <span>{issue.watchers.map((w) => w.name).join(", ")}</span>
            </div>
          )}
          </div>
        </div>

        {issue.description && (
          <div className="detail-section">
            <div className="section-header">
              <h3>概述</h3>
              <button className="quote-button" onClick={() => handleQuote(issue.description!)}>引用</button>
            </div>
            <div className="description">{issue.description}</div>
          </div>
        )}

        <AttachmentSection issue={issue} />
        <JournalSection issue={issue} lookup={lookup} onQuote={handleQuote} />
        <div ref={noteFormRef}>
          <NoteForm
            issueId={issue.id}
            onNoteAdded={fetchIssue}
            pendingQuote={pendingQuote}
            onQuoteConsumed={() => setPendingQuote(undefined)}
          />
        </div>
      </div>
    </div>
  );
}

export default IssueDetailPage;
