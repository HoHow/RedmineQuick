## ADDED Requirements

### Requirement: Display related issues on issue detail page
The system SHALL display a list of related issues (Redmine relations) on the issue detail page, positioned between the children section and the attachments section.

#### Scenario: Issue has related issues
- **WHEN** the user views an issue detail page and the issue has relations
- **THEN** the system SHALL display a "相關議題" section showing all related issues, each displaying: relation type label in Chinese, tracker name, issue number (#ID), subject, status name, and assigned user name

#### Scenario: Issue has no related issues
- **WHEN** the user views an issue detail page and the issue has no relations
- **THEN** the system SHALL NOT display the "相關議題" section

#### Scenario: Related issue navigation
- **WHEN** the user clicks on a related issue row
- **THEN** the system SHALL navigate to that related issue's detail page

#### Scenario: Related issue with no assignee
- **WHEN** a related issue has no assigned user
- **THEN** the system SHALL display a dash ("—") in the assigned user column

#### Scenario: Relation type direction inversion
- **WHEN** the current issue is the target (issue_to_id) of a relation
- **THEN** the system SHALL display the inverted relation type label (e.g., "blocks" becomes "被阻擋", "duplicates" becomes "被重複")

#### Scenario: Relation type labels
- **WHEN** the system displays a relation type
- **THEN** the system SHALL use the following Chinese labels: relates→關聯, duplicates→重複, duplicated→被重複, blocks→阻擋, blocked→被阻擋, precedes→在前, follows→在後, copied_to→複製到, copied_from→從…複製

#### Scenario: Inaccessible related issue
- **WHEN** a related issue cannot be fetched due to permissions or deletion
- **THEN** the system SHALL silently omit that issue from the list without displaying an error
