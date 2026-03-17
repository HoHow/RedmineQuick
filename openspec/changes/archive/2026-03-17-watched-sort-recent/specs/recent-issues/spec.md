## Purpose

Track recently viewed issues and display them in the search dialog for quick navigation back to previously visited issues.

## ADDED Requirements

### Requirement: Track and display recently viewed issues

The system SHALL track issues viewed by the user and display them in the search dialog for quick access.

#### Scenario: User views an issue detail page

- **WHEN** the user navigates to an issue detail page and the issue loads successfully
- **THEN** the system SHALL save the issue's id, subject, and project name to localStorage
- **AND** the system SHALL keep a maximum of 10 recent entries, with the newest first
- **AND** if the issue was already in the list, it SHALL be moved to the top

#### Scenario: User opens search dialog with empty query

- **WHEN** the user opens the search dialog (Cmd+K) and the search query is empty
- **AND** there are recent issues stored
- **THEN** the system SHALL display the recent issues list with a "最近瀏覽" header

#### Scenario: User clicks a recent issue

- **WHEN** the user clicks on a recent issue in the search dialog
- **THEN** the system SHALL navigate to that issue's detail page and close the dialog

#### Scenario: No recent issues stored

- **WHEN** the user opens the search dialog with an empty query and no recent issues exist
- **THEN** the system SHALL display the default empty state
