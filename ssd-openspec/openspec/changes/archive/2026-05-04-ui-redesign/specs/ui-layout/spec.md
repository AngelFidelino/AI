## ADDED Requirements

### Requirement: Responsive layout system
The system SHALL implement a responsive layout system with sidebar navigation and main content area.

#### Scenario: Desktop layout (> 900px)
- **WHEN** viewport width is >= 900px
- **THEN** system displays 80px vertical sidebar with gradient #4f39f6 → #372aac
- **AND** system displays two-column layout: 389px form | 1fr results
- **AND** system applies primary padding: 48px 40px
- **AND** system shows centered calculator icon in sidebar

#### Scenario: Tablet layout (600px - 899px)
- **WHEN** viewport width is between 600px and 899px
- **THEN** system hides sidebar
- **AND** system displays single column layout
- **AND** system applies reduced padding: 24px 20px
- **AND** system displays payment breakdown in single column

#### Scenario: Mobile layout (< 600px)
- **WHEN** viewport width is < 600px
- **THEN** system hides sidebar
- **AND** system displays single column layout
- **AND** system applies minimal padding: 20px 16px
- **AND** system displays payment grid in single column
- **AND** system enables horizontal scrolling for table with min-width 600px

#### Scenario: Background styling
- **WHEN** application loads
- **THEN** system applies #f8fafc background color to app container