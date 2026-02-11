import { invoke } from "@tauri-apps/api/core";

// Common types
export interface IdName {
  id: number;
  name: string;
}

export interface User {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  mail: string;
}

export interface Project {
  id: number;
  name: string;
  identifier: string;
  description: string | null;
}

export interface Issue {
  id: number;
  subject: string;
  description: string | null;
  project: IdName;
  tracker: IdName;
  status: IdName;
  priority: IdName;
  author: IdName;
  assignedTo: IdName | null;
  parent: { id: number } | null;
  startDate: string | null;
  dueDate: string | null;
  estimatedHours: number | null;
  doneRatio: number;
  watchers: IdName[] | null;
}

export interface IssueParams {
  trackerId?: number;
  subject?: string;
  description?: string;
  statusId?: number;
  priorityId?: number;
  assignedToId?: number;
  parentIssueId?: number;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  doneRatio?: number;
  watcherUserIds?: number[];
}

export interface TimeEntryParams {
  issueId: number;
  hours: number;
  activityId: number;
  comments?: string;
  spentOn?: string;
}

export interface RedmineConfig {
  url: string;
  apiKey: string;
}

export interface Membership {
  id: number;
  user: IdName | null;
  roles: IdName[];
}

// Connection
export function testConnection(url: string, apiKey: string): Promise<User> {
  return invoke("test_connection", { url, apiKey });
}

export function saveConfig(url: string, apiKey: string): Promise<void> {
  return invoke("save_config", { url, apiKey });
}

export function loadConfig(): Promise<RedmineConfig | null> {
  return invoke("load_config");
}

// Projects
export function listProjects(): Promise<Project[]> {
  return invoke("list_projects");
}

// Issues
export function listMyIssues(): Promise<Issue[]> {
  return invoke("list_my_issues");
}

export function listProjectIssues(projectId: number): Promise<Issue[]> {
  return invoke("list_project_issues", { projectId });
}

export function getIssue(issueId: number): Promise<Issue> {
  return invoke("get_issue", { issueId });
}

export function createIssue(projectId: number, params: IssueParams): Promise<Issue> {
  return invoke("create_issue", { projectId, params });
}

export function updateIssue(issueId: number, params: IssueParams): Promise<void> {
  return invoke("update_issue", { issueId, params });
}

// Time entries
export function createTimeEntry(params: TimeEntryParams): Promise<void> {
  return invoke("create_time_entry", { params });
}

// Enumerations
export function listTrackers(): Promise<IdName[]> {
  return invoke("list_trackers");
}

export function listStatuses(): Promise<IdName[]> {
  return invoke("list_statuses");
}

export function listPriorities(): Promise<IdName[]> {
  return invoke("list_priorities");
}

export function listActivities(): Promise<IdName[]> {
  return invoke("list_activities");
}

export function listMemberships(projectId: number): Promise<Membership[]> {
  return invoke("list_memberships", { projectId });
}
