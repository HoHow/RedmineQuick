# issue-sort Specification

## Purpose

TBD - created by archiving change 'watched-sort-recent'. Update Purpose after archive.

## Requirements

### Requirement: Sort issue list by column header

The system SHALL allow users to sort the issue list by clicking on column headers.

#### Scenario: User clicks a column header to sort

- **WHEN** the user clicks on a sortable column header (id, priority, status, updated_on)
- **THEN** the system SHALL sort the issue list by that column in ascending order
- **AND** the system SHALL display an ascending indicator (▲) on the active column header

#### Scenario: User clicks the same column header again

- **WHEN** the user clicks on an already active sort column
- **THEN** the system SHALL reverse the sort direction to descending
- **AND** the system SHALL display a descending indicator (▼) on the active column header

#### Scenario: User clicks a different column header

- **WHEN** the user clicks on a different sortable column header
- **THEN** the system SHALL sort by the new column in ascending order

#### Scenario: Display updated_on column

- **WHEN** the issue list is rendered
- **THEN** the system SHALL display an "更新" column showing relative time (e.g., "2小時前", "3天前") for each issue

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