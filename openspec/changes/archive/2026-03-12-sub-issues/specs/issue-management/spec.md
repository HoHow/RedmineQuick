## ADDED Requirements

### Requirement: Display child issues on issue detail page
The system SHALL display a list of direct child issues on the issue detail page, positioned between the description section and the attachments section.

#### Scenario: Issue has child issues
- **WHEN** the user views an issue detail page and the issue has child issues
- **THEN** the system SHALL display a "子議題" section showing all direct child issues, each displaying: tracker name, issue number (#ID), subject, status name, and assigned user name

#### Scenario: Issue has no child issues
- **WHEN** the user views an issue detail page and the issue has no child issues
- **THEN** the system SHALL NOT display the "子議題" section

#### Scenario: Child issue navigation
- **WHEN** the user clicks on a child issue row
- **THEN** the system SHALL navigate to that child issue's detail page

#### Scenario: Child issue with no assignee
- **WHEN** a child issue has no assigned user
- **THEN** the system SHALL display a dash ("—") in the assigned user column
