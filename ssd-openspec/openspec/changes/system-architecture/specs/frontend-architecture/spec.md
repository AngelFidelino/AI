## ADDED Requirements

### Requirement: User input collection
The React frontend SHALL provide input fields for loan amount, interest rate, and loan term.

#### Scenario: Valid loan parameters input
- **WHEN** user enters valid loan amount (positive number), interest rate (positive percentage), and loan term (positive integer in months)
- **THEN** system SHALL enable the calculate button and allow calculation submission

#### Scenario: Invalid loan parameters input
- **WHEN** user enters invalid data (negative amounts, zero, or non-numeric values)
- **THEN** system SHALL display appropriate validation error messages and disable calculation

### Requirement: Input validation
The React frontend SHALL validate all user inputs before sending API requests.

#### Scenario: Client-side validation
- **WHEN** user submits the form
- **THEN** system SHALL validate required fields are present and within acceptable ranges
- **THEN** system SHALL prevent API calls if validation fails

### Requirement: API communication
The React frontend SHALL communicate with the backend via REST API calls.

#### Scenario: Calculate loan request
- **WHEN** user clicks calculate button with valid inputs
- **THEN** system SHALL send POST request to backend API endpoint with JSON payload
- **THEN** system SHALL handle loading states during API call

#### Scenario: API error handling
- **WHEN** backend API returns an error response
- **THEN** system SHALL display user-friendly error message
- **THEN** system SHALL not crash or display technical error details

### Requirement: Results visualization
The React frontend SHALL display calculation results in a clear, readable format.

#### Scenario: Display monthly payment
- **WHEN** backend returns successful calculation response
- **THEN** system SHALL display calculated monthly payment prominently
- **THEN** system SHALL format currency value appropriately

#### Scenario: Display amortization table
- **WHEN** backend returns successful calculation response
- **THEN** system SHALL display amortization table with columns for payment number, principal, interest, and remaining balance
- **THEN** system SHALL format all monetary values appropriately