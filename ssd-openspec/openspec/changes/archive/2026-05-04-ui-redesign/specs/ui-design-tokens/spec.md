## ADDED Requirements

### Requirement: Design tokens system
The system SHALL implement a comprehensive CSS design tokens system with variables for colors, typography, spacing, border-radius, and shadows.

#### Scenario: Color tokens are available
- **WHEN** CSS loads
- **THEN** system defines all color variables: --purple, --purple-dark, --gradient-total, --bg-app, --white, --border, --input-bg, --text-primary, --text-label, --text-secondary, --text-placeholder, --badge-interest-bg, --badge-interest-text, --badge-total-bg, --badge-total-text, --toast-bg, --toast-border

#### Scenario: Typography tokens are available
- **WHEN** CSS loads
- **THEN** system loads Inter font (400, 500, 600, 700 weights) via Google Fonts
- **AND** typography variables are defined for consistent text styling

#### Scenario: Spacing tokens are available
- **WHEN** CSS loads
- **THEN** system defines spacing variables for consistent margins and padding throughout the application

#### Scenario: Border radius tokens are available
- **WHEN** CSS loads
- **THEN** system defines border radius variables for consistent corner rounding (8px, 14px, 16px)