## ADDED Requirements

### Requirement: API contract definition
The system SHALL define a clear REST API contract between frontend and backend following REST principles.

#### Scenario: Calculate loan API contract
- **WHEN** frontend needs to calculate a loan
- **THEN** system SHALL use POST method to endpoint /api/calculate-loan
- **THEN** system SHALL send request body with JSON schema: {"amount": number, "rate": number, "term": number}
- **THEN** system SHALL receive response with JSON schema: {"monthlyPayment": number, "installments": [{"period": number, "payment": number, "principal": number, "interest": number, "balance": number}]}

#### Scenario: Stateful communication
- **WHEN** each API request is processed
- **THEN** system SHALL treat each calculation as independent with no session state

### Requirement: Request validation rules
The API contract SHALL define validation rules for all requests.

#### Scenario: Missing required parameters
- **WHEN** a required parameter is missing from request
- **THEN** system SHALL return HTTP 400 Bad Request with error details

#### Scenario: Loan amount validation
- **WHEN** frontend sends loan calculation request
- **THEN** amount SHALL be required field
- **THEN** amount SHALL be positive number greater than 0
- **THEN** amount SHALL be reasonable upper bound (e.g., less than 10,000,000)

#### Scenario: Interest rate validation
- **WHEN** frontend sends loan calculation request
- **THEN** rate SHALL be required field
- **THEN** rate SHALL be positive number >= 0 and <= 100
- **THEN** rate SHALL represent annual percentage rate

#### Scenario: Loan term validation
- **WHEN** frontend sends loan calculation request
- **THEN** term SHALL be required field
- **THEN** term SHALL be positive integer between 1 and 360 (30 years in months)

### Requirement: Response format standards
The API contract SHALL define consistent response formats.

#### Scenario: Success response format
- **WHEN** calculation completes successfully
- **THEN** system SHALL return HTTP 200 status
- **THEN** system SHALL return Content-Type: application/json
- **THEN** system SHALL include monthlyPayment and installments array with consistent decimal precision

#### Scenario: Calculation response format
- **WHEN** calculation completes successfully
- **THEN** response SHALL include monthlyPayment with 2 decimal places
- **THEN** response SHALL include installments array with period, principal, interest, and balance fields

#### Scenario: Error response format
- **WHEN** API request fails
- **THEN** system SHALL return appropriate HTTP status code (400, 500)
- **THEN** system SHALL return Content-Type: application/json
- **THEN** system SHALL return JSON with error field containing descriptive message

#### Scenario: Validation failure response
- **WHEN** validation fails
- **THEN** system SHALL return HTTP 400 status
- **WHEN** unexpected error occurs
- **THEN** system SHALL return HTTP 500 status with error field

### Requirement: Communication protocol
The system SHALL use standard HTTP/JSON communication.

#### Scenario: Request headers
- **WHEN** frontend sends API requests
- **THEN** system SHALL include Content-Type: application/json header
- **THEN** system SHALL include appropriate CORS headers for localhost development

#### Scenario: Response headers
- **WHEN** backend responds to requests
- **THEN** system SHALL include Content-Type: application/json header
- **THEN** system SHALL include Access-Control-Allow-Origin headers for frontend domain