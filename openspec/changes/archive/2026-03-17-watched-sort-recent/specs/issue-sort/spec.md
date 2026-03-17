## Purpose

Allow users to sort issue lists by clicking column headers, enabling quick identification of high-priority, recently updated, or specific issues.

## ADDED Requirements

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
