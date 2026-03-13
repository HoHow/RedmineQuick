# dashboard-stats Specification

## Purpose

TBD - created by archiving change 'dashboard-stats'. Update Purpose after archive.

## Requirements

### Requirement: Display issue summary statistics cards on dashboard

The system SHALL display four summary statistics cards above the issue list on the dashboard page, computed from the current user's open issues.

#### Scenario: Dashboard displays total open issue count

- **WHEN** the user views the dashboard with open issues tab selected
- **THEN** the system SHALL display a "待處理" card showing the total number of open issues

#### Scenario: Dashboard displays overdue issue count

- **WHEN** the user views the dashboard with open issues tab selected
- **THEN** the system SHALL display a "逾期" card showing the count of open issues where `due_date` is before today and `due_date` is not null
- **AND** the count SHALL be displayed in red when greater than zero

#### Scenario: Dashboard displays due-this-week issue count

- **WHEN** the user views the dashboard with open issues tab selected
- **THEN** the system SHALL display a "本週到期" card showing the count of open issues where `due_date` falls within the current ISO week (Monday to Sunday)

#### Scenario: Dashboard displays high priority issue count

- **WHEN** the user views the dashboard with open issues tab selected
- **THEN** the system SHALL display a "高優先" card showing the count of open issues where `priority.id >= 4`

#### Scenario: Statistics cards hidden on closed tab

- **WHEN** the user switches to the closed issues tab
- **THEN** the system SHALL NOT display the summary statistics cards

<!-- @trace
source: dashboard-stats
updated: 2026-03-13
code:
  - src/App.css
  - src/pages/DashboardPage.tsx
-->