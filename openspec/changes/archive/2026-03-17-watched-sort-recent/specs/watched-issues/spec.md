## Purpose

Display watched issues as a dedicated tab on the dashboard, allowing users to view all issues they are watching in one place.

## ADDED Requirements

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
