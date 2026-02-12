import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { listen } from "@tauri-apps/api/event";
import { onAction } from "@tauri-apps/plugin-notification";
import { useNavigate } from "react-router";

interface IssueNotification {
  id: string;
  issueId: number;
  subject: string;
  projectName: string;
  createdAt: string;
  read: boolean;
}

interface NewIssueEvent {
  issueId: number;
  subject: string;
  projectName: string;
}

interface NotificationContextType {
  notifications: IssueNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const STORAGE_KEY = "notifications";
const MAX_NOTIFICATIONS = 50;

function loadFromStorage(): IssueNotification[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore
  }
  return [];
}

function saveToStorage(notifications: IssueNotification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<IssueNotification[]>(loadFromStorage);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 監聽 Rust 端 emit 的 new-issue 事件
  useEffect(() => {
    const unlisten = listen<NewIssueEvent>("new-issue", (event) => {
      const { issueId, subject, projectName } = event.payload;
      const notification: IssueNotification = {
        id: `${issueId}-${Date.now()}`,
        issueId,
        subject,
        projectName,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => {
        const updated = [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
        saveToStorage(updated);
        return updated;
      });
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  // 監聽 OS 通知點擊 → 跳轉到 Issue
  useEffect(() => {
    const promise = onAction((notification) => {
      const extra = notification.extra as Record<string, unknown> | undefined;
      if (extra?.issueId) {
        navigate(`/issues/${extra.issueId}`);
      }
    });
    return () => {
      promise.then((listener) => listener.unregister());
    };
  }, [navigate]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveToStorage([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

export function clearNotificationStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
