import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useSearch } from "../contexts/SearchContext";
import { getIssue, searchIssues, type Issue } from "../lib/api";

interface SearchResult {
  id: number;
  subject: string;
  projectName: string;
  statusName: string;
}

function toResult(issue: Issue): SearchResult {
  return {
    id: issue.id,
    subject: issue.subject,
    projectName: issue.project.name,
    statusName: issue.status.name,
  };
}

interface RecentEntry {
  id: number;
  subject: string;
  projectName: string;
}

function loadRecentIssues(): RecentEntry[] {
  try {
    return JSON.parse(localStorage.getItem("recent-issues") ?? "[]");
  } catch {
    return [];
  }
}

function SearchDialog() {
  const { isOpen, close } = useSearch();
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId ? Number(params.projectId) : undefined;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentIssues, setRecentIssues] = useState<RecentEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setError(null);
      setSelectedIndex(0);
      setRecentIssues(loadRecentIssues());
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const isNumeric = useCallback((s: string) => /^\d+$/.test(s), []);

  function handleInputChange(value: string) {
    setQuery(value);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (isNumeric(value.trim())) {
      setLoading(true);
      debounceRef.current = setTimeout(async () => {
        const reqId = ++requestIdRef.current;
        try {
          const issue = await getIssue(Number(value.trim()));
          if (reqId === requestIdRef.current) {
            setResults([toResult(issue)]);
            setSelectedIndex(0);
          }
        } catch {
          if (reqId === requestIdRef.current) {
            setResults([]);
            setError(`找不到 Issue #${value.trim()}`);
          }
        } finally {
          if (reqId === requestIdRef.current) {
            setLoading(false);
          }
        }
      }, 300);
    } else {
      setResults([]);
      setLoading(false);
    }
  }

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed || isNumeric(trimmed)) return;

    setLoading(true);
    setError(null);
    const reqId = ++requestIdRef.current;
    try {
      const issues = await searchIssues(trimmed, projectId);
      if (reqId === requestIdRef.current) {
        setResults(issues.map(toResult));
        setSelectedIndex(0);
        if (issues.length === 0) {
          setError("沒有找到相關 Issue");
        }
      }
    } catch (e) {
      if (reqId === requestIdRef.current) {
        setError(String(e));
      }
    } finally {
      if (reqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  function selectResult(result: SearchResult) {
    close();
    navigate(`/issues/${result.id}`);
  }

  const showRecent = !query.trim() && recentIssues.length > 0 && !loading;
  const navLength = showRecent ? recentIssues.length : results.length;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (navLength > 0 ? (prev + 1) % navLength : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (navLength > 0 ? (prev - 1 + navLength) % navLength : 0));
    } else if (e.key === "Enter") {
      if (showRecent && recentIssues[selectedIndex]) {
        close();
        navigate(`/issues/${recentIssues[selectedIndex].id}`);
      } else if (results.length > 0 && results[selectedIndex]) {
        selectResult(results[selectedIndex]);
      } else {
        handleSearch();
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={close}>
      <div className="search-dialog" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder={projectId ? "搜尋此專案的 Issue..." : "搜尋 Issue..."}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <kbd className="search-shortcut">ESC</kbd>
        </div>
        {loading && <div className="search-loading">搜尋中...</div>}
        {error && !loading && <div className="search-empty">{error}</div>}
        {showRecent && (
          <div className="search-recent">
            <div className="search-recent-header">最近瀏覽</div>
            <ul className="search-results">
              {recentIssues.map((entry, index) => (
                <li
                  key={entry.id}
                  className={`search-result-item ${index === selectedIndex ? "selected" : ""}`}
                  onClick={() => { close(); navigate(`/issues/${entry.id}`); }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <span className="search-result-id">#{entry.id}</span>
                  <span className="search-result-subject">{entry.subject}</span>
                  <span className="search-result-meta">{entry.projectName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {results.length > 0 && !loading && (
          <ul className="search-results">
            {results.map((result, index) => (
              <li
                key={result.id}
                className={`search-result-item ${index === selectedIndex ? "selected" : ""}`}
                onClick={() => selectResult(result)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="search-result-id">#{result.id}</span>
                <span className="search-result-subject">{result.subject}</span>
                <span className="search-result-meta">{result.projectName} · {result.statusName}</span>
              </li>
            ))}
          </ul>
        )}
        {!loading && !error && results.length === 0 && query.trim() && !isNumeric(query.trim()) && (
          <div className="search-hint">按 Enter 搜尋</div>
        )}
      </div>
    </div>
  );
}

export default SearchDialog;
