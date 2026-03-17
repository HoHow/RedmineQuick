# watched-issues Specification

## Purpose

TBD - created by archiving change 'watched-sort-recent'. Update Purpose after archive.

## Requirements

### Requirement: Display watched issues on dashboard

The system SHALL provide a "追蹤中" tab on the dashboard's issue panel to display all issues the current user is watching.

#### Scenario: User switches to watched tab

- **WHEN** the user clicks the "追蹤中" tab on the dashboard
- **THEN** the system SHALL fetch and display all issues where the current user is a watcher

#### Scenario: Statistics cards hidden on watched tab

- **WHEN** the watched tab is selected
- **THEN** the system SHALL NOT display the summary statistics cards

#### Scenario: Watched issues support inline status and priority change

- **WHEN** the watched tab is selected and issues are displayed
- **THEN** the system SHALL allow inline status and priority changes, same as the open/closed tabs

<!-- @trace
source: watched-sort-recent
updated: 2026-03-17
code:
  - src-tauri/src/lib.rs
  - src/lib/api.ts
  - src/components/IssueList.tsx
  - src/components/SearchDialog.tsx
  - src/pages/DashboardPage.tsx
  - src/App.css
  - src-tauri/src/commands/issues.rs
  - src-tauri/src/redmine/client.rs
  - src/pages/IssueDetailPage.tsx
-->