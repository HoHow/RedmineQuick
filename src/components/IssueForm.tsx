import { useState, useEffect } from "react";
import {
  listTrackers,
  listStatuses,
  listPriorities,
  listMemberships,
  type IdName,
  type Membership,
  type IssueParams,
} from "../lib/api";

interface IssueFormProps {
  projectId: number;
  initialValues?: IssueParams;
  onSubmit: (params: IssueParams) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

function IssueForm({ projectId, initialValues, onSubmit, onCancel, submitLabel }: IssueFormProps) {
  const [trackers, setTrackers] = useState<IdName[]>([]);
  const [statuses, setStatuses] = useState<IdName[]>([]);
  const [priorities, setPriorities] = useState<IdName[]>([]);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trackerId, setTrackerId] = useState<number | undefined>(initialValues?.trackerId);
  const [subject, setSubject] = useState(initialValues?.subject ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [statusId, setStatusId] = useState<number | undefined>(initialValues?.statusId);
  const [priorityId, setPriorityId] = useState<number | undefined>(initialValues?.priorityId);
  const [assignedToId, setAssignedToId] = useState<number | undefined>(initialValues?.assignedToId);
  const [parentIssueId, setParentIssueId] = useState<number | undefined>(initialValues?.parentIssueId);
  const [startDate, setStartDate] = useState(initialValues?.startDate ?? "");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate ?? "");
  const [estimatedHours, setEstimatedHours] = useState<string>(
    initialValues?.estimatedHours?.toString() ?? ""
  );
  const [doneRatio, setDoneRatio] = useState<number>(initialValues?.doneRatio ?? 0);
  const [watcherUserIds, setWatcherUserIds] = useState<number[]>(initialValues?.watcherUserIds ?? []);

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

        if (!trackerId && t.length > 0) setTrackerId(t[0].id);
        if (!statusId && s.length > 0) setStatusId(s[0].id);
        if (!priorityId && p.length > 0) setPriorityId(p[0].id);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, [projectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const params: IssueParams = {
      trackerId,
      subject,
      description: description || undefined,
      statusId,
      priorityId,
      assignedToId,
      parentIssueId,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
      doneRatio,
      watcherUserIds: watcherUserIds.length > 0 ? watcherUserIds : undefined,
    };

    try {
      await onSubmit(params);
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
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
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>完成日期</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
          {submitting ? "送出中..." : submitLabel}
        </button>
        <button type="button" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
}

export default IssueForm;
