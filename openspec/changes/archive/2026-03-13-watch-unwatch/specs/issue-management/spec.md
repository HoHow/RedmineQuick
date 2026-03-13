## ADDED Requirements

### Requirement: Quick watch and unwatch issue
The system SHALL provide a toggle button on the issue detail page header to allow the current user to watch or unwatch the issue.

#### Scenario: User is not watching the issue
- **WHEN** the user views an issue detail page and is not in the watchers list
- **THEN** the system SHALL display a "追蹤" button in the header actions area

#### Scenario: User is watching the issue
- **WHEN** the user views an issue detail page and is in the watchers list
- **THEN** the system SHALL display a "取消追蹤" button in the header actions area

#### Scenario: Watch an issue
- **WHEN** the user clicks the "追蹤" button
- **THEN** the system SHALL call the Redmine API to add the current user as a watcher and refresh the issue data to reflect the updated watchers list

#### Scenario: Unwatch an issue
- **WHEN** the user clicks the "取消追蹤" button
- **THEN** the system SHALL call the Redmine API to remove the current user from watchers and refresh the issue data to reflect the updated watchers list

#### Scenario: Watch or unwatch fails
- **WHEN** the watch or unwatch API call fails
- **THEN** the system SHALL display the error message returned by the API
