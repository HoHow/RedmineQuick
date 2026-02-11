import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { createTimeEntry, listActivities, type IdName } from "../lib/api";

function TimeEntryPage() {
  const { issueId } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState<IdName[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hours, setHours] = useState("");
  const [activityId, setActivityId] = useState<number | undefined>();
  const [comments, setComments] = useState("");
  const [spentOn, setSpentOn] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  useEffect(() => {
    async function fetchActivities() {
      try {
        const list = await listActivities();
        setActivities(list);
        if (list.length > 0) {
          setActivityId(list[0].id);
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!issueId || !activityId || !hours) return;

    setSubmitting(true);
    setError(null);

    try {
      await createTimeEntry({
        issue_id: Number(issueId),
        hours: Number(hours),
        activity_id: activityId,
        comments: comments || undefined,
        spent_on: spentOn || undefined,
      });
      navigate(`/issues/${issueId}`);
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="loading">載入中...</div>;
  }

  return (
    <div className="time-entry-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 返回
        </button>
        <h2>記錄工時 — Issue #{issueId}</h2>
      </div>

      <form className="time-entry-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label>花費時數 *</label>
            <input
              type="number"
              step="0.25"
              min="0.25"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>活動類型 *</label>
            <select
              value={activityId}
              onChange={(e) => setActivityId(Number(e.target.value))}
              required
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>日期</label>
            <input
              type="date"
              value={spentOn}
              onChange={(e) => setSpentOn(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>備註</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={submitting || !hours || !activityId}
          >
            {submitting ? "送出中..." : "記錄工時"}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            取消
          </button>
        </div>
      </form>
    </div>
  );
}

export default TimeEntryPage;
